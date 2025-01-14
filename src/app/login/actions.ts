// 'use server';
// // src/services/authService.ts
// import { supabase } from "../../../utils/supabase/supabase";
// import { useSessionStore } from "@/store/sessionStore";
// import { cookies } from "next/headers";
// import { setCookie } from 'nookies';

// interface dataForm {
//   email: string;
//   password: string;
// }

// function validateForm({ email, password }: dataForm): string | null {
//   if (!email || !password) return 'Email and password are required.';
//   if (!/\S+@\S+\.\S+/.test(email)) return 'Invalid email format.';
//   if (password.length < 6) return 'Password must be at least 6 characters.';
//   return null;
// }
// export async function login(data: dataForm) {
//   const {email , password} = data;
//   try {
//     // Log in with Supabase
//     const { data: { session }, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (error || !session) {
//       return { error: 'Invalid email or password' };
//     }
//      // Store the access token in cookies for 7 days
//      setCookie(null, 'upinAuthToken', session.access_token, {
//       maxAge: 60 * 60 * 24 * 7, // 7 days
//       path: '/', // Accessible throughout the app
//       httpOnly: true, // Prevent client-side access
//       secure: process.env.NODE_ENV === 'production', // Secure in production only
//     });
    
    
//     return { success: true, session, error: null };
//   } catch (error) {
//     console.error('Login error:', error);
//     return { error: 'An unexpected error occurred.' };
//   }
// }

// export async function getAccountData() {
//   const { data: { session }, error: sessionError } = await supabase.auth.getSession();
//   const lowerCaseEmail = session?.user?.email.toLowerCase();
//   if (sessionError || !session?.user) return { error: 'No session found.' };
//   try{
//   const { data: userData, error: userError } = await supabase
//     .from('userdata')
//     .select('*')
//     .eq('email', lowerCaseEmail)
//     .single();
//     if (userError) {
//       console.error('Error fetching user data:', userError.message);
//       return { error: 'Failed to fetch user data.' };
//     }
//     return { user: userData };
//   }catch(error){
//     console.error('Error fetching user data:', error);
//     return { error: 'Failed to fetch user data.' };
//   }
// }

// export async function checkLoggedIn() {
//   try {
//     const { data } = await supabase.auth.getSession();
//     return !!data.session;
//   } catch (error) {
//     console.error('Error checking login status:', error);
//     return false;
//   }
// }
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
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    const lowerCaseEmail = session?.user?.email.toLowerCase();
    if (sessionError || !session?.user) return { error: 'No session found.' };
 
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

