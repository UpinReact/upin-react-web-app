'use server';

import { createClient } from 'utils/supabase/client';

interface UserProfile {
  id: number;
  firstname: string;
  lastname: string;
  profilephotourl: string;
  gender?: string;
}

export default async function getFollowing(user_id: number | null): Promise<UserProfile[]> {
  if (!user_id) {
    console.warn('No valid user ID provided.');
    return [];
  }

  const supabase = createClient();

  try {
    console.log(`fetching following users for user ${user_id}`)
    // Use the RPC function to fetch followed users
    const { data: profiles, error } = await supabase
      .rpc('fetch_followed_users', { follower_user_id: user_id });

    if (error) {
      console.error('Error fetching following profiles via RPC:', error.message);
      throw error;
    }

    return profiles || [];
  } catch (error) {
    console.error('Error fetching following profiles:', error);
    return [];
  }
}