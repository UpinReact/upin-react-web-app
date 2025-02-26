'use server';
import { createClient } from "utils/supabase/server";
interface PostData {
  content: string;
  media_url?: string;
  video_url?: string;
}

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

  // Fetch community posts with user data, ordered by `created_at` in descending order (newest first)
  const { data: postsData, error: postError } = await supabase
    .from("communityposts")
    .select(`
      *, 
      userdata:user_id (id, firstName, lastName)
    `)
    .eq("community_id", id)
    .order("created_at", { ascending: false }); // Newest posts first

  if (postError) throw postError;

  return { 
    communityData, 
    postsData: postsData?.map(post => ({
      ...post,
      user_name: `${post.userdata?.firstName} ${post.userdata?.lastName}` || "Anonymous",
    })) || [] 
  };
}


export async function CheckIfUserIsInCommunity(id: string, communityId: string) {
  const supabase = await createClient();
  console.log(`checking if user_id ${id} is inside of community with id of ${communityId}`);
  
  // Fetching the community member data
  const { data: communityMember, error } = await supabase
    .from("communitymembers")
    .select("*")
    .eq("user_id", id)
    .eq("community_id", communityId)
    .single(); // Ensuring we only get one row, if any

    if(!communityMember) return false
  if (error) {
    console.error("Error checking community membership:", error);
    return false; // Return false in case of error
  }

  // Check if the user exists in the community
  // console.log(communityMember)
  return true// Return true if the user is found, false otherwise
}


export default async function PostToCommunity(
  userId: string,
  communityId: string,
  formData: PostData
) {
  const supabase = await createClient();

  console.log(`User ${userId} is posting to community ${communityId} with content:`, formData);

  if (!userId || !communityId || !formData?.content) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    const { error } = await supabase
      .from("communityposts") // Corrected table name
      .insert({
        user_id: userId,
        community_id: communityId,
        content: formData.content,
        media_url: formData.media_url || null,
        video_url: formData.video_url || null,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Error inserting post:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}