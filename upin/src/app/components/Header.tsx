'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import locationLottie from "../../../public/locationLottie.json";
import { motion } from "framer-motion";
import { checkLoggedIn } from '../login/actions';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });


const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    async function fetchLoginStatus() {
      const loggedInStatus = await checkLoggedIn();
      setIsLoggedIn(loggedInStatus);
    }
    fetchLoginStatus();
  }, []);

  // Check if we are in the browser environment
  const isBrowser = typeof window !== 'undefined';

  return (
    <nav className='bg-upinGreen flex justify-between items-center w-full border border-upinGreen z-40'>
      {isBrowser && <Lottie animationData={locationLottie} style={{ width: 100, height: 100 }} />}
      <div className='flex-1'></div>
      <div className='flex flex-col items-center ml-[-100px] z-10'>
        <h1 className='font-bold font-montserrat text-4xl text-center mb-3'>
          <Link href={'/'}>Upin</Link>
        </h1>
        <p className='text-center font-montserrat'>Create. Join. Connect</p>
        {!isLoggedIn ? (
          <ul className='flex justify-between px-4 pt-2'>
            <li className='px-5 hover:text-white pb-3'><Link href={"/login"}>Log In</Link></li>
            <li className='px-5 hover:text-white pb-3'><Link href={'/sign-up'}>Sign Up</Link></li>
          </ul>
        ) : (
          <form action="/auth/signout" method="post">
            <motion.button
              whileHover={{ scale: 1.2 }}
              className="button text-white hover:bg-red-900 hover:backdrop-filter hover:backdrop-blur-lg hover:bg-opacity-50 hover:border hover:border-red-950 rounded-2xl px-3 m-2"
            >
              Sign out
            </motion.button>
          </form>
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
}

export default Header;


