"use server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "utils/supabase/server";
import bgImg from "public/Screen Shot 2020-03-12 at 9.26.39 AM.png";
import { getFollowers, getFollowing } from "@/app/account/profileFunctions";
import getCommunity from "@/app/account/communityFunctions";
import ProfileSection from "./ProfileSection";

export default async function Profile({ params }: { params: { userId: string } }) {
  const supabase = await createClient();
  
  // Check authentication first (current user)
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error("Authentication error:", userError?.message);
    redirect("/login");
  }

    // Validate userId param
  const userId = parseInt(params.userId);
  if (isNaN(userId)) {
    console.error("Invalid user ID:", params.userId);
    redirect("/login");
  }

  // Fetch the profile being viewed (could be current user or another user)
  const { data: profileData, error: profileError } = await supabase
    .from("userdata")
    .select("*")
    .eq("id", params.userId) // Use the userId from the URL
    .single();

  // If profile data doesn't exist, show error
  if (profileError) {
    console.error("Error fetching profile data:", profileError.message);
    
    if (profileError.code === "PGRST116") {
      return (
        <div className="relative w-screen min-h-screen bg-upinGreen py-10 flex items-center justify-center">
          <div className="text-white text-center">
            <h1 className="text-2xl mb-4">User not found</h1>
            <p>This profile does not exist.</p>
            <Link href="/" className="mt-4 bg-white text-green-600 px-4 py-2 rounded inline-block">
              Go Home
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-screen min-h-screen bg-upinGreen py-10 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl mb-4">Unable to load profile</h1>
          <p>There was an error loading this profile.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-white text-green-600 px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Check if viewing own profile
  const currentUserData = await supabase
    .from("userdata")
    .select("*")
    .eq("email", user.email?.toLowerCase())
    .single();

  const isOwnProfile = currentUserData.data?.id === profileData.id;

  // Only fetch followers/following/communities if viewing own profile or if it's public data
  let followers = [];
  let following = [];
  let communities = [];

  if (isOwnProfile) {
    // Fetch all data for own profile
    [followers, following, communities] = await Promise.all([
      getFollowers(profileData.id).catch(() => []),
      getFollowing(profileData.id).catch(() => []),
      getCommunity(profileData.id).catch(() => []),
    ]);
  } else {
    // For other profiles, maybe only fetch public data or limited data
    [followers, following] = await Promise.all([
      getFollowers(profileData.id).catch(() => []),
      getFollowing(profileData.id).catch(() => []),
    ]);
  }

  return (
    <div className="relative w-screen min-h-screen bg-upinGreen py-10">
      <div className="absolute inset-0 -z-0">
        <Image
          src={bgImg}
          alt="Background"
          className="opacity-10 h-screen object-cover"
        />
      </div>
      <div className="relative container mx-auto px-4 z-10">
        <ProfileSection 
          profileData={profileData} 
          isOwnProfile={isOwnProfile}
          currentUser={currentUserData.data}
          followers={followers}
          following={following}
          communities={communities}
        />
        
        {/* Show followers/following sections */}
        <div className="lg:col-span-1 space-y-6 mt-8">
          {/* Only show communities for own profile */}
          {isOwnProfile && (
            <div className="backdrop-blur-lg bg-white/20 rounded-2xl p-6 shadow-xl border border-gray-700">
              <div className="flex justify-between">
                <h3 className="text-2xl font-bold text-white">Communities</h3>
                <Link
                  href="/account/communities"
                  className="text-green-900 hover:text-blue-300 transition-colors"
                >
                  View All
                </Link>
              </div>
              <ul className="space-y-3">
                {communities.length > 0 ? (
                  communities.map(({ id, community_name }) => (
                    <li key={id} className="list-none">
                      <Link href={`/account/communities/${id}`}>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-white/90 hover:scale-105 transition-transform">
                          {community_name}
                        </div>
                      </Link>
                    </li>
                  ))
                ) : (
                  <p className="text-white/70">No communities found</p>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}