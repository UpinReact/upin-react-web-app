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
  const supabase = supabasClient;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoginStatus = async () => {
      const isLoggedIn = await checkLoggedIn();
      setIsLoggedIn(isLoggedIn);
    };
    setIsLoading(false);
    fetchLoginStatus();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="bg-gradient-to-b from-green-900 to-upinGreen text-white w-full p-5 flex flex-wrap items-center justify-between shadow-md">
      {/* Logo & Title */}
      <div className="flex items-center space-x-3">
        <div className="w-16 h-16">
          <Lottie animationData={locationLottie} style={{ width: "100%", height: "100%" }} />
        </div>
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-montserrat font-bold">
            <Link href={"/"}>Upin</Link>
          </h1>
          <p className="text-sm md:text-base font-light">Create. Join. Connect.</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-wrap justify-center gap-4 mt-3 md:mt-0">
        <ul className="flex space-x-4 items-center">
          <li className="hover:text-yellow-300 text-lg font-montserrat">
            <Link href={"/about-us"}>About</Link>
          </li>
          <li className="hover:text-yellow-300 text-lg font-montserrat">
            Team
          </li>
          <li className="hover:text-yellow-300 text-lg font-montserrat">
            News
          </li>
        </ul>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-upinComplimentaryColor text-white px-5 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl hover:bg-blue-700"
        >
          <Link href={"/get-the-app"}>Get the App</Link>
        </motion.button>
      </div>

      {/* Auth Section */}
      <div className="flex items-center gap-4 mt-3 md:mt-0">
        {isLoggedIn ? (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="text-white bg-red-600 hover:bg-red-800 px-4 py-2 rounded-full shadow-md"
              onClick={async () => {
                await supabase.auth.signOut();
                setIsLoggedIn(false);
                router.push("/login");
              }}
            >
              Sign Out
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="text-white bg-upinBlue hover:bg-blue-600 px-4 py-2 rounded-full shadow-md"
            >
              <Link href="/account">Account</Link>
            </motion.button>
          </>
        ) : (
          <ul className="flex space-x-4">
            <li className="hover:text-yellow-300">
              <Link href={"/login"}>Log In</Link>
            </li>
            <li className="hover:text-yellow-300">
              <Link href={"/sign-up"}>Sign Up</Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Header;


