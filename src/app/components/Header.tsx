"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import locationLottie from "../../../public/locationLottie.json";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "utils/supabase/supabase";

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface HeaderProps {
  initialSession?: any; // Pass session from server-side
}

const Header = ({ initialSession }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState(initialSession);
  const [isLoading, setIsLoading] = useState(false);

  // Handle auth state changes on client
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (event === "SIGNED_OUT") {
          router.refresh();
        }
      }
    );

    return () => authListener?.subscription.unsubscribe();
  }, [router]);

  if (isLoading) return (
    <div className="bg-gradient-to-b from-green-900 to-upinGreen text-white w-full p-5 flex justify-center">
      Loading...
    </div>
  );

  return (
    <nav className="bg-gradient-to-b from-green-900 to-upinGreen text-white w-full p-5 flex flex-wrap items-center justify-between shadow-md z-50">
      {/* Logo & Title */}
      <div className="flex items-center space-x-3">
        <div className="w-16 h-16">
          <Lottie 
            animationData={locationLottie} 
            style={{ width: "100%", height: "100%" }} 
            aria-label="Location animation"
          />
        </div>
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-montserrat font-bold">
            <Link href="/" aria-label="Home">Upin</Link>
          </h1>
          <p className="text-sm md:text-base font-light">Create. Join. Connect.</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-wrap justify-center gap-4 mt-3 md:mt-0">
        <ul className="flex space-x-4 items-center">
          <li className="hover:text-yellow-300 text-lg font-montserrat">
            <Link href="/about-us" aria-label="About us">About</Link>
          </li>
          <li className="hover:text-yellow-300 text-lg font-montserrat">
            <Link href="/team" aria-label="Our team">Team</Link>
          </li>
          <li className="hover:text-yellow-300 text-lg font-montserrat">
            <Link href="/news" aria-label="News">News</Link>
          </li>
        </ul>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-upinComplimentaryColor text-white px-5 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl hover:bg-blue-700"
          aria-label="Get the app"
        >
          <Link href="/get-the-app">Get the App</Link>
        </motion.button>
      </div>

      {/* Auth Section */}
      <div className="flex items-center gap-4 mt-3 md:mt-0">
        {session ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="text-white bg-upinBlue hover:bg-blue-600 px-4 py-2 rounded-full shadow-md"
            aria-label="Go to account"
          >
            <Link href="/private">Go to account</Link>
          </motion.button>
        ) : (
          <ul className="flex space-x-4">
            <li className="hover:text-yellow-300">
              <Link href="/login" aria-label="Log in">Log In</Link>
            </li>
            <li className="hover:text-yellow-300">
              <Link href="/sign-up" aria-label="Sign up">Sign Up</Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Header;