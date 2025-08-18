// app/pin/PinFunctions.ts
import { createClient } from 'utils/supabase/server';

export interface PinData {
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