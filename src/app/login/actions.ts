'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from 'utils/supabase/server'; // ✅ server-only client

// ---- LOGIN (server) ----
// Used by <form action={login}>; sets httpOnly cookies and redirects
export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;

  if (!email || !password) return 'Email and password are required.';

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return error.message;

  revalidatePath('/', 'layout');
  redirect('/private');
}

// ---- FETCH ACCOUNT DATA (server) ----
export async function getAccountData() {
  const supabase = await createClient();

  const { data: userRes, error: sessionError } = await supabase.auth.getUser();
  const user = userRes?.user;
  if (sessionError || !user?.email) return { error: 'No session found.' };

  const lowerCaseEmail = user.email.toLowerCase();

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

// ---- LOGOUT (server) ----
// Clears httpOnly cookies used by RSC/SSR and redirects.
// NOTE: The client should ALSO call supabase.auth.signOut() before invoking this.
export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut(); // clears server cookies
  console.log('successfully logged out (server)');

  revalidatePath('/', 'layout');
  redirect('/login');
}

// ---- PASSWORD RESET (server) ----
export async function sendPasswordResetEmail(formData: FormData) {
  const supabase = await createClient();

  const email = (formData.get('email') as string)?.trim();
  if (!email) {
    return { success: false, message: 'Please provide an email address' };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/update-password`,
  });

  if (error) {
    console.error('Password reset error:', error.message);
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Password reset link sent to your email!' };
}
