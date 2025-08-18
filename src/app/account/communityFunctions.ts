'use server'
import { createClient } from 'utils/supabase/server' // Use server client for server actions

interface Community {
    id: number;
    community_name: string;
    community_description?: string;
    owner_id?: number;
    privacy_status?: string;
    city?: string;
    state?: string;
    country?: string;
    community_photo_url?: string;
    created_at?: string;
    owner_name?: string;
    community_members?: number;
    radius?: number;
}

export default async function getCommunity(user_id: number | null): Promise<Community[] | null> {
    if (!user_id) {
        console.log('No valid user ID provided.');
        return null;
    }

    const supabase = await createClient();
    console.log('Fetching communities for user ID:', user_id);

    try {
        // First, get community IDs that the user is a member of
        let { data: communityMemberships, error: membershipError } = await supabase
            .from('communitymembers')
            .select('community_id')
            .eq("user_id", user_id);
        
        if (membershipError) {
            throw membershipError;
        }

        if (!communityMemberships || communityMemberships.length === 0) {
            console.log('No community memberships found.');
            return [];
        }

        // Extract community IDs
        const communityIds = communityMemberships.map((membership) => membership.community_id);
        console.log('Community IDs:', communityIds);

        // Fetch detailed community info for each community using RPC
        const communityPromises = communityIds.map(async (communityId) => {
            const { data, error } = await supabase.rpc('fetch_community_info', {
                community_id_param: communityId,
            });

            if (error) {
                console.error(`Error fetching community info for ID ${communityId}:`, error);
                return null;
            }

            return data && data.length > 0 ? data[0] : null; // RPC returns an array, take first item
        });

        // Wait for all community info to be fetched
        const communityResults = await Promise.all(communityPromises);
        
        // Filter out null results and ensure we have valid communities
        const communities = communityResults.filter((community): community is Community => 
            community !== null && typeof community === 'object'
        );

        console.log('Fetched Communities:', communities);
        return communities;

    } catch (error) {
        console.error("Error fetching communities:", error);
        return null;
    }
}

// Alternative version if you want to fetch all at once (if RPC supports multiple IDs)
export async function getCommunityBatch(user_id: number | null): Promise<Community[] | null> {
    if (!user_id) {
        console.log('No valid user ID provided.');
        return null;
    }

    const supabase = await createClient();
    console.log('Fetching communities for user ID:', user_id);

    try {
        // If your RPC can handle fetching communities by user_id directly
        const { data, error } = await supabase.rpc('fetch_user_communities', {
            user_id_param: user_id,
        });

        if (error) {
            console.error('Error fetching user communities:', error);
            return null;
        }

        console.log('Fetched Communities:', data);
        return data || [];

    } catch (error) {
        console.error("Error fetching communities:", error);
        return null;
    }
}