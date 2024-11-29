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

  try {
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
  } catch (error) {
    console.error('Unexpected error during login:', error);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const errorMessage = validateForm({ email, password });
  if (errorMessage) return { error: errorMessage };

  try {
    const { data: user, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.log('Error:', error.message);
      return { error: 'Failed to sign up.' };
    }

    revalidatePath('/');
    redirect('/account');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error during signup:', error);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
}

export async function checkLoggedIn() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session ? true : false;
}
