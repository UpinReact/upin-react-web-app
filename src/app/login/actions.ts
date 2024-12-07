'use server';
// src/services/authService.ts
import {supabase}  from  "../../../utils/supabase/supabase";
import { cookies } from 'next/headers'; // Only for Next.js environment
import { revalidatePath} from 'next/cache';
import { redirect } from "next/navigation";

interface dataForm {
  email: string;
  password: string;
}

function validateForm({ email, password }: dataForm): string | null {
  if (!email || !password) return 'Email and password are required.';
  if (!/\S+@\S+\.\S+/.test(email)) return 'Invalid email format.';
  if (password.length < 6) return 'Password must be at least 6 characters.';
  return null;
}

export async function login(data: dataForm) {
  const errorMessage = validateForm(data);
  if (errorMessage) return { error: errorMessage };

  try {
    const lowerCaseEmail = data.email.toLowerCase();
    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email: lowerCaseEmail,
      password: data.password,
    });

    if (error) {
      console.error('Error:', error.message);
      return { error: 'Invalid email or password.' };
    }

    if (!session) {
      return { error: 'Session could not be created.' };
    }
    return { success: true, session };
  } catch (error) {
    console.error('Unexpected error during login:', error);
    return { error: 'An unexpected error occurred.' };
  }
}

export async function getAccountData() {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  const lowerCaseEmail = session?.user?.email.toLowerCase();
  if (sessionError || !session?.user) return { error: 'No session found.' };
  try{
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
  }catch(error){
    console.error('Error fetching user data:', error);
    return { error: 'Failed to fetch user data.' };
  }
}
export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const errorMessage = validateForm({ email, password });
  if (errorMessage) return { error: errorMessage };

  try {
    const { data: { session }, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Error:', error.message);
      return { error: 'Failed to sign up.' };
    }

    // Store session token in cookies or handle it appropriately
    if (session?.access_token) {
      cookies().set('auth-token', session.access_token, {
        httpOnly: true,
        secure: true,
        path: '/',
      });
    }

    revalidatePath('/');
    redirect('/account');
    return { success: true,session };
  } catch (error) {
    console.error('Unexpected error during signup:', error);
    return { error: 'An unexpected error occurred.' };
  }
}


export async function checkLoggedIn() {
  try {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
}
