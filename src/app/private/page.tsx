'use server'
import { redirect } from 'next/navigation'
import bgImg from "public/Screen Shot 2020-03-12 at 9.26.39 AM.png";
import { createClient } from 'utils/supabase/server'
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import sparkles from "../../../public/sparklesLottie.json";
import getFollowing from './following';
import getFollowers from './followers';
import getCommunity from './communityFunctions';
const Motiondiv = dynamic(() => import('./Motiondiv'), { ssr: true });
const Motionlist = dynamic(() => import('./Motionlist'), { ssr: true });
const Lottieanimation = dynamic(() => import('./Lottieanimation'), {ssr:true})
import ProfileSection from "./ProfileSection"

interface UserData {
    profilePhotoURL: string;
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    interests: string;
    following: UserProfile[];
    followers: UserProfile[];
    community: { id: number; community_name: string }[];
  }
  
  interface UserProfile {
    profilePhotoURL: string;
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    interests: string;
  }
  
  interface ProfileData extends UserProfile {
    profilePhotoURL: string;
    following: UserProfile[];
    followers: UserProfile[];
    community: { id: number; community_name: string }[];
  }
  
  
  interface Community {
    id: number;
    community_name: string;
  }

export default async function PrivatePage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Error fetching user data:', error.message);
    
    redirect('/login')
    
  }
  const lowerCaseEmail = data.user.email.toLowerCase();
  
 
  const { data: userData, error: userError } = await supabase
      .from('userdata')
      .select('*')
      .eq('email', lowerCaseEmail)
      .single();
      if (userError) {
        console.error('Error fetching user data:', userError.message);
        return { error: 'Failed to fetch user data.' };
      } 
  const { data:session, error:errorSession } = await supabase.auth.getSession()
  console.log("session....."+session)
  if (error || !session || errorSession) {
    redirect('/login')
  }

  async function logout () {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
   
  }
  const followers = await getFollowing(userData.id);
  const following = await getFollowers(userData.id)
  const communities = await getCommunity(userData.id);
  const loading = false;

  return (<div className="relative w-screen min-h-screen bg-upinGreen py-10">
      
  {/* Background Image */}
  <div className="absolute inset-0 -z-0">
    <Image
      src={bgImg}
      layout="fill"
      objectFit="cover"
      alt="Background image"
      className="opacity-10"
    />
  </div>

  {/* Main Content */}
  <Motiondiv
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="relative container mx-auto px-4 z-10"
  >
    <ProfileSection />
    
      {/* Middle Section - Animation */}
      <div className="hidden lg:flex items-center justify-center">
        <Suspense fallback={<div className="text-white">Loading...</div>}>
          <Lottieanimation animation={sparkles} style={{ width: 300, height: 300 }} />
        </Suspense>
      </div>

      {/* Right Section */}
      <div className="lg:col-span-1 space-y-6">
        {/* Following Section */}
        <Motiondiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-lg bg-yellow-500/40 rounded-2xl p-6 shadow-xl border border-emerald-500/20"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Following</h3>
          {loading ? (
            <p className="text-white/70">Loading following...</p>
          ) : (
            <ul className="space-y-3">
              {following && following.length > 0 ? (
                following.map((followingUser) => (
                  <Motionlist
                    key={followingUser.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 text-white/90"
                  >
                    <p className="font-medium">{followingUser.firstName} {followingUser.lastName}</p>
                    <p className="text-sm text-white/70">{followingUser.interests}</p>
                  </Motionlist>
                ))
              ) : (
                <p className="text-white/70">No following profiles found</p>
              )}
            </ul>
          )}
        </Motiondiv> 

        {/* Followers Section */}
        <Motiondiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-lg bg-rose-500/30 rounded-2xl p-6 shadow-xl border border-rose-500/20"
        >
           <h3 className="text-2xl font-bold text-white mb-4">Followers</h3>
          {loading ? (
            <p className="text-white/70">Loading followers...</p>
          ) : (
            <ul className="space-y-3">
              {followers && followers.length > 0 ? (
                followers.map((followerUser) => (
                  <Motionlist
                    key={followerUser.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 text-white/90"
                  >
                    <p className="font-medium">{followerUser.firstName} {followerUser.lastName}</p>
                    <p className="text-sm text-white/70">{followerUser.interests}</p>
                  </Motionlist>
                ))
              ) : (
                <p className="text-white/70">No followers found</p>
              )}
            </ul> 
           )} 
        </Motiondiv>

        {/* Communities Section */}
        <Motiondiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="backdrop-blur-lg bg-blue-500/20 rounded-2xl p-6 shadow-xl border border-blue-500/20"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            <div className="flex justify-between">
              <h3>Communities</h3>
              <Link href="/account/communities" className="text-green-900 hover:text-blue-300 transition-colors">
                View All Communities!
              </Link>
            </div>
          </h3>
          {loading ? (
            <p className="text-white/70">Loading communities...</p>
          ) : (
            <ul className="space-y-3">
              {communities && communities.length > 0 ? (
                communities.map((community) => (
                  <Motionlist
                    key={community.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 text-white/90"
                  >
                    {community.community_name}
                  </Motionlist>
                ))
              ) : (
                <p className="text-white/70">No communities found</p>
              )}
            </ul> 
          )}
        </Motiondiv>
      </div>
  </Motiondiv>
</div>
)
}