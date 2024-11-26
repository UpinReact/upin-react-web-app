'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '../../../utils/supabase/client';
import locationLottie from '../../../public/locationLottie.json';

// Dynamically import Lottie
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const Header = () => {
  const supabase = createClient() // Initialize Supabase client


  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true); // Ensure this only runs client-side
  }, []);

  useEffect(() => {
    const fetchLoginStatus = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session); // Set logged-in state based on session presence
    };

    fetchLoginStatus();
  }, []);

  const Fallback = () => <div style={{ width: 100, height: 100 }}>Loading...</div>;

  return (
    <nav className='bg-upinGreen flex justify-between items-center w-full border border-upinGreen z-40'>
      {isBrowser && (
        <Lottie animationData={locationLottie} style={{ width: 100, height: 100 }} />
      )}

      <div className='flex-1'></div>
      <div className='flex flex-col items-center ml-[-100px] z-10'>
        <h1 className='font-bold font-montserrat text-4xl text-center mb-3'>
          <Link href={'/'}>Upin</Link>
        </h1>
        <p className='text-center font-montserrat'>Create. Join. Connect</p>
        {!isLoggedIn ? (
          <ul className='flex justify-between px-4 pt-2'>
            <li className='px-5 hover:text-white pb-3'><Link href={"/login"}>Log In</Link></li>
            <li className='px-5 hover:text-white pb-3'><Link href={'sign-up'}>Sign Up</Link></li>
          </ul>
        ) : (
          <>
            <form action="/auth/signout" method="post">
              <motion.button
                whileHover={{ scale: 1.2 }}
                className="button text-white hover:bg-red-900 hover:backdrop-filter hover:backdrop-blur-lg hover:bg-opacity-50 hover:border hover:border-red-950 rounded-2xl px-3 m-2"
              >
                Sign out
              </motion.button>
            </form>
            {/* Account Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="button text-white bg-upinBlue hover:bg-blue-700 rounded-2xl px-3 m-2"
            >
              <Link href="/account">Go to Account</Link>
            </motion.button>
          </>
        )}
      </div>
      <div className='flex-1 flex justify-end z-10'>
        <ul className='flex space-x-4 px-5 mr-12'>
          <li className='text-white text-lg font-montserrat'>News</li>
          <li className='text-white text-lg font-montserrat'><Link href={"/about-us"}>About</Link></li>
          <li className='text-white text-lg font-montserrat'>Team</li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
