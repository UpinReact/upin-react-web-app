'use client';
import { login } from './actions';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import loginPic from "../../../public/loginPic.jpg";
import Image from 'next/image';

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target as HTMLFormElement);
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const response = await login(data);

    setLoading(false);

    if (response.error) {
      setErrorMessage("Email or Password are incorrect");
    } else {
      setErrorMessage('');
      router.push('/account');
    }
  };

  return (
    <div className="relative w-screen h-screen flex justify-center items-center">
      {/* Background Image */}
      <Image
        src={loginPic}
        alt="Login Background"
        fill
        style={{ objectFit: "cover", objectPosition: "center" }}
        priority
        quality={75}
        className="absolute top-0 left-0 z-[-1]"
      />

      {/* Login Form Container */}
      <div className='bg-upinGreen rounded-3xl p-7 w-11/12 max-w-md backdrop-filter backdrop-blur-3xl border border-green-200 bg-opacity-20 shadow-2xl shadow-gray-700'>
        <h1 className='text-6xl font-montserrat text-center mb-5 text-white'>Log In</h1>
        <form className='grid grid-cols-2 gap-5' onSubmit={handleSubmit}>
          <label htmlFor="email" className='text-2xl text-white'>Email:</label>
          <input id="email" name="email" type="email" required className="col-span-2 p-2 rounded border border-gray-300" />
          <label htmlFor="password" className='text-2xl text-white'>Password:</label>
          <input id="password" name="password" type="password" required className="col-span-2 p-2 rounded border border-gray-300" />
          <button type="submit" className='bg-black text-white w-full py-2 rounded-2xl col-span-2 hover:bg-slate-900 backdrop-filter backdrop-blur-xl border border-green-400 bg-opacity-50'>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        {errorMessage && <p className='text-red-500 text-center mt-4'>{errorMessage}</p>}
        <div className='flex justify-center mt-4'>
          <motion.button
            whileHover={{ scale: 1.2 }}
            className='rounded-2xl p-2 px-4 m-2 hover:text-white hover:bg-red-700'>
            Forgot Password?
          </motion.button>
          <Link href="/sign-up">
            <motion.button
              whileHover={{ scale: 1.2 }}
              className='rounded-2xl p-2 px-4 m-2 hover:text-white hover:bg-blue-700'>
              Sign Up
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}