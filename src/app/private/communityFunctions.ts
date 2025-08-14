'use server'
import { createClient } from 'utils/supabase/client'

interface Community {
    id: number;
    community_name: string;
}

export default async function getCommunity(user_id: number | null): Promise<Community[] | null> {
    if (!user_id) {
        console.log('No valid user ID provided.');
        return null;
    }

    const supabase = createClient();
    console.log('Fetching communities for user ID:', user_id);

    try {
        // Fetch community IDs associated with the user
        let { data: communityids, error: communityidsErrors } = await supabase
            .from('communitymembers')
            .select('community_id')
            .eq("user_id", user_id);
        
        if (communityidsErrors) {
            throw communityidsErrors;
        }

        if (!communityids || communityids.length === 0) {
            console.log('No Communities found.');
            return [];
        }

        // Extract community IDs
        const ids = communityids.map((community) => community.community_id);
        // console.log('Community IDs:', ids);

        // Fetch community details using the IDs
        const { data: communities, error } = await supabase
            .from("communities")
            .select('id, community_name')
            .in('id', ids);

        if (error) {
            throw error;
        }
        
        // console.log('Fetched Communities:', communities);
                
        return communities || [];
    } catch (error) {
        console.log("Error fetching communities:", error);
        return null;  // Consistent return type
    }
}
