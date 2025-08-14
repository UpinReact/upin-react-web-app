// import React, { createContext, useContext, useEffect, useState } from 'react';


// interface AuthContextType {
//   isLoggedIn: boolean;
//   setIsLoggedIn: (value: boolean) => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     async function fetchLoginStatus() {
//       const loggedInStatus = await checkLoggedIn();
//       setIsLoggedIn(loggedInStatus);
//     }
//     fetchLoginStatus();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };


// 'use client';
// import { login } from './actions';
// import { useState, FormEvent } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import bgImg from "public/Screen Shot 2020-03-12 at 9.26.39 AM.png";
// import Image from 'next/image';

// export default function LoginPage() {
//   const [errorMessage, setErrorMessage] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);
//   const router = useRouter();

//   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setLoading(true);

//     const formData = new FormData(event.target as HTMLFormElement);
//     const data = {
//       email: formData.get('email') as string,
//       password: formData.get('password') as string,
//     };

//     const response = await login(data);

//     setLoading(false);

//     if (response.error) {
//       setErrorMessage("Email or Password are incorrect");
//     } else {
//       setErrorMessage('');
//       router.push('/account');
//     }
//   };

//   return (
//     <div className="relative w-screen h-screen flex justify-center items-center bg-upinGreen">
//       <div className="absolute inset-0 -z-0">
//         <Image
//           src={bgImg}
//           layout="fill"
//           objectFit="cover"
//           alt="Background image"
//           className="opacity-10 z-0"
//         />
//       </div>

//       {/* Login Form Container */}
//       <div className='bg-slate-100 rounded-3xl p-7 w-11/12 max-w-md backdrop-filter backdrop-blur-3xl  border border-black bg-opacity-10 shadow-2xl shadow-gray-700'>
//         <h1 className='text-6xl font-montserrat text-center mb-5 text-white'>Log In</h1>
//         <form className='grid grid-cols-2 gap-5' onSubmit={handleSubmit}>
//           <label htmlFor="email" className='text-2xl text-white'>Email:</label>
//           <input id="email" name="email" type="email" required className="col-span-2 p-2 rounded border border-gray-300" />
//           <label htmlFor="password" className='text-2xl text-white'>Password:</label>
//           <input id="password" name="password" type="password" required className="col-span-2 p-2 rounded border border-gray-300" />
//           <button type="submit" className='bg-white text-black text-upinGreen w-full py-2 rounded-2xl col-span-2 hover:bg-slate-900'>
//             {loading ? 'Logging in...' : 'Log in'}
//           </button>
//         </form>
//         {errorMessage && <p className='text-red-500 text-center mt-4'>{errorMessage}</p>}
//         <div className='flex justify-center mt-4'>
//           <motion.button
//             whileHover={{ scale: 1.2 }}
//             className='rounded-2xl p-2 px-4 m-2 hover:text-white hover:bg-red-700'>
//             Forgot Password?
//           </motion.button>
//           <Link href="/sign-up">
//             <motion.button
//               whileHover={{ scale: 1.2 }}
//               className='rounded-2xl p-2 px-4 m-2 hover:text-white hover:bg-blue-700'>
//               Sign Up
//             </motion.button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
