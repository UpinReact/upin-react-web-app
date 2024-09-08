'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from "@/../../utils/supabase/server"

interface dataForm {
  email: string,
  password: string
}

export async function login(dataa: dataForm) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: dataa.email,
    password: dataa.password,
  });  

  if (error) {
    console.log("Error: " + error.message);
    return { error: "Email or Password are incorrect" };
  }

  revalidatePath('/login')
  return { success: true };
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: user, error } = await supabase.auth.signUp(data)

  if (error) {
    console.log("Error: " + error.message);
    return { error: "Failed to sign up" };
  }

  revalidatePath('/login')
  return { success: true };
}

export async function logout() {
  const supabase = createClient()
  
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.log("Error: " + error.message)
    return { error: "Failed to log out" }
  }

  revalidatePath('/')
  redirect('/')
}

export async function checkLoggedIn() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session ? true : false;
}
