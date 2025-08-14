"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import supabase from "utils/supabase/supabase"

const AuthContext = createContext<boolean | null>(null);



export const AuthHandler = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setIsLoading(false); // Loading complete
    });

    // Listen for auth state changes
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session); // Update logged-in state
    });

    return () => {
      subscription?.subscription.unsubscribe(); // Clean up listener
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Optional loading spinner
  }

  return (
    <AuthContext.Provider value={isLoggedIn}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthHandler = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuthHandler must be used within AuthHandler");
  }
  return context;
};
