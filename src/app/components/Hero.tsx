import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import googleImg from "public/GetItOnGooglePlay_Badge_Web_color_English-XvR5LaEp.png";
import appleImg from "public/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg";
import createImg from "public/IMG_904F75C5875C-1.jpeg";
import joinImg from "public/IMG_BBF8E384A10E-1.jpeg";
import connectImg from "public/IMG_0100.jpeg";
import locationBg from "public/locationBg.jpg";

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-b from-upinGreen to-green-900 p-12">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image 
          src={locationBg} 
          layout="fill" 
          objectFit="cover" 
          alt="Background image" 
          className="opacity-50"
        />
      </div>

      {/* Header Content */}
      <div className="text-center text-white space-y-4">
        <h1 className="text-6xl font-montserrat font-extrabold drop-shadow-lg">
          Create. Join. Connect.
        </h1>
        <p className="text-lg font-bold">
          Scroll down to view pins on Upin near U!
        </p>
        <p className="text-2xl font-extrabold">
          Get the App!
        </p>
      </div>

      {/* App Download Links */}
      <div className="flex justify-center gap-8 py-10">
          <Link href="https://play.google.com/store/apps/details?id=com.benhavis.upinjtyc832ezysr5qkcjpax" className="transition-transform hover:scale-105">
          <Image
            src={googleImg}
            height={100}
            width={300}
            alt="Get it on Google Play"
          />
        </Link>

        <Link href="https://apps.apple.com/us/app/upin/id1341978328" className="transition-transform hover:scale-105">
          
            <Image
              src={appleImg}
              height={100}
              width={300}
              alt="Download from the App Store"
            />
         
        </Link>
      </div>

      {/* Logo */}
      <div className="flex justify-center my-8">
        <div className="p-4 bg-white rounded-full shadow-lg">
          <Image
            src="/upin.png"
            alt="Upin Logo"
            width={150}
            height={150}
            className="rounded-full hover:scale-100 transition-transform hover:scale-150 duration-500"
          />
        </div>
      </div>

      {/* Boxes with Images */}
      <div className="w-screen  flex flex-wrap justify-evenly gap-8">
        {[
          { title: "Create", img: createImg },
          { title: "Join", img: joinImg },
          { title: "Connect", img: connectImg },
        ].map(({ title, img }, idx) => (
          <div
            key={idx}
            className="w-1/3 h-full bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-110"
          >
            <h2 className="p-3 text-center text-xl font-bold bg-upinGreen text-white">
              {title}
            </h2>
            <div className="relative h-96 overflow-hidden group">
              <Image
                src={img}
                alt={`${title} illustration`}
                layout="fill"
                objectFit="cover"
                className="group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
