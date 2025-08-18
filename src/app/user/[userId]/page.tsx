import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import bgImg from "public/Screen Shot 2020-03-12 at 9.26.39 AM.png";
import getCommunity from "@/app/account/communityFunctions";
import ProfileSection from "./ProfileSection";
import { getCurrentUserData, getUserDataById } from "@/context/authServer";

export default async function Profile({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  // Get current user data (redirects to login if not authenticated)
  const currentUserData = await getCurrentUserData();
  if (!currentUserData) {
    redirect("/login");
  }

  const numericId = Number(userId);
  if (!Number.isInteger(numericId)) {
    redirect("/login");
  }

  // Fetch the profile being viewed
  const profileData = await getUserDataById(numericId);
  if (!profileData) {
    console.error("Profile not found for ID:", numericId);
    redirect("/");
  }

  const isOwnProfile = currentUserData.id === profileData.id;

  // Communities only if own profile
  const communities = isOwnProfile
    ? await getCommunity(profileData.id).catch(() => [])
    : [];

  return (
    <div className="relative w-screen min-h-screen bg-upinGreen py-10">
      <div className="absolute inset-0 -z-0">
        <Image src={bgImg} alt="Background" className="opacity-10 h-screen object-cover" />
      </div>

      <div className="relative container mx-auto px-4 z-10">
        <ProfileSection
          profileData={profileData}
          isOwnProfile={isOwnProfile}
          currentUser={currentUserData}
          profileUserId={profileData.id}
          currentUserId={currentUserData.id}
          communities={communities}
        />
      </div>
    </div>
  );
}