'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/../../utils/supabase/server';


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
  const supabase = createClient();
  

  const errorMessage = validateForm(data);
  if (errorMessage) return { error: errorMessage };

  const { data: session, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });
  

  if (error) {
    console.log('Error:', error.message);
    return { error: 'Invalid email or password.' };
  }

 
  revalidatePath('/login');
  return { success: true };
}

export async function signup(formData: FormData) {
  const supabase = createClient();
 

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const errorMessage = validateForm({ email, password });
  if (errorMessage) return { error: errorMessage };

  const { data: user, error } = await supabase.auth.signUp({ email, password });
 

  if (error) {
    console.log('Error:', error.message);
    return { error: 'Failed to sign up. Try again.' };
  }

 
  revalidatePath('/login');
  return { success: true };
}

export async function logout() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log('Error:', error.message);
    return { error: 'Failed to log out. Try again.' };
  }

  revalidatePath('/');
  redirect('/');
}

export async function checkLoggedIn() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session ? true : false;
}
