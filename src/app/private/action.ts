// app/private/action.ts
'use server';
import { createClient } from 'utils/supabase/server';

export const updateUserData = async (userId: string, formData: {
  firstName: string;
  lastName: string;
  interests: string;
  birthDate: string;
}) => {
  const supabase = await createClient();

  // Add validation
  if (!userId) {
    throw new Error('User ID is required');
  }

  const { data, error } = await supabase
    .from('userdata')
    .update({
      firstName: formData.firstName,
      lastName: formData.lastName,
      interests: formData.interests,
      birthDate: formData.birthDate
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
    throw new Error(error.message || 'Failed to update user data');
  }

  if (!data) {
    throw new Error('No data returned from update');
  }

  return {
    firstName: data.firstName,
    lastName: data.lastName,
    interests: data.interests,
    birthDate: data.birthDate
  };
};