'use server';

import { createClient } from 'utils/supabase/server';

interface UserProfile {
  id: number;
  firstname: string;
  lastname: string;
  profilephotourl: string;
}


// Get users who follow the specified user
export async function getFollowers(user_id: number | null): Promise<UserProfile[]> {
  console.log('🔍 getFollowers called with user_id:', user_id);
  
  if (!user_id) {
    console.warn('⚠️ No valid user ID provided to getFollowers');
    return [];
  }

    const supabase = await createClient();



  try {
    console.log('📡 Calling RPC get_followers with followed_user_id:', user_id);
    
    const { data: profiles, error } = await supabase
      .rpc('get_followers', { followed_user_id: user_id });



    if (error) {
      console.error('❌ Error fetching followers via RPC:', error.message);
      console.error('📋 Full error object:', error);
      throw error;
    }

    if (!profiles || profiles.length === 0) {
      console.info('📭 No followers found for user ID:', user_id);
      return [];
    }

 

    return profiles || [];
  } catch (error) {
    console.error('💥 Unexpected error in getFollowers:', error);
    console.error('📋 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return [];
  }
}

// Get users that the specified user follows
export async function getFollowing(user_id: number | null): Promise<UserProfile[]> {
  console.log('🔍 getFollowing called with user_id:', user_id);
  
  if (!user_id) {
    console.warn('⚠️ No valid user ID provided to getFollowing');
    return [];
  }

    const supabase = await createClient();


  try {
    console.log('📡 Calling RPC fetch_followed_users with user_id:', user_id);
    
    const { data: profiles, error } = await supabase
      .rpc('fetch_followed_users', { follower_user_id: user_id });

    console.log('📥 RPC fetch_followed_users response:', { 
      profilesCount: profiles?.length || 0, 
      hasError: !!error,
      errorMessage: error?.message 
    });

    if (error) {
      console.error('❌ Error fetching following via RPC:', error.message);
      console.error('📋 Full error object:', error);
      throw error;
    }

    if (!profiles || profiles.length === 0) {
      console.info('📭 No following found for user ID:', user_id);
      return [];
    }


    return profiles || [];
  } catch (error) {
    console.error('💥 Unexpected error in getFollowing:', error);
    console.error('📋 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return [];
  }
}

// Helper function to get both followers and following in one call
export async function getFollowersAndFollowing(user_id: number | null): Promise<{
  followers: UserProfile[];
  following: UserProfile[];
}> {
  
  if (!user_id) {
    console.error('⚠️ No valid user ID provided to getFollowersAndFollowing');
    return { followers: [], following: [] };
  }

  try {
    console.log('📡 Fetching both followers and following simultaneously');
    
    const [followers, following] = await Promise.all([
      getFollowers(user_id),
      getFollowing(user_id)
    ]);


    return { followers, following };
  } catch (error) {
    console.error('💥 Error in getFollowersAndFollowing:', error);
    return { followers: [], following: [] };
  }
}

export async function getFollowingStatuses(
  userId: number,
  otherUserId: number
): Promise<{ following_user: boolean; followed_by_user: boolean } | null> {
  
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_following_statuses", {
    user_id_param: userId,
    other_user_id_param: otherUserId,
  });

  if (error) {
    console.error("Error fetching following statuses:", error);
    return null;
  }

  return data && data.length > 0 ? data[0] : null;
}

export const getUserBadges = async (userId: number) => {
  try {

    const supabase = await createClient();

    const { data, error } = await supabase.rpc("get_user_badges", {
      p_user_id: userId,
    });

    if (error) {
      console.error("Error fetching badges:", error.message);
      return null;
    }

    return data;
  } catch (error: any) {
    console.error("Unexpected error fetching badges:", error.message);
    return null;
  }
};
