"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from "utils/supabase/client"; // must return a BROWSER client

// --- Types you already use ---
interface UserData {
  profilePhotoURL: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  interests: string;
  bio?: string;
}

type AuthContextValue = {
  isLoggedIn: boolean;
  isReady: boolean;          // initial session check finished
  userData: UserData | null; // may be null while profile loads
  loading: boolean;          // only for profile fetches
  updateUserData: (updates: Partial<UserData>) => void;
  refetchUserData: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// ---------- DEBUG HELPERS ----------
const __authInstance = Math.random().toString(36).slice(2, 7);
const log = (...args: any[]) => console.log(`[AuthHandler:${__authInstance}]`, ...args);
// -----------------------------------

export const AuthHandler = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch userdata by email (your table/columns)
  const fetchUserData = async (email: string) => {
    setLoading(true);
    log("fetchUserData:start", { email });

    try {
      const { data, error } = await supabase
        .from("userdata")
        .select("*")
        .eq("email", email.toLowerCase())
        .single();

      if (error) {
        log("fetchUserData:error", error.message);
        setUserData(null);
        return;
      }

      if (data) {
        const mapped: UserData = {
          profilePhotoURL: data.profilePhotoURL,
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          birthDate: data.birthDate,
          interests: data.interests,
          bio: data.bio,
        };
        setUserData(mapped);
        log("fetchUserData:success", {
          id: mapped.id,
          firstName: mapped.firstName,
          email: mapped.email,
        });
      } else {
        log("fetchUserData:empty");
        setUserData(null);
      }
    } catch (e) {
      log("fetchUserData:exception", e);
      setUserData(null);
    } finally {
      setLoading(false);
      log("fetchUserData:done");
    }
  };

  const refetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    log("refetchUserData", { userEmail: user?.email });
    if (user?.email) fetchUserData(user.email);
  };

  const updateUserData = (updates: Partial<UserData>) => {
    setUserData(prev => {
      const next = prev ? { ...prev, ...updates } : prev;
      log("updateUserData", { before: prev, after: next });
      return next;
    });
  };

  useEffect(() => {
    log("mount", { hasWindow: typeof window !== "undefined" });
    let mounted = true;
    let initialResolved = false;

    (async () => {
      try {
        log("initial:getSession:start");
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!mounted) return;

        if (error) log("initial:getSession:error", error.message);
        log("initial:getSession:result", {
          hasSession: !!session,
          userEmail: session?.user?.email,
          userId: session?.user?.id,
        });

        if (session?.user?.email) {
          setIsLoggedIn(true);
          log("state:setIsLoggedIn:true");
          // fire-and-forget profile load, don’t block isReady
          fetchUserData(session.user.email);
        } else {
          setIsLoggedIn(false);
          setUserData(null);
          log("state:setIsLoggedIn:false (no session)");
        }
      } catch (e) {
        log("initial:getSession:exception", e);
        setIsLoggedIn(false);
        setUserData(null);
      } finally {
        initialResolved = true;
        if (mounted) {
          setIsReady(true);
          log("state:setIsReady:true");
        }
      }
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      log("onAuthStateChange", {
        event,
        initialResolved,
        hasSession: !!session,
        userEmail: session?.user?.email,
      });

      // Avoid duplicate INITIAL_SESSION racing the manual getSession
      if (!initialResolved && event === "INITIAL_SESSION") {
        log("onAuthStateChange:ignored:INITIAL_SESSION (waiting for init)");
        return;
      }

      const email = session?.user?.email ?? null;

      if (!email) {
        setIsLoggedIn(false);
        setUserData(null);
        log("onAuthStateChange:setLoggedOut");
        return;
      }

      setIsLoggedIn(true);
      log("onAuthStateChange:setLoggedIn");

      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        // don’t await to keep UI snappy
        fetchUserData(email);
      } else {
        // Ignore TOKEN_REFRESHED for UI to prevent spinner loops
        log("onAuthStateChange:noopForEvent", event);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
      log("unmount");
    };
  }, [supabase]);

  // Add this temporary debugging after your existing useEffect
useEffect(() => {
  console.log("🔍 DEBUG: Component mounted, checking auth state");
  
  // Check what's in localStorage
  const keys = Object.keys(localStorage).filter(key => key.includes('supabase'));
  console.log("🔍 DEBUG: Supabase localStorage keys:", keys);
  
  // Try to get session directly
  supabase.auth.getSession().then(({ data, error }) => {
    console.log("🔍 DEBUG: Direct session check:", {
      hasSession: !!data.session,
      userEmail: data.session?.user?.email,
      error: error?.message
    });
  });
}, []);

  const authContextValue = useMemo<AuthContextValue>(
    () => ({
      isLoggedIn,
      isReady,
      userData,
      loading,
      updateUserData,
      refetchUserData,
    }),
    [isLoggedIn, isReady, userData, loading]
  );

  log("render", { isReady, isLoggedIn, hasUserData: !!userData, loading });

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export const useAuthHandler = () => {
  const authContext = useContext(AuthContext);
  if (authContext === null) throw new Error("useAuthHandler must be used within AuthHandler");
  return authContext;
};
