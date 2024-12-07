'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {supabase} from "utils/supabase/supabase"

export async function login(formData: FormData) {

  
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




export async function signup(formData: FormData) {


  // Type-casting for convenience
  const data = {
    email: formData.get('email') as string,
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    password: formData.get('password') as string,
    phone: formData.get('phone') as string,
    interests: formData.get('interests') as string,
    birthdate: formData.get('birthdate') as string,
    bio: formData.get('bio') as string,
    gender: formData.get("gender") as string,
  }
  const lowerCaseEmail = data.email.toLowerCase();
  
  try {
    // Step 1: Sign up the user with Supabase Auth
    const { data: userData, error } = await supabase.auth.signUp({
      email: lowerCaseEmail,
      password: data.password,
    });

    const user = userData?.user;

    if (error) {
      console.error("Error during sign-up:", error.message);
      return { success: false, message: error.message }; // Return error message
    }

    // Step 2: Insert additional user data into the database
    try {
      const { data: userDataInDB, error: dbError } = await supabase
        .from("userdata") 
        .insert([
          {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            bio: data.bio,
            gender:data.gender,
            birthDate: data.birthdate,
            interests: data.interests,
            userUID: user.id, // user.id is guaranteed to be available here
          },
        ]);

      if (dbError) {
        console.error("Database error during user insert:", dbError.message);
        return { success: false, message: dbError.message }; // Handle database insert error
      }

    } catch (err) {
      console.error("Unexpected error during DB insert:", err);
      return { success: false, message: "Unexpected error occurred during database insert" };
    }

    console.log("User created successfully!");
    return { success: true, message: "User created successfully!" };

  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, message: "Unexpected error occurred" };
  }
}




export async function logout() {
 
  
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.log("Error: " + error)
    redirect('/error')
  }

  // Revalidate the path and clear the session cookie
  revalidatePath('/')
  redirect('/')
}
