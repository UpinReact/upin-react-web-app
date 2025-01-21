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

