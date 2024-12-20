import React from 'react';
import Image from 'next/image';
import backImg from 'public/background.jpg';
import Grid from './Grid';
import Link from 'next/link';

const Communities = () => {
  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <Image
        src={backImg}
        alt="Background"
        fill
        style={{ objectFit: "cover", objectPosition: "bottom" }}
        quality={100}
        priority
        className="absolute z-[-2]"
      />
      {/* Bright Overlay */}
      <div className="absolute inset-0  to-transparent z-[-1]"></div>

      {/* Content Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 md:px-12">
        <div className="bg-white bg-opacity-70 rounded-3xl p-10 md:p-14 w-full max-w-4xl shadow-lg">
          <h1 className="text-5xl font-extrabold text-gray-800 text-center mb-6">
            Welcome to the Communities
          </h1>
          <h3 className="text-center text-upinGreen font-semibold mb-4">
          <Link href="/account">Nevermind, take me back to my account</Link>
          </h3>
          <p className="text-lg text-gray-700 text-center mb-8">
            Connect, explore, and engage with vibrant communities around the globe. Dive in and discover amazing events, meetups, and groups that match your interests!
          </p>
          <div className="flex justify-center">
            <Grid />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communities;
