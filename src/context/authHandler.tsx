// app/context/AuthHandler.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient } from "utils/supabase/client";

export interface UserData {
  profilePhotoURL: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  interests: string;
  bio?: string;
}

interface AuthContextValue {
  userSession: any;
  userData: UserData | null;
  userId: string;
  isReady: boolean;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<boolean>; // ✅ back to boolean
  logout: () => Promise<void>;
  fetchUserData: (uid: string) => Promise<UserData | null>;
  setUserData: (data: UserData | null) => void;
}

const defaultValue: AuthContextValue = {
  userSession: null,
  userData: null,
  userId: "",
  isReady: false,
  loading: false,
  login: async () => false,
  logout: async () => {},
  fetchUserData: async () => null,
  setUserData: () => {},
};

const AuthContext = createContext<AuthContextValue>(defaultValue);

export const AuthHandler = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient();

  const [userSession, setUserSession] = useState<any>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userId, setUserId] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUserData = async (uid: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("userdata")
        .select("*")
        .eq("userUID", uid)
        .single();

      if (error || !data) {
        console.error("❌ fetchUserData error:", error?.message);
        return null;
      }
      return data as UserData;
    } finally {
      setLoading(false);
    }
  };

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        return false;
      }

      const user = data.user;
      setUserSession(user);
      setUserId(user.id);

      const fetched = await fetchUserData(user.id);
      if (fetched) setUserData(fetched);

      return true;
    } catch (err: any) {
      console.error("❌ Login error:", err.message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err: any) {
      console.error("❌ Logout error:", err.message);
    } finally {
      setUserSession(null);
      setUserData(null);
      setUserId("");
    }
  };

  // Restore session on mount
  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUserSession(session.user);
        setUserId(session.user.id);
        const fetched = await fetchUserData(session.user.id);
        if (fetched) setUserData(fetched);
      }
      setIsReady(true);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserSession(session.user);
        setUserId(session.user.id);
        fetchUserData(session.user.id).then((fetched) => {
          if (fetched) setUserData(fetched);
        });
      } else {
        setUserSession(null);
        setUserId("");
        setUserData(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const value = useMemo<AuthContextValue>(
    () => ({
      userSession,
      userData,
      userId,
      isReady,
      loading,
      login,
      logout,
      fetchUserData,
      setUserData,
    }),
    [userSession, userData, userId, isReady, loading]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuthHandler = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthHandler must be used inside AuthHandler");
  return context;
};
