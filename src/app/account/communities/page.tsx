"use client";
import React from 'react';
import Image from "next/legacy/image";
import Grid from './Grid';
import Link from 'next/link';
import bgImg from "public/Screen Shot 2020-03-12 at 9.26.39 AM.png";

const Communities = () => {
  return (
    <div className="relative min-h-full bg-upinGreen">
      {/* Background Image */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src={bgImg}
          fill
          style={{ objectFit: 'cover' }} 
          alt="Background image"
          className="opacity-10"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 md:px-12 desktop:px-72 py-10 relative z-10">
        <div className="bg-white bg-opacity-70 rounded-3xl p-10 md:p-14 w-full max-w-4xl shadow-lg">
          <h1 className="text-5xl font-extrabold text-gray-800 text-center mb-6">
            Welcome to the Communities
          </h1>
          <h3 className="text-center text-upinGreen font-semibold mb-4">
            <Link href="/private" className="hover:text-blue-500 transition-colors duration-300">
              Nevermind, take me back to my account
            </Link>
          </h3>
          <p className="text-lg text-gray-700 text-center mb-8 w-full">
            Connect, explore, and engage with vibrant communities around the globe. Dive in and discover amazing events, meetups, and groups that match your interests! <br />
            <span className='font-montserrat font-bold text-balance text-upinGreen'>Download the app to view more about our communities and stay updated with the latest events and meetups.</span> <br />
             <br />
             <span className='font-montserrat font-semibold text-upinGreen'>Click Below!</span>
            <br />
            
            </p>
            <div className="flex justify-center">
              <Link href="/get-the-app" className="hover:text-blue-500 transition-colors duration-300 text-center font-bold border border-upinGreen rounded-lg p-2 bg-upinGreen text-white w-full my-2 ">
                Get The App
              </Link>
            </div>
            
         
          <div className="flex justify-center">
            <Grid />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communities;
