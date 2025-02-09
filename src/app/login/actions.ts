'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from 'utils/supabase/server'


export async function login(formData: FormData) {
  
  const supabase = await createClient()
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/private')
}

export async function getAccountData() {
  const supabase = await createClient()
    const { data: { user }, error: sessionError } = await supabase.auth.getUser();
    const lowerCaseEmail = user.email.toLowerCase();
    if (sessionError || !user) return { error: 'No session found.' };
 
    const { data: userData, error: userError } = await supabase
      .from('userdata')
      .select('*')
      .eq('email', lowerCaseEmail)
      .single();
      if (userError) {
        console.error('Error fetching user data:', userError.message);
        return { error: 'Failed to fetch user data.' };
      }
      
      return { user: userData };
    }
  

export async function logout() {
  const supabase = await createClient()

  await supabase.auth.signOut()
  console.log("successfully logged out")

  revalidatePath('/', 'layout')
  redirect('/login')
}


export async function sendPasswordResetEmail(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string;
  
  if (!email) {
    return { success: false, message: "Please provide an email address" };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/update-password`,
    });

    if (error) {
      console.error("Password reset error:", error.message);
      return { success: false, message: error.message };
    }

    return { success: true, message: "Password reset link sent to your email!" };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, message: "Failed to send reset email" };
  }
}

