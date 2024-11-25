'use client';
import { signup } from './actions';
import Link from "next/link";
import Image from "next/image";
import signUpPic from "../../../public/pic.jpg";
import { motion } from 'framer-motion';
import Lottie from "lottie-react";
import arrowDown from "../../../public/arrowDown.json";

export default function SignUpPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <Image
        src={signUpPic}
        alt="Background picture"
        fill
        style={{ objectFit: "cover", objectPosition: "center" }}
        className="absolute inset-0 z-[-1]"
      />

      {/* Lottie Animations */}
      <Lottie animationData={arrowDown} style={{ width: 300, height: 500 }} className='absolute top-1/4 left-10 transform -translate-y-1/2' />
      <Lottie animationData={arrowDown} style={{ width: 300, height: 500 }} className='absolute top-1/4 right-10 transform -translate-y-1/2' />

      {/* Sign Up Form Container */}
      <div className='relative w-auto h-auto my-20 bg-upinGreen rounded-3xl p-7 shadow-2xl shadow-slate-400 backdrop-filter backdrop-blur-3xl border border-green-200 bg-opacity-20'>
        <h1 className='font-montserrat text-center mb-5 text-6xl'>Sign Up</h1>
        <form className='grid grid-cols-2 gap-6 w-full'>
          <label htmlFor="email" className='text-2xl'>Email:</label>
          <input id="email" name="email" type="email" required className='rounded-2xl p-2 border border-gray-300'/>
          
          <label htmlFor="password" className='text-2xl'>Password:</label>
          <input id="password" name="password" type="password" required className='rounded-2xl p-2 border border-gray-300'/>
          
          <label htmlFor="confirmPassword" className='text-2xl'>Confirm Password:</label>
          <input type="password" name="confirmPassword" id="confirmPassword" required className='rounded-2xl p-2 border border-gray-300'/>
          
          <label htmlFor="firstName" className='text-2xl'>First Name:</label>
          <input type="text" name="firstName" id="firstname" className='rounded-2xl p-2 border border-gray-300'/>
          
          <label htmlFor="lastName" className='text-2xl'>Last Name:</label>
          <input type="text" name="lastName" id="lastName" className='rounded-2xl p-2 border border-gray-300'/>
          
          <label htmlFor="phone" className='text-2xl'>Phone Number:</label>
          <input type="tel" name="phone" id="phone" className='rounded-2xl p-2 border border-gray-300'/>
          
          <legend className='text-2xl col-span-2'>Choose your Interests:</legend>
          <div className='grid grid-cols-2 gap-2 col-span-2'>
            <div>
              <input type="checkbox" id="music" name="interests" value="Music"/>
              <label htmlFor="music" className='px-2'>Music</label>
            </div>
            <div>
              <input type="checkbox" id="movies" name="interests" value="Movies"/>
              <label htmlFor="movies" className='px-2'>Movies</label>
            </div>
            <div>
              <input type="checkbox" id="gaming" name="interests" value="Gaming"/>
              <label htmlFor="gaming" className='px-2'>Gaming</label>
            </div>
            <div>
              <input type="checkbox" id="chilling" name="interests" value="Chilling"/>
              <label htmlFor="chilling" className='px-2'>Chilling</label>
            </div>
            <div>
              <input type="checkbox" id="literature" name="interests" value="Literature"/>
              <label htmlFor="literature" className='px-2'>Literature</label>
            </div>
            <div>
              <input type="checkbox" id="other" name="interests" value="Other"/>
              <label htmlFor="other" className='px-2'>Other</label>
            </div>
          </div>
          
          <label htmlFor="gender" className='text-2xl col-span-2'>Select Gender:</label>
          <select id="gender" name="gender" className='rounded-2xl p-2 border border-gray-300 col-span-2'>
            <option value="" disabled>Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="prefer not to say">Prefer not to say</option>
          </select>

          <label htmlFor="age" className='text-2xl'>Age:</label>
          <input type="number" name="age" id="age" className='rounded-2xl p-2 border border-gray-300'/>
          
          <label htmlFor="birthdate" className='text-2xl'>Birthdate:</label>
          <input type="date" name="birthdate" id="birthdate" className='rounded-2xl p-2 border border-gray-300'/>
          <div className='flex col-span-2'>
          <label htmlFor="bio" className='text-2xl col-span-2 mr-20'>Add a bio:</label>
          <textarea name="bio" id="bio" cols={60} rows={2} placeholder='Just something small...' className='rounded-2xl p-2 border border-gray-300'></textarea>
          </div>
          <button type="submit" onClick={signup} className='bg-black text-white w-full py-2 rounded-2xl col-span-2 hover:bg-slate-900 backdrop-filter backdrop-blur-xl border border-green-400 bg-opacity-50'>Sign up</button>
        </form>
        <motion.button
          whileHover={{ scale: 1.2 }}
          className='rounded-2xl m-2 hover:text-black'>
          <Link href={'/login'} className='block text-center mt-4 p-5 underline'>Already have an account? Login</Link>
        </motion.button>
      </div>
    </div>
  );
}
