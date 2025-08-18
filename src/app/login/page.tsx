'use client';

import Image from "next/legacy/image";
import bgImg from 'public/Screen Shot 2020-03-12 at 9.26.39 AM.png';
import Link from 'next/link';
import Motionbutton from '../private/Motionbutton';
import { useState, useEffect } from "react";
import { useAuthHandler } from "@/context/authHandler";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const { login, userData } = useAuthHandler();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = (formData.get("email") as string)?.trim();
    const password = formData.get("password") as string;

    const success = await login({ email, password });
    if (!success) {
      setError("Invalid credentials");
    }
  };

  // ✅ redirect once userData is actually set
  useEffect(() => {
    if (userData?.id) {
      router.push(`/user/${userData.id}`);
    }
  }, [userData, router]);

  return (
    <div className="relative w-screen h-screen flex justify-center items-center bg-upinGreen">
      <div className="absolute inset-0 -z-0">
        <Image
          src={bgImg}
          layout="fill"
          objectFit="cover"
          alt="Background image"
          className="opacity-10"
        />
      </div>

      <div className="bg-slate-100 rounded-3xl p-7 w-11/12 max-w-md backdrop-filter backdrop-blur-3xl border border-black bg-opacity-10 shadow-2xl shadow-gray-700">
        <h1 className="text-6xl font-montserrat text-center mb-5 text-white">
          Log In
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

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
