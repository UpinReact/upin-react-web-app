'use server';

import { createClient } from 'utils/supabase/client';

interface UserProfile {
  id: number;
  firstname: string;
  lastname: string;
  profilephotourl: string;
  gender?: string
 }

export default async function getFollowers(user_id: number | null): Promise<UserProfile[]> {
  if (!user_id) {
    console.warn('No valid user ID provided.');
    return [];
  }

  const supabase = createClient();

  try {
    // Use the RPC function to fetch followers
    const { data: profiles, error } = await supabase
      .rpc('get_followers', { followed_user_id: user_id });

    if (error) {
      console.error('Error fetching followers via RPC:', error.message);
      throw error;
    }

    return profiles || [];
  } catch (error) {
    console.error('Error fetching followers:', error);
    return [];
  }
}