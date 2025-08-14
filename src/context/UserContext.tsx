// context/UserContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import supabase from "utils/supabase/supabase"; // browser client singleton

// Adjust to your userdata columns
export type UserProfile = {
  id?: number;
  userUID?: string;
  email?: string | null;
  // ...other columns
};

type UserContextValue = {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserData = async () => {
    setIsLoading(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const nextUser = sessionData.session?.user ?? null;
    setUser(nextUser);

    if (nextUser) {
      const { data: profileRow } = await supabase
        .from("userdata")
        .select("*")
        .eq("userUID", nextUser.id)
        .single();

      setProfile((profileRow as UserProfile) ?? null);
    } else {
      setProfile(null);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    let isAlive = true;

    // initial load
    (async () => {
      await loadUserData();
    })();

    // keep in sync with auth changes
    const { data: auth } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isAlive) return;

      const nextUser = session?.user ?? null;
      setUser(nextUser);

      setIsLoading(true);
      if (nextUser) {
        const { data: profileRow } = await supabase
          .from("userdata")
          .select("*")
          .eq("userUID", nextUser.id)
          .single();

        if (!isAlive) return;
        setProfile((profileRow as UserProfile) ?? null);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      isAlive = false;
      auth?.subscription?.unsubscribe();
    };
  }, []);

  const contextValue: UserContextValue = {
    user,
    profile,
    isLoading,
    refresh: loadUserData,
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within <UserProvider>");
  return context;
}
