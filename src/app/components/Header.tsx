"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { logout } from "@/app/login/actions";
import HeaderLottie from "./HeaderLottie";
import { createClient } from "utils/supabase/client";
import {
  Layout,
  Button,
  Space,
  Typography,
  Dropdown,
  Avatar,
  Badge,
  Menu,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

interface UserData {
  id: string;
  firstName: string;
  profilePhotoURL?: string;
}

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Use a ref instead of document.getElementById
  const logoutButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const supabase = createClient();

    // Check current session and force refresh to sync with server
    const checkAuth = async () => {
      // Always refresh session on mount to sync client with server
      const { data: refreshData } = await supabase.auth.refreshSession();
      const session = refreshData.session;
      
      setUser(session?.user || null);
      
      if (session?.user?.email) {
        // Fetch user data
        const { data } = await supabase
          .from("userdata")
          .select("id, firstName, profilePhotoURL")
          .eq("email", session.user.email.toLowerCase())
          .single();
        setUserData(data);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      
      if (session?.user?.email) {
        // Fetch user data on login
        supabase
          .from("userdata")
          .select("id, firstName, profilePhotoURL")
          .eq("email", session.user.email.toLowerCase())
          .single()
          .then(({ data }) => setUserData(data));
      } else {
        setUserData(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = () => {
    logoutButtonRef.current?.click();
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: userData?.id ? (
        <Link href={`/user/${userData.id}`}>My Profile</Link>
      ) : (
        <span>My Profile</span>
      ),
      disabled: !userData?.id,
    },
    {
      key: "pins",
      icon: <SettingOutlined />,
      label: <Link href="/mypins">My Pins</Link>,
    },
    { type: "divider" as const },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Sign Out",
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader
      style={{
        background: "linear-gradient(135deg, #064e3b 0%, #059669 50%, #10b981 100%)",
        padding: "0 24px",
        height: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Left - Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <HeaderLottie className="w-12 h-12" />
        <div>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Text
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "white",
                lineHeight: 1,
                display: "block",
              }}
            >
              Upin
            </Text>
          </Link>
          <Text
            style={{
              fontSize: "12px",
              color: "rgba(255, 255, 255, 0.8)",
              fontWeight: 500,
            }}
          >
            Create. Join. Connect.
          </Text>
        </div>
      </div>

      {/* Center - Nav */}
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <Link href="/about-us">
          <Button
            type="text"
            style={{ color: "white", fontWeight: 500, height: "40px", borderRadius: "8px" }}
            className="hover:bg-white/10"
          >
            About
          </Button>
        </Link>
        <Link href="/team">
          <Button
            type="text"
            style={{ color: "white", fontWeight: 500, height: "40px", borderRadius: "8px" }}
            className="hover:bg-white/10"
          >
            Team
          </Button>
        </Link>
        <Link href="/get-the-app">
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              border: "none",
              borderRadius: "12px",
              height: "40px",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
            }}
            className="hover:shadow-lg transition-all duration-200"
          >
            Get the App
          </Button>
        </Link>
      </div>

      {/* Right - User Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {loading ? (
          <Button loading type="text" style={{ color: "white" }}>
            Loading
          </Button>
        ) : user ? (
          <Space size="large">
            <Badge count={0} showZero={false}>
              <Button
                aria-label="Notifications"
                type="text"
                icon={<BellOutlined />}
                style={{
                  color: "white",
                  fontSize: "18px",
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                }}
                className="hover:bg-white/10"
              />
            </Badge>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={["click"]} arrow>
              <Button
                type="text"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  height: "40px",
                  padding: "0 12px",
                  borderRadius: "10px",
                  color: "white",
                }}
                className="hover:bg-white/10"
              >
                <Avatar
                  size={32}
                  src={userData?.profilePhotoURL || undefined}
                  icon={<UserOutlined />}
                  style={{ border: "2px solid white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                />
                <Text style={{ color: "white", fontWeight: 500 }}>
                  {userData?.firstName || "Account"}
                </Text>
              </Button>
            </Dropdown>
          </Space>
        ) : (
          <Space>
            <Link href="/login">
              <Button
                type="text"
                style={{ color: "white", fontWeight: 500, height: "40px", borderRadius: "8px" }}
                className="hover:bg-white/10"
              >
                Log In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button
                type="primary"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  color: "white",
                  fontWeight: 600,
                  height: "40px",
                  borderRadius: "8px",
                  backdropFilter: "blur(10px)",
                }}
                className="hover:bg-white/20 transition-all duration-200"
              >
                Sign Up
              </Button>
            </Link>
          </Space>
        )}
      </div>

      {/* Hidden logout form */}
      <form action={logout} style={{ display: "none" }} id="logout-form">
        <button type="submit" ref={logoutButtonRef} />
      </form>
    </AntHeader>
  );
}