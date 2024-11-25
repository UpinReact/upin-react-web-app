'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from "@/../../utils/supabase/server"

export async function login(formData: FormData) {
  const supabase = createClient()
  
  // Type-casting for convenience, but validate your inputs in practice
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.log("Error: " + error)
    redirect('/error')
  }

  // Revalidate the path and set the session cookie
  revalidatePath('/')
  redirect('/account')
}

export async function signup(formData: FormData ) {
  const supabase = createClient()
  
  // Type-casting for convenience, but validate your inputs in practice
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    age: formData.get('age') as string,
    birthdate: formData.get('birthdate') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.log("Error: " + error)
    redirect('/error')
  }

  // Revalidate the path and set the session cookie
  revalidatePath('/')
  redirect('/account')
}

export async function logout() {
  const supabase = createClient()
  
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.log("Error: " + error)
    redirect('/error')
  }

  // Revalidate the path and clear the session cookie
  revalidatePath('/')
  redirect('/')
}
