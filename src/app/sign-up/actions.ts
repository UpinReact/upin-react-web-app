'use server';
import { supabase } from "utils/supabase/supabase";

export async function signup(formData: FormData) {
  const data = {
    email: formData.get('email') as string,
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    password: formData.get('password') as string,
    phone: formData.get('phone') as string,
    interests: formData.getAll('interests') as string[], // Use getAll for arrays
    birthdate: formData.get('birthdate') as string,
    bio: formData.get('bio') as string,
    gender: formData.get('gender') as string,
  };

  const lowerCaseEmail = data.email.toLowerCase();

  // Validate password
  if (data.password.length < 8) {
    return { success: false, message: "Password must be at least 8 characters long." };
  }

  // Check if email exists
  try {
    const { data: existingUser, error: emailError } = await supabase
      .from("userdata")
      .select("email")
      .eq("email", lowerCaseEmail)
      .single();

    if (existingUser) {
      return { success: false, message: "Email already in use." };
    }

    if (emailError && emailError.code !== 'PGRST116') { // Ignore 'No rows found' error
      console.error("Email check error:", emailError.message);
      return { success: false, message: "Email verification failed." };
    }
  } catch (err) {
    console.error("Email check exception:", err);
    return { success: false, message: "Email verification failed." };
  }

  // Create auth user
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: lowerCaseEmail,
      password: data.password,
    });

    if (authError || !authData.user) {
      console.error("Auth error:", authError?.message);
      return { success: false, message: authError?.message || "Authentication failed." };
    }

    // Insert user data
    const { error: dbError } = await supabase
      .from("userdata")
      .insert([{
        email: lowerCaseEmail,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        bio: data.bio,
        gender: data.gender,
        birthDate: new Date(data.birthdate).toISOString(), // Ensure valid date format
        interests: data.interests, // Already an array
        userUID: authData.user.id,
      }]);

    if (dbError) {
      console.error("DB insert error:", dbError.message);
      await supabase.auth.admin.deleteUser(authData.user.id); // Rollback auth user
      return { success: false, message: "Failed to save user data." };
    }

    return { success: true };

  } catch (err) {
    console.error("Signup process error:", err);
    return { success: false, message: "An unexpected error occurred during signup." };
  }
}