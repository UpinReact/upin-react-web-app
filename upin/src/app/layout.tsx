import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "./components/Header";
import "./globals.css";
import Head from "next/head";
import Footer from "./components/Footer";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Upin",
  description: "Upin App`",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      </head>
     
      <body className={inter.className}>
        <Header />
        {children}
        {/* <Footer /> */}
      </body>
    </html>
  );
}
