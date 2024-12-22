'use client';
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { getProfile } from './profileService';
import { checkLoggedIn} from '../login/actions';
import { motion } from "framer-motion";
import bgImg from "public/Screen Shot 2020-03-12 at 9.26.39 AM.png";
import Image from 'next/image';
import sparkles from "../../../public/sparklesLottie.json";
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { supabase } from 'utils/supabase/supabase';
import { useUserData } from "./page"

const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,  // This ensures that Lottie is only rendered client-side
});

interface UserData {
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
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  interests: string;
}

interface ProfileData extends UserProfile {
  following: UserProfile[];
  followers: UserProfile[];
  community: { id: number; community_name: string }[];
}


interface Community {
  id: number;
  community_name: string;
}

export default function AccountForm() {
  const [id, setId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstname] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState<string | null>(null);
  const [interests, setInterests] = useState<string | null>(null);
  const [following, setFollowing] = useState<UserProfile[] | null>(null);
  const [followers, setFollowers] = useState<UserProfile[] | null>(null);
  const [communities, setCommunities] = useState<Community[] | null>(null);
  const [session, setSession] = useState(null);
  
  const user = useUserData();
  
   

  useEffect(() => {
    const checkStatus = async () => {
     const session = await checkLoggedIn();
      setSession(session);
      if(!session) {
        window.location.href = '/login';
      }
    };
    checkStatus();
  }, []);
    
  useEffect(() => {
  
    if (user?.email) {
      
      (async () => {
        setLoading(true);
        try {
          const profileData = await getProfile(user.email);
         
          if (profileData) {
            setId(profileData.id.toString());
            setFirstname(profileData.firstName);
            setLastName(profileData.lastName);
            setBirthDate(profileData.birthDate);
            setInterests(profileData.interests);
            setFollowing(profileData.following);
            setFollowers(profileData.followers);
            setCommunities(profileData.community);
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [session]);

  async function updateProfile({
    id,
    firstName,
    lastName,
    birthDate,
    interests
  }: {
    id: number 
    firstName: string | null
    lastName: string | null
    birthDate: string | null
    interests: string | null
  }) {
    const profileData = await getProfile(user.email);
    id = profileData.id;
    try {
      setLoading(true);
      
      // console.log('id:', id);
      const {data, error } = await supabase
      .from('userdata')
      .update({
        id: id,
        firstName,
        lastName,
        birthDate,
        interests,
        // updated_at: new Date().toISOString(),
      })
      .eq('id', id);
      
      if (error) throw error;
      alert('Profile updated!');
    } catch (error) {
      console.log(error);
      alert('Error updating the data!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative w-screen min-h-screen bg-upinGreen py-10">
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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative container mx-auto px-4 z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 shadow-xl border border-white/20">
                  <div className='flex justify-center'>
                  <Link 
                    href="/account/createPin"
                    className="px-4 py-2 bg-yellow-500 hover:bg-upinGreen/90 text-white rounded-lg w-full text-center transition-all mb-6"
                  >
                    Create Pin
                  </Link>
                  </div>
              <h2 className="text-3xl font-bold text-white mb-8">Profile</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Account Details</h3>
                </div>
  
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">Email</label>
                    <input
                      type="text"
                      value={user?.email}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white disabled:opacity-50"
                      disabled
                    />
                  </div>
  
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      value={firstName || ""}
                      onChange={(e) => setFirstname(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-upinGreen/50 transition-all"
                    />
                  </div>
  
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      value={lastName || ""}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-upinGreen/50 transition-all"
                    />
                  </div>
  
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">Interests</label>
                    <input
                      type="text"
                      value={interests || ""}
                      onChange={(e) => setInterests(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-upinGreen/50 transition-all"
                    />
                  </div>
  
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">Birthdate</label>
                    <input
                      type="date"
                      value={birthDate || ""}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-upinGreen/50 transition-all"
                    />
                  </div>
                </div>
  
                <div className="flex gap-4 pt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-2 bg-emerald-500/80 hover:bg-emerald-500/90 text-white rounded-lg shadow-lg transition-all"
                    onClick={() => updateProfile({ id: user?.id, firstName, lastName, birthDate, interests })}
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </motion.button>
                  
                  <form action="/auth/signout" method="post" className="flex-1">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-6 py-2 bg-red-500/80 hover:bg-red-500/90 text-white rounded-lg shadow-lg transition-all"
                    >
                      Sign Out
                    </motion.button>
                  </form>
                </div>
              </div>
            </div>
          </div>
  
          {/* Middle Section - Animation */}
          <div className="hidden lg:flex items-center justify-center">
            <Suspense fallback={<div className="text-white">Loading...</div>}>
              <Lottie animationData={sparkles} style={{width: 300, height: 300}} />
            </Suspense>
          </div>
  
          {/* Right Section - Social */}
          <div className="lg:col-span-1 space-y-6">
            {/* Following Section */}
            <motion.div 
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
                      <motion.li
                        key={followingUser.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 text-white/90"
                      >
                        <p className="font-medium">{followingUser.firstName} {followingUser.lastName}</p>
                        <p className="text-sm text-white/70">{followingUser.interests}</p>
                      </motion.li>
                    ))
                  ) : (
                    <p className="text-white/70">No following profiles found</p>
                  )}
                </ul>
              )}
            </motion.div>
  
            {/* Followers Section */}
            <motion.div 
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
                      <motion.li
                        key={followerUser.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 text-white/90"
                      >
                        <p className="font-medium">{followerUser.firstName} {followerUser.lastName}</p>
                        <p className="text-sm text-white/70">{followerUser.interests}</p>
                      </motion.li>
                    ))
                  ) : (
                    <p className="text-white/70">No followers found</p>
                  )}
                </ul>
              )}
            </motion.div>
  
            {/* Communities Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="backdrop-blur-lg bg-blue-500/20 rounded-2xl p-6 shadow-xl border border-blue-500/20"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                <div className='flex justify-between'>
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
                      <motion.li
                        key={community.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 text-white/90"
                      >
                        {community.community_name}
                      </motion.li>
                    ))
                  ) : (
                    <p className="text-white/70">No communities found</p>
                  )}
                </ul>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )};