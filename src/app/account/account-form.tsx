'use client';
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { getProfile } from './profileService';
import { checkLoggedIn} from '../login/actions';
import { motion } from "framer-motion";
import backImg from '../../../public/background.jpg';
import Image from 'next/image';
import sparkles from "../../../public/sparklesLottie.json";
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { supabase } from 'utils/supabase/supabase';

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

export default function AccountForm({ user }: { user: UserData | null }) {
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
          // console.log('profileData:', profileData);
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
  }, []);

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
      
      console.log('id:', id);
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
    <div className="relative">
      {/* Background Image */}
      <Image
        src={backImg}
        alt="Background"
        fill
        style={{ objectFit: "cover", objectPosition:"bottom" }}
        quality={100}
        priority
        className="absolute object-cover z-[-1]"
      />
      
      {/* Form and Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
        className="relative flex justify-between items-center z-10 px-5"
      >
        <div className='w-[35%] p-10 rounded-2xl grid gap-9 mx-2 bg-gray-300 border border-gray-200 
              bg-opacity-20 backdrop-filter backdrop-blur-3xl box-border 
              shadow-[0_10px_50px_-10px_rgba(0,0,0,0.75)] 
              transform transition-transform duration-500 ease-in-out hover:-translate-y-2 hover:shadow-hover'>
          
          <div className='text-pretty h-full'>
            <h2 className='font-montserrat text-3xl text-slate-200 font-extrabold underline mb-5'>Account</h2>
            <h3 className='text-white underline m-5'> <Link href={"/account/createPin"}>Create Pin</Link> </h3>
            <label htmlFor="email" className='text-white block mb-1 font-medium'>Email: </label>
            <input
              id="email"
              type="text"
              value={user?.email}
              className='w-full text-white bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg p-3 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-upinGreen transition duration-300 hover:ring-upinGreen hover:ring-2'
              disabled
            />
          </div>
          <div>
            <div className=' hidden'>
              <p>{id}</p>
            </div>
            <label htmlFor="firstName" className='text-white block mb-1 font-medium'>First Name: </label>
            <input
              id="firstName"
              type="text"
              value={firstName || ""}
              onChange={(e) => setFirstname(e.target.value)}
              className='w-full text-gray-900 bg-white bg-opacity-20 border border-gray-300 border-opacity-30 rounded-lg p-3 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-upinGreen transition duration-300 hover:ring-upinGreen hover:ring-2'
            />
          </div>
          <div>
            <label htmlFor="lastName" className='text-white block mb-1 font-medium'>Last Name: </label>
            <input
              id="lastName"
              type="text"
              value={lastName || ''}
              onChange={(e) => setLastName(e.target.value)}
              className='w-full text-gray-900 bg-white bg-opacity-20 border border-gray-300 border-opacity-30 rounded-lg p-3 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-upinGreen transition duration-300 hover:ring-upinGreen hover:ring-2'
            />
          </div>
          <div>
            <label htmlFor="interests" className='text-white block mb-1 font-medium'>Interests: </label>
            <input
              id="interests"
              type="text"
              value={interests || ""}
              onChange={(e) => setInterests(e.target.value)}
              className='w-full text-gray-900 bg-white bg-opacity-20 border border-gray-300 border-opacity-30 rounded-lg p-3 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-upinGreen transition duration-300 hover:ring-upinGreen hover:ring-2'
            />
          </div>
          <div>
            <label htmlFor="birthDate" className='text-white block mb-1 font-medium'>Birthdate: </label>
            <input
              id="birthDate"
              type="date"
              value={birthDate || ''}
              onChange={(e) => setBirthDate(e.target.value)}
              className='w-full text-gray-900 bg-white bg-opacity-20 border border-gray-300 border-opacity-30 rounded-lg p-3  backdrop-filter backdrop-blur-3xl focus:outline-none focus:ring-2 hover:ring-upinGreen hover:ring-2 focus:ring-upinGreen transition duration-300'
            />
          </div>

          <div className='flex justify-between'>
            <motion.button
              whileHover={{ scale: 1.2 }}
              className="button primary text-white hover:bg-green-600 hover:backdrop-filter hover:backdrop-blur-lg hover:bg-opacity-50 hover:border hover:border-green-950 rounded-2xl px-3 m-2"
              onClick={() => updateProfile({ id: user?.id, firstName, lastName, birthDate, interests })}
              disabled={loading}
            >
              {loading ? 'Loading ...' : 'Update'}
            </motion.button>
            <form action="/auth/signout" method="post">
              <motion.button
                whileHover={{ scale: 1.2 }}
                className="button text-white hover:bg-red-900 hover:backdrop-filter hover:backdrop-blur-lg hover:bg-opacity-50 hover:border hover:border-red-950 rounded-2xl px-3 m-2"
              >
                Sign out
              </motion.button>
            </form>
          </div>
        </div>
        <div className='flex items-center'>
          <Suspense fallback={<div>Loading animation...</div>}>
            <Lottie animationData={sparkles} style={{width:500, height:500}} />
          </Suspense>
        </div>

        <div className='w-auto gap-1 my-5'>
          <div className='bg-upinGreen p-10 rounded-2xl grid gap-1 backdrop-filter backdrop-blur-lg bg-opacity-30 border border-green-200 shadow-lg shadow-slate-600 transform transition-transform duration-500 ease-in-out hover:-translate-y-2 hover:shadow-hover'>
            <h3 className='font-montserrat text-2xl text-slate-200 font-extrabold underline mb-5'>Following</h3>
            {loading ? (
              <p className='text-white'>Loading following...</p>
            ) : (
              <ul className='text-white'>
                {following && following.length > 0 ? (
                  following.map((followingUser) => (
                    <li className="font-montserrat border border-lime-100 my-3 p-3 rounded-2xl bg-gray-300 backdrop-filter backdrop-blur-3xl text-black bg-opacity-30 font-bold hover:shadow-hover" key={followingUser.id}>
                      {followingUser.firstName} {followingUser.lastName} {followingUser.interests}
                    </li>
                  ))
                ) : (
                  <p>No following profiles found.</p>
                )}
              </ul>
            )}
          </div>

          <div className='bg-upinComplimentaryColor p-10 rounded-2xl grid gap-1 mt-4 backdrop-filter backdrop-blur-2xl bg-opacity-30 border border-red-700 shadow-lg shadow-slate-600 transform transition-transform duration-500 ease-in-out hover:-translate-y-2 hover:shadow-hover'>
            <h3 className='font-montserrat text-2xl text-slate-200 font-extrabold underline mb-5'>Followers</h3>
            {loading ? (
              <p className='text-white'>Loading followers...</p>
            ) : (
              <ul className='text-white'>
                {followers && followers.length > 0 ? (
                  followers.map((followerUser) => (
                    <li className="font-montserrat border border-red-800 my-3 p-3 rounded-2xl backdrop-filter backdrop-blur-3xl text-black bg-opacity-30 font-bold hover:shadow-hover" key={followerUser.id}>
                      {followerUser.firstName} {followerUser.lastName} {followerUser.interests}
                    </li>
                  ))
                ) : (
                  <p>No follower profiles found.</p>
                )}
              </ul>
            )}
          </div>

          <div className='bg-upinBlue p-10 rounded-2xl grid gap-1 mt-4 backdrop-filter backdrop-blur-2xl bg-opacity-30 border border-blue-700 shadow-lg shadow-slate-600 transform transition-transform duration-500 ease-in-out hover:-translate-y-2 hover:shadow-hover'>
            <h3 className='font-montserrat text-2xl text-slate-200 font-extrabold underline mb-5'><Link href={"/account/communities"}>Communities</Link></h3>
            {loading ? (
              <p className='text-white'>Loading communities...</p>
            ) : (
              <ul className='text-white'>
                {communities && communities.length > 0 ? (
                  communities.map((community) => (
                    <li className="font-montserrat border border-blue-100 my-3 p-3 rounded-2xl bg-gray-300 backdrop-filter backdrop-blur-3xl text-black bg-opacity-30 font-bold hover:shadow-hover" key={community.id}>
                      {community.community_name}
                    </li>
                  ))
                ) : (
                  <p>No communities found.</p>
                )}
              </ul>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}