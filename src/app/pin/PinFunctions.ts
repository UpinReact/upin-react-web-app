// app/pin/PinFunctions.ts
import { createClient } from 'utils/supabase/server';

export interface PinData {
  isgooglesearch: boolean;
  pin_type: string;
  longitude: any;
  latitude: any;
  id: string;
  meetupname: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  mainphotourl?: string;
  // Add other pin fields as needed
}

export interface UserData {
  id: string;
  userUID: string;
  // Add other user fields as needed
}

export interface JoinedUser {
  participant_id: string;
}

// Get user data by UID
export async function getUserByUID(userUID: string): Promise<UserData | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("userdata")
    .select("*")
    .eq("userUID", userUID)
    .single();

  if (error) {
    console.error('Error fetching user data:', error);
    throw new Error(`Error fetching user data: ${error.message}`);
  }

  return data;
}

// Check if user has joined a pin
export async function checkUserJoinedPin(pinId: string, userId: string): Promise<boolean> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("pinparticipants")
    .select("*")
    .eq("pin_id", pinId)
    .eq("user_id", userId);

  if (error) {
    console.error('Error checking if user joined pin:', error);
    throw new Error(`Error checking user participation: ${error.message}`);
  }

  return data && data.length > 0;
}

// Get pin data by ID
export async function getPinById(pinId: string): Promise<PinData | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('pins')
    .select('*')
    .eq('id', pinId)
    .single();

  if (error) {
    console.error('Error fetching pin data:', error);
    throw new Error(`Error fetching pin data: ${error.message}`);
  }

  return data;
}

// Get joined users for a pin
export async function getJoinedUsers(pinId: string): Promise<JoinedUser[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("pinparticipants")
    .select("participant_id")
    .eq("pin_id", pinId);

  if (error) {
    console.error('Error fetching joined users:', error);
    throw new Error(`Error fetching participant data: ${error.message}`);
  }

  return data || [];
}

// Get current user from session
export async function getCurrentUser() {
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error fetching auth user:', error);
    return null;
  }

  return data?.user || null;
}

// Combined function to get user participation status
export async function getUserParticipationStatus(pinId: string, userUID: string) {
  try {
    const userData = await getUserByUID(userUID);
    if (!userData) {
      throw new Error('User not found');
    }

    const hasJoined = await checkUserJoinedPin(pinId, userData.id);
    
    return {
      userData,
      hasJoined,
      participantId: userData.id
    };
  } catch (error) {
    console.error('Error getting user participation status:', error);
    throw error;
  }
}

// Check user pin status using RPC
export async function checkUserPinStatus(userId: string, pinId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase.rpc('check_user_pin_status', {
    user_id_param: userId,
    pin_id_param: pinId
  });

  if (error) {
    console.error("Error fetching user pin status:", error.message);
    return null;
  }

  return data[0];
}

// Get nearby pins using RPC
export async function getNearbyPins(latitude: number, longitude: number, radiusInMiles: number) {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase.rpc('fetch_nearby_pins', {
      _latitude: latitude,
      _longitude: longitude,
      _radius_in_miles: radiusInMiles
    });

    if (error) {
      console.error('Error fetching nearby pins:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching nearby pins:', error);
    return null;
  }
}

// Get pin ages using RPC
export async function getPinAges(pinId: string) {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase.rpc('get_pin_ages', {
      pin_id_param: pinId,
    });

    if (error) {
      console.error('Error fetching pin ages:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error getting ages:', error);
    return null;
  }
}

// Get pin request ID
export async function getPinRequestID(pinID: string, userID: string) {
  const supabase = await createClient();
  
  const { data: requestId, error } = await supabase
    .from('pininvites')
    .select('id')
    .eq('invitee_id', userID)
    .eq('pin_id', pinID)
    .eq('status', "requested");

  if (error) {
    console.error('Error checking request id:', error.message);
    throw new Error('Log check failed');
  }

  return requestId[0].id;
}

// Fetch host joined pins
export async function fetchHostJoinedPins(userId: string) {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase.rpc('fetch_host_joined_pins', {
      host_user_id: userId
    });

    if (error) {
      console.error('Error fetching host joiners:', error.message);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Unexpected error fetching host joiners:', error);
    return null;
  }
}

// Fetch active pins
export async function fetchActivePins(userId: string) {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase.rpc("fetch_active_pins", { 
      user_id_param: userId 
    });

    if (error) {
      console.error("Error fetching active pins:", error.message);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching active pins:", error.message);
    return [];
  }
}

// Fetch promoted pins
export async function fetchPromotedPins() {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase.rpc("fetch_promoted_pins");

    if (error) {
      console.error("Error fetching promoted pins:", error.message);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching promoted pins:", error.message);
    return [];
  }
}

// Insert shared pin
export async function insertSharedPin(user_id: string, pin_id: string) {
  const supabase = await createClient();
  
  try {
    if (!user_id || !pin_id) {
      throw new Error("Both user_id and pin_id are required.");
    }

    const { data, error } = await supabase
      .from("shared_pins")
      .insert([{ user_id, pin_id }]);

    if (error) {
      console.error("Error inserting shared pin:", error);
      return { success: false, error: error.message };
    }

    console.log("Shared pin inserted successfully:", data);
    return { success: true };
  } catch (error: any) {
    console.error("Error in insertSharedPin function:", error);
    return { success: false, error: error.message };
  }
}

// Fetch shared pin count
export async function fetchSharedPinCount(pinId: string) {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .rpc('fetch_shared_pin_count', { pin_id_param: pinId });

    if (error) {
      console.error('Error fetching shared pin count:', error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Unexpected error fetching shared pin count:', err);
    throw err;
  }
}

// Fetch pin chat ID
export async function fetchPinChatId(pinId: string) {
  const supabase = await createClient();
  
  console.log('Fetching chat ID for pin:', pinId);
  
  const { data: pinchatId, error } = await supabase
    .from('pinchats')
    .select('id')
    .eq('pin_id', pinId);

  if (error) {
    console.error('Error checking chat id:', error.message);
    throw new Error('Chat ID fetch failed');
  }

  if (!pinchatId || pinchatId.length === 0) {
    console.log('No chat found for pin:', pinId);
    return null;
  }

  return pinchatId[0].id;
}

// Fetch invited by user
export async function fetchInvitedByUser(pinId: string, inviteeId: string) {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('pininvites')
      .select('invited_by')
      .eq('pin_id', pinId)
      .eq('invitee_id', inviteeId)
      .eq('status', 'invited')
      .maybeSingle();

    if (error) {
      console.error('Error fetching invited_by:', error.message);
      return null;
    }

    return data?.invited_by || null;
  } catch (err) {
    console.error('Unexpected error in fetchInvitedByUser:', err);
    return null;
  }
}

// Delete pin
export async function deletePin(pinId: string) {
  const supabase = await createClient();
  
  try {
    const { error } = await supabase
      .from("pins")
      .delete()
      .eq("id", pinId);

    return { error };
  } catch (err: any) {
    console.error("Unexpected error deleting pin:", err.message);
    return { error: err };
  }
}

// Convert to community pin
export async function convertToCommunityPin(pinId: string, communityId: string) {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('pins')
      .update({
        is_community_hosted: true,
        community_id: communityId,
      })
      .eq('id', pinId);

    if (error) {
      console.error('Error updating pin:', error.message);
      return false;
    }

    console.log('Pin successfully updated to community pin:', data);
    return true;
  } catch (error) {
    console.error('Unexpected error updating pin:', error);
    return false;
  }
}

// Check if pin is community hosted
export async function isPinCommunityHosted(pinId: string) {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('pins')
      .select('is_community_hosted, community_id')
      .eq('id', pinId)
      .single();

    if (error) {
      console.error('Error fetching pin data:', error.message);
      return { isHosted: false, communityId: null };
    }

    return {
      isHosted: data.is_community_hosted,
      communityId: data.community_id,
    };
  } catch (error) {
    console.error('Unexpected error fetching pin data:', error);
    return { isHosted: false, communityId: null };
  }
}

// Fetch attended users
export async function fetchAttendedUsers(pinId: string) {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase.rpc('fetch_attended_users', {
      pin_id_param: pinId,
    });

    if (error) {
      console.error('Error calling fetch_attended_users RPC:', error.message);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching attended users:', error);
    throw error;
  }
}

// Duplicate pin
export async function duplicatePin(pinId: string, newDate: string) {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase.rpc('duplicate_pin', {
      pin_id: pinId,
      new_date: newDate,
    });

    if (error) {
      console.error('Error duplicating pin:', error);
      return null;
    } else {
      console.log('Pin duplicated successfully:', data);
      return data;
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    return null;
  }
}