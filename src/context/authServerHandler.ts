"use server";


import { createClient } from "utils/supabase/server";

export async function getServerUserData() {
  const supabase =  await createClient();

  // Grab session from cookies (server-side)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.email) return null;

  // Look up userdata row by email
  const { data, error } = await supabase
    .from("userdata")
    .select("*")
    .eq("email", session.user.email)
    .single();

  if (error || !data) {
    console.error("❌ getServerUserData error:", error?.message);
    return null;
  }

  return data; // your full UserData row (id, email, etc.)
}

export async function getServerUserId() {
  const userData = await getServerUserData();
  return userData?.id ?? null;
}
