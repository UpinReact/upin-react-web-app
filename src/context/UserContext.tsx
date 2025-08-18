// context/UserContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "utils/supabase/client";

// shape matches your working component
export type UserData = {
  profilePhotoURL: string;
  id: string;          // BIGINT-safe as string
  firstName: string;
  lastName: string;
  email: string;
  birthDate?: string;
  interests?: string;
  bio?: string
};

const EMPTY: UserData = {
  profilePhotoURL: "",
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  birthDate: "",
  interests: "",
  bio: ""
};

type UserContextValue = {
  userData: UserData;
  isUserDataReady: boolean;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData>(EMPTY);
  const [isUserDataReady, setIsUserDataReady] = useState(false);

  useEffect(() => {
    let alive = true;
    const supabase = createClient();

    const load = async () => {
      try {
        // 1) authed user
        const { data: auth } = await supabase.auth.getUser();
        const authedUser = auth?.user ?? null;

        if (!authedUser?.email) {
          if (!alive) return;
          setUserData(EMPTY);
          setIsUserDataReady(true);
          return;
        }

        // 2) fetch userdata by email (your working approach)
        const lowerEmail = authedUser.email.toLowerCase();
        const { data: row, error } = await supabase
          .from("userdata")
          .select("id,profilePhotoURL,firstName,lastName,email,birthDate,interests, bio")
          .eq("email", lowerEmail)
          .single();

        if (!alive) return;

        if (error || !row) {
          // not found ➜ empty object but ready
          setUserData(EMPTY);
          setIsUserDataReady(true);
          return;
        }

        // BIGINT-safe id as string
        const id = typeof row.id === "string" ? row.id : String(row.id);

        setUserData({
          profilePhotoURL: row.profilePhotoURL ?? "",
          id,
          firstName: row.firstName ?? "",
          lastName: row.lastName ?? "",
          email: row.email ?? lowerEmail,
          birthDate: row.birthDate ?? "",
          interests: row.interests ?? "",
           bio: row.bio ?? "",
        });
        setIsUserDataReady(true);
      } catch (e) {
        console.error("UserContext load error:", e);
        if (!alive) return;
        setUserData(EMPTY);
        setIsUserDataReady(true);
      }
    };

    load();

    // keep in sync if auth changes in the browser
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ userData, isUserDataReady }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const userContext = useContext(UserContext);
  if (!userContext) throw new Error("useUser must be used within <UserProvider>");
  return userContext;
}
