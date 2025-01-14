'use server';
import { createClient } from 'utils/supabase/client';

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  interests: string;
}

export default async function getFollowers(user_id: number | null): Promise<UserProfile[]> {
  if (!user_id) {
    console.warn('No valid user ID provided.');
    return [];
  }

  const supabase = createClient();
  console.info('Fetching following for user ID:', user_id);

  try {
    // Step 1: Fetch followed IDs from 'followers' table
    const { data: followedIds, error: followedIdsError } = await supabase
      .from('followers')
      .select('followed_id')
      .eq('follower_id', user_id);

    if (followedIdsError) {
      console.error('Error fetching followed IDs:', followedIdsError.message);
      throw followedIdsError;
    }

    if (!followedIds || followedIds.length === 0) {
      console.info('No following found for user ID:', user_id);
      return [];
    }

    // Extract followed IDs into an array
    const ids = followedIds.map((follower) => follower.followed_id);
    console.info('Following IDs:', ids);

    // Step 2: Fetch profiles of followed users from 'userdata' table
    const { data: profiles, error: profilesError } = await supabase
      .from('userdata')
      .select('*')
      .in('id', ids);

    if (profilesError) {
      console.error('Error fetching profiles of followed users:', profilesError.message);
      throw profilesError;
    }

    return profiles || [];
  } catch (error) {
    console.error('Error fetching following profiles:', error);
    return [];
  }
}
