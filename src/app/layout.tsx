import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css";
import { createClient } from "utils/supabase/server";
import { Analytics } from "@vercel/analytics/react"

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Upin - Create. Join. Connect.",
  description: "Upin helps you track events, join communities, and connect with people effortlessly.",
  keywords: [
    "upin",
    "event tracking",
    "community app",
    "local events",
    "meetups",
    "social networking",
    "group events",
    "event planning",
    "RSVP app",
    "social gatherings"
  ],

  openGraph: {
    title: "Upin - Create. Join. Connect.",
    description: "Find and manage events, join communities, and make socializing easier with Upin.",
    url: "https://upinweb-beta.vercel.app", 
    siteName: "Upin",
    type: "website",
    images: [
      {
        url: "/upin.png", // Image stored in `public/`
        width: 1200,
        height: 630,
        alt: "Upin App Preview Image",
      },
    ],
  },

  twitter: {
    card: "summary_large_image", // Ensures a big preview image
    title: "Upin - Create. Join. Connect.",
    description: "Upin helps you find and manage events, join communities, and track social gatherings.",
    images: ["/upin.png"], // Same as Open Graph image
  },

  robots: {
    index: true, // Allow search engines to index
    follow: true, // Allow following links
  },

  alternates: {
    canonical: "https://upinweb-beta.vercel.app", // Ensures the correct page is indexed
  },

  // manifest: "/site.webmanifest", // If your app has a PWA setup

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      </head>
     
      <body>
        <Header initialSession={session} />
        {children}
        <Analytics />
        {/* <Footer /> */}
      </body>
    </html>
  );
}