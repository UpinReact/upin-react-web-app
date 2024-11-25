import { createClient } from '../../../utils/supabase/client';
import getFollowing from './following';
import getFollowers from './followers';
import getCommunity from './communityFunctions';

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  interests: string;
  // Add other fields as needed
}

interface ProfileData extends UserProfile {
  following: UserProfile[];
  followers: UserProfile[];
  community: { id: number; community_name: string }[];
}

export async function getProfile(userEmail: string | undefined): Promise<ProfileData | null> {
  const supabase = createClient();
  // console.log('Fetching profile data for user:', userEmail);

  try {
    const { data, error, status } = await supabase
      .from('userdata')
      .select("*")
      .eq('email', userEmail)
      .single();

    if (error && status !== 406) {
      console.log('Error fetching profile:', error);
      throw error;
    }

    if (data && data.id) {
      // Fetching the users the current user is following
      const following = await getFollowing(data.id);

      // Fetching the users following the current user
      const followers = await getFollowers(data.id);

      // Fetching the communities the user is a part of
      const communities = await getCommunity(data.id);
     
     
      
      
      return {
        ...data,
        following: following || [],
        followers: followers || [],
        community: communities || []
      };
    } else {
      console.log('User data or user ID is not available.');
      return null;
    }
  } catch (error) {
    console.log('Error in getProfile:', error);
    return null;
  }
}
