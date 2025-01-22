'use server'

import { createClient } from 'utils/supabase/client'

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  interests: string;
}

export default async function getFollowing(user_id: number | null): Promise<UserProfile[] | null> {
  if (!user_id) {
    console.log('No valid user ID provided.');
    return null;
  }

  const supabase = createClient();
  console.log('Fetching following for user ID:', user_id);

  try {
    // Fetch followed IDs from the 'followers' table where 'follower_id' is the given user's ID
    const { data: followedIds, error: followedIdsError } = await supabase
      .from('followers')
      .select('followed_id')
      .eq('follower_id', user_id)
      .limit(12);

    if (followedIdsError) {
      throw followedIdsError;
    }

    if (!followedIds || followedIds.length === 0) {
      console.log('No following found.');
      return [];
    }

    // Extract followed IDs into an array
    const ids = followedIds.map((follower) => follower.followed_id);
    console.log('Following IDs:', ids);

    // Fetch profiles of the followed users based on their IDs
    const { data: profiles, error: profilesError } = await supabase
      .from('userdata')
      .select('*')
      .in('id', ids);

    if (profilesError) {
      throw profilesError;
    }

    return profiles || [];
  } catch (error) {
    console.log('Error fetching following profiles:', error);
    return null;
  }
}
