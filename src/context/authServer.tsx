// lib/auth-server.ts
import { createClient } from 'utils/supabase/server';
import { cache } from 'react';
import { redirect } from 'next/navigation';

export interface UserData {
  profilePhotoURL: string;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  interests: string;
  bio?: string;
  userUID: string;
}

/**
 * Get the current authenticated user's data from userdata table
 * This is the server equivalent of useAuthHandler().userData
 */
export const getCurrentUserData = cache(async (): Promise<UserData | null> => {
  const supabase = await createClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.id) return null;
  
  try {
    const { data, error } = await supabase
      .from("userdata")
      .select("*")
      .eq("userUID", session.user.id)
      .single();

    if (error || !data) {
      console.error("❌ getCurrentUserData error:", error?.message);
      return null;
    }
    
    return data as UserData;
  } catch (err: any) {
    console.error("❌ getCurrentUserData error:", err.message);
    return null;
  }
});

/**
 * Get any user's data by their ID (for viewing other profiles)
 * Server equivalent of fetchUserData from client context
 */
export const getUserDataById = cache(async (userId: number): Promise<UserData | null> => {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from("userdata")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) {
      console.error("❌ getUserDataById error:", error?.message);
      return null;
    }
    
    return data as UserData;
  } catch (err: any) {
    console.error("❌ getUserDataById error:", err.message);
    return null;
  }
});

/**
 * Require authentication - redirect to login if not authenticated
 * Returns userData if authenticated, never returns null
 */
export const requireAuth = cache(async (): Promise<UserData> => {
  const userData = await getCurrentUserData();
  
  if (!userData) {
    redirect('/login');
  }
  
  return userData;
});