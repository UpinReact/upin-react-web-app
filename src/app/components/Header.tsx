"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import supabase from "utils/supabase/supabase";
import { logout } from "../login/actions";
import locationLottie from "../../../public/locationLottie.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// ---------- DEBUG LOGGER ----------
const HLOG = (...args: any[]) =>
  console.log(`[Header:${new Date().toISOString()}]`, ...args);
// ----------------------------------

interface HeaderProps {
  initialSession?: any;
}

const Header = ({ initialSession }: HeaderProps) => {
  const router = useRouter();

  const hasInitial = initialSession != null;
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!initialSession);
  const [isLoading, setIsLoading] = useState<boolean>(!hasInitial);

  HLOG("mount-start", { hasInitial, initialSessionUser: initialSession?.user?.id ?? null });

  useEffect(() => {
    let isMounted = true;

    // 1) Prime state with real client session on first paint
    const prime = async () => {
      HLOG("prime:getSession:start");
      const { data, error } = await supabase.auth.getSession();
      HLOG("prime:getSession:result", {
        error: error?.message ?? null,
        hasSession: !!data?.session,
        userId: data?.session?.user?.id ?? null,
      });
      if (!isMounted) return;
      setIsLoggedIn(!!data?.session);
      setIsLoading(false);
    };
    prime();

    // 2) Subscribe to auth changes
    const { data: sub } = supabase.auth.onAuthStateChange((event, newSession) => {
      HLOG("onAuthStateChange", {
        event,
        hasSession: !!newSession,
        userId: newSession?.user?.id ?? null,
      });

      if (!isMounted) return;
      setIsLoggedIn(!!newSession);
      setIsLoading(false);

      // 3) Revalidate server components so cookies are re-read
      if (
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "TOKEN_REFRESHED" ||
        event === "USER_UPDATED"
      ) {
        HLOG("router.refresh()", { event });
        router.refresh();
      }
    });

    return () => {
      isMounted = false;
      sub?.subscription?.unsubscribe();
      HLOG("unmounted:listener-cleaned");
    };
  }, [router]);

  // Extra debug render log
  HLOG("render", { isLoading, isLoggedIn });

  if (isLoading) {
    return (
      <div className="bg-gradient-to-b from-green-900 to-upinGreen text-white w-full p-5 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
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
        </ul>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-upinComplimentaryColor text-white px-5 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl hover:bg-blue-700"
        >
          <Link href="/get-the-app">Get the App</Link>
        </motion.button>
      </div>

      <div className="flex items-center gap-4 mt-3 md:mt-0">
        {isLoggedIn ? (
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
  HLOG('logout:clicked');
  const { error } = await supabase.auth.signOut(); // client: clears localStorage + fires SIGNED_OUT
  HLOG('logout:client-signOut:done', { err: error?.message ?? null });

  setIsLoggedIn(false); // immediate UI
  router.refresh();     // re-read SSR bits
  await logout();       // server: clears httpOnly cookies + redirect('/login')
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
