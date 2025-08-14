import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css";
import { createClient } from "utils/supabase/server";
import { Analytics } from "@vercel/analytics/react";
import OpenInAppBanner from "./components/OpenInApp";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Upin",
  description: "Upin - Create. Join. Connect.",
  keywords: [
    "upin",
    "app",
    "event tracking",
    "community app",
    "local events",
    "meetups",
    "social networking",
    "group events",
  ],
  // openGraph: {
  //   title: "Upin Web App",
  //   description: "Upin - Create. Join. Connect.",
  //   url: "https://upinweb-beta.vercel.app", // Update with your actual URL
  //   siteName: "Upin",
  //   images: [
  //     {
  //       url: "/upin.png", 
  //       width: 1200,
  //       height: 630,
  //       alt: "Upin App Preview Image",
  //     },
  //   ],
  //   locale: "en_US",
  //   type: "website",
  // },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "Upin Web App",
  //   description: "Upin - Create. Join. Connect.",
  //   images: [
  //     {
  //       url: "https://upinweb-beta.vercel.app/upin.png", // Full URL to the image
  //       width: 1200,
  //       height: 630,
  //       alt: "Upin App Preview Image",
  //     },
  //   ],
  // },
  metadataBase: new URL("https://upinweb-beta.vercel.app"), // Base URL for metadata
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
       {/* Existing meta tags */}
   
          <title>Upin</title>
          <meta name="title" content="Upin" />
          <meta name="description" content="Upin - Create. Join. Connect. Discover local events, build communities, and stay connected with the people and gatherings that matter most. Whether you're organizing meetups or looking for new experiences, Upin makes event tracking effortless.
          " />


          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://upinweb-beta.vercel.app/" />
          <meta property="og:title" content="Upin" />
          <meta property="og:description" content="Upin - Create. Join. Connect. Discover local events, build communities, and stay connected with the people and gatherings that matter most. Whether you're organizing meetups or looking for new experiences, Upin makes event tracking effortless.
          " />
            <meta property="og:image" content="https://upinweb-beta.vercel.app/upin.png" />


          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://upinweb-beta.vercel.app/" />
          <meta property="twitter:title" content="Upin" />
          <meta property="twitter:description" content="Upin - Create. Join. Connect. Discover local events, build communities, and stay connected with the people and gatherings that matter most. Whether you're organizing meetups or looking for new experiences, Upin makes event tracking effortless.
          " />
          <meta property="og:image" content="https://upinweb-beta.vercel.app/upin.png" />


        {/* Preconnect for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>

      <body>
        <Header initialSession={session} />
        <OpenInAppBanner link={'/user/${user_id}'}/>
        {children}
        <Analytics />
        {/* <Footer /> */}
      </body>
    </html>
  );
}