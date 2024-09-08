'use server'

import { createClient } from '../../../utils/supabase/client'

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  interests: string;
}

export default async function getFollowers(user_id: number | null): Promise<UserProfile[] | null> {
  if (!user_id) {
    console.log('No valid user ID provided.');
    return null;
  }

  const supabase = createClient();
  console.log('Fetching followers for user ID:', user_id);

  try {
    // Fetch follower IDs from the 'followers' table where 'user_id' is the given user's ID
    const { data: followerIds, error: followerIdsError } = await supabase
      .from('followers')
      .select('follower_id')
      .eq('followed_id', user_id);

    if (followerIdsError) {
      throw followerIdsError;
    }

    if (!followerIds || followerIds.length === 0) {
      console.log('No followers found.');
      return [];
    }

    // Extract follower IDs into an array
    const ids = followerIds.map((follower) => follower.follower_id);

    // Fetch profiles of the followers based on their IDs
    const { data: profiles, error: profilesError } = await supabase
      .from('userdata')
      .select('*')
      .in('id', ids);

    if (profilesError) {
      throw profilesError;
    }

    return profiles || [];
  } catch (error) {
    console.log('Error fetching followers or profiles:', error);
    return null;
  }
}
