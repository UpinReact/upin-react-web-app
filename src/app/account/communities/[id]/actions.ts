'use server';
import { createClient } from "utils/supabase/server";

export async function fetchCommunityData(id: string) {
  if (!id || typeof id !== "string") {
    throw new Error("Invalid community ID");
  }

  const supabase = await createClient();

  // Fetch community data
  const { data: communityData, error: communityError } = await supabase
    .from("communities")
    .select("*")
    .eq("id", id)
    .single();

   
  if (communityError) throw communityError;
  if (!communityData) throw new Error("Community not found");

  // Fetch community posts with user data
  const { data: postsData, error: postError } = await supabase
  .from("communityposts")
  .select(`
    *, 
    userdata:user_id (id, firstName, lastName)
  `)
  .eq("community_id", id);

  
  

  if (postError) throw postError;

  return { 
    communityData, 
    postsData: postsData?.map(post => ({
      ...post,
      user_name: `${post.userdata?.firstName} ${post.userdata?.lastName}` || "Anonymous",

    })) || [] 
  };
}