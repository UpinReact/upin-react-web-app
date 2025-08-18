// app/layout.tsx (server component)
import type { Metadata } from "next";
import "./globals.css";

import Header from "./components/Header";            // Server component (reads user on server)
import OpenInAppBanner from "./components/OpenInApp"; // Likely client
import { AuthHandler } from "@/context/authHandler";
import { UserProvider } from "@/context/UserContext";    // Client
import { Analytics } from "@vercel/analytics/react";

// Your server Supabase helper that uses the current cookie adapter
import { createClient } from "utils/supabase/server";

export const metadata: Metadata = {
  title: "Upin",
  description: "Upin - Create. Join. Connect.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get server-authenticated user (cookies are readable here)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id ?? "";

  return (
    <html lang="en">
      <body>

        <AuthHandler>
              <Header />
            {/* Pass the server userId into the client banner */}
            <OpenInAppBanner link={`/user/${userId}`} />
            {children}
            <Analytics />
        </AuthHandler>
      </body>
    </html>
  );
}

