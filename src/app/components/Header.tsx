"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import locationLottie from "../../../public/locationLottie.json";
import { usePathname, useRouter } from "next/navigation";
import supabase from "utils/supabase/supabase";
import { logout } from "../login/actions";

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface HeaderProps {
  initialSession?: any;
}

const Header = ({ initialSession }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event, newSession);
        setIsLoading(false); // Set loading state to false once auth state changes
        
        if (event === "SIGNED_OUT") {
          setSession(false); // Set session to false when signed out
        } else if (event === "SIGNED_IN") {
          setSession(true); // Set session to true when signed in
        }
      }
    );
  
    // Clean up the listener when the component unmounts
    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, [router]);
  
  if (isLoading) {
    return (
      <div className="bg-gradient-to-b from-green-900 to-upinGreen text-white w-full p-5 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <nav className="bg-gradient-to-b from-green-900 to-upinGreen text-white w-full p-5 flex flex-wrap items-center justify-between shadow-md z-50">
      <div className="flex items-center space-x-3">
        <div className="w-16 h-16">
          <Lottie animationData={locationLottie} style={{ width: "100%", height: "100%" }} />
        </div>
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-montserrat font-bold">
            <Link href="/">Upin</Link>
          </h1>
          <p className="text-sm md:text-base font-light">Create. Join. Connect.</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-3 md:mt-0">
        <ul className="flex space-x-4 items-center">
          <li className="hover:text-yellow-300 text-lg font-montserrat">
            <Link href="/about-us">About</Link>
          </li>
          <li className="hover:text-yellow-300 text-lg font-montserrat">
            <Link href="/team">Team</Link>
          </li>
          <li className="hover:text-yellow-300 text-lg font-montserrat">
            <Link href="/news">News</Link>
          </li>
        </ul>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-upinComplimentaryColor text-white px-5 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl hover:bg-blue-700"
        >
          <Link href="/get-the-app">Get the App</Link>
        </motion.button>
      </div>

      <div className="flex items-center gap-4 mt-3 md:mt-0">
        {session ? (
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="text-white bg-upinBlue hover:bg-blue-600 px-4 py-2 rounded-full shadow-md"
            >
              <Link href="/private">Go to account</Link>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="text-white bg-upinBlue hover:bg-blue-600 px-4 py-2 rounded-full shadow-md"
            >
              <Link href="/private/check-pins">Go to my Pins</Link>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full shadow-md"
              onClick={async () => {
                await logout();
                setSession(false);  // Set session to null after logging out
                router.refresh();
              }}
            >
              Sign Out
            </motion.button>
          </div>
        ) : (
          <ul className="flex space-x-4">
            <li className="hover:text-yellow-300">
              <Link href="/login">Log In</Link>
            </li>
            <li className="hover:text-yellow-300">
              <Link href="/sign-up">Sign Up</Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Header;
