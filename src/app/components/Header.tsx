"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import locationLottie from "../../../public/locationLottie.json";
import { supabasClient } from "utils/supabase/client";
import { checkLoggedIn } from "../login/actions";
import { useRouter } from "next/navigation";

// Dynamically import Lottie
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const Header = () => {
  const router = useRouter();
  const supabase = supabasClient
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoginStatus = async () => {
      const isLoggedIn = await checkLoggedIn()// Set logged-in state based on session presence
      console.log('isLoggedIn', isLoggedIn);
      setIsLoggedIn(isLoggedIn);  // Update the logged-in state
    };
    setIsLoading(false); // Loading complete
    fetchLoginStatus();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Optionally, show a loading state
  }

  return (
    <nav className="bg-upinGreen flex justify-between items-center w-full border border-upinGreen z-40 p-5">
      <Lottie animationData={locationLottie} style={{ width: 100, height: 100 }} />
      <div className="flex-1"></div>
      <div className="flex flex-col items-center ml-[-100px] z-10">
        <h1 className="font-bold font-montserrat text-4xl text-center mb-3">
          <Link href={"/"}>Upin</Link>
        </h1>
        <p className="text-center font-montserrat">Create. Join. Connect</p>
        {isLoggedIn ? (
          <div className="flex text-center">
            {/* Sign Out */}
            <motion.button
              whileHover={{ scale: 1.2 }}
              className="button text-white hover:bg-red-900 hover:backdrop-filter hover:backdrop-blur-lg hover:bg-opacity-50 hover:border hover:border-red-950 rounded-2xl px-3 m-2"
              onClick={async () => {
                await supabase.auth.signOut(); // Handle sign out

                setIsLoggedIn(false);
                router.push("/login")
              }}
            >
              Sign out
            </motion.button>
            {/* Go to Account */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="button text-white bg-upinBlue hover:bg-blue-700 rounded-2xl px-3 m-2"
            >
              <Link href="/account">Go to Account</Link>
            </motion.button>
          </div>
        ) : (
          <ul className="flex justify-between px-4 pt-2">
            <li className="px-5 hover:text-white pb-3">
              <Link href={"/login"}>Log In</Link>
            </li>
            <li className="px-5 hover:text-white pb-3">
              <Link href={"/sign-up"}>Sign Up</Link>
            </li>
          </ul>
        )}
      </div>
      <div className="flex-1 flex justify-end z-10">
        <ul className="flex space-x-4 px-5 mr-12 items-center">
          <li className="text-white text-lg font-montserrat">News</li>
          <li className="text-white text-lg font-montserrat">
            <Link href={"/about-us"}>About</Link>
          </li>
          <li className="text-white text-lg font-montserrat">Team</li>
          <li className="text-lg font-montserrat">
            <Link href={"/get-the-app"}>
              <motion.button
                whileHover={{ scale: 1.05 }} // Slight scaling on hover for interactivity
                className="bg-upinComplimentaryColor text-white hover:bg-blue-600 px-6 py-3 rounded-full font-semibold shadow-lg transition duration-300 ease-in-out transform hover:shadow-xl"
              >
                Get the App
              </motion.button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
