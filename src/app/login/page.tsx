'use client';

import Image from "next/legacy/image";
import bgImg from 'public/Screen Shot 2020-03-12 at 9.26.39 AM.png';
import Link from 'next/link';
import Motionbutton from '../private/Motionbutton';
import { useState } from "react";
import { login } from "./actions";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null); // Track error messages

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    setError(null); // Reset error state

    const formData = new FormData(event.currentTarget); // Get form data

    try {
      const result = await login(formData); // Call the server action
      if (result != "success"){
        setError("Invalid Credentials")

      }

      
     
    } catch (error) {
     
      console.error("Login error:", error);
    }
  };

  return (
    <div className="relative w-screen h-screen flex justify-center items-center bg-upinGreen">
      {/* Background Image */}
      <div className="absolute inset-0 -z-0">
        <Image
          src={bgImg}
          layout="fill"
          objectFit="cover"
          alt="Background image"
          className="opacity-10"
        />
      </div>

      {/* Login Form Container */}
      <div className="bg-slate-100 rounded-3xl p-7 w-11/12 max-w-md backdrop-filter backdrop-blur-3xl border border-black bg-opacity-10 shadow-2xl shadow-gray-700">
        <h1 className="text-6xl font-montserrat text-center mb-5 text-white">Log In</h1>

        {/* Display error message if any */}
        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        <form className="grid grid-cols-2 gap-5" onSubmit={handleSubmit}>
          <label htmlFor="email" className="text-2xl text-white">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="col-span-2 p-2 rounded border border-gray-300"
          />

          <label htmlFor="password" className="text-2xl text-white">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="col-span-2 p-2 rounded border border-gray-300"
          />

          <button
            type="submit"
            className="bg-white text-black w-full py-2 rounded-2xl col-span-2 hover:bg-slate-900"
          >
            Log in
          </button>
        </form>

        {/* Forgot Password and Sign Up */}
        <div className="flex justify-center mt-4">
          <Link href={"/login/forgot-password"}>
            <Motionbutton
              whileHover={{ scale: 1.2 }}
              className="rounded-2xl p-2 px-4 m-2 hover:text-white hover:bg-red-700"
              text="Forgot Password?"
              children={''}
            />
          </Link>
          <Link href="/sign-up">
            <Motionbutton
              whileHover={{ scale: 1.2 }}
              className="rounded-2xl p-2 px-4 m-2 hover:text-white hover:bg-blue-700"
              text="Sign Up"
              children={''}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}