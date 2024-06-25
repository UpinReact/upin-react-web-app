'use client'
import React from 'react'
import Image from 'next/image'
import upinLogo from "../../../public/Upin White (cutout content logo).png"
// import { signIn, signOut, useSession } from "next-auth/react";

const SignUpPage = () => {
  
  // const session = useSession();
  return (
    <div className='bg-black h-screen'>
      <div className='flex justify-center'>
        <div className='w-auto h-auto bg-upinGreen rounded-3xl mt-28 p-7 opacity-75 shadow-xl shadow-upinComplimentaryColor'>
          <h1 className='font-montserrat text-center mb-8 font-extrabold text-5xl text-upinComplimentaryColor'> <Image src = {upinLogo} alt = "upin main logo" className='w-12 bg-black p-2 rounded-xl'/> Sign Up!</h1>
          <div>
            <form className='grid grid-cols-2 gap-5'>
              <label className='text-2xl'>Email: </label>
              <input type="email" name="email" placeholder='Email...' className='border border-1 border-black mx-5 w-auto rounded-md'/>
              <label className='text-2xl'>Password: </label>
              <input type="password" name="password" placeholder='Password' className='border border-1 border-black mx-5 w-auto rounded-md'/>
              <label className='text-2xl'>Confirm Password: </label>
              <input type="password" name="confirmPassword" placeholder='Confirm password' className='border border-1 border-black mx-5 w-auto rounded-md'/>
              <label className='text-2xl'>Age: </label>
              <input type="number" name="age" placeholder='Age' className='border border-1 border-black mx-5 w-auto rounded-md'/>
              <input type="submit" value="Sign Up!" className='bg-upinComplimentaryColor w-auto py-1 rounded-xl col-span-2 self-center' />
            </form>
            {/* {session.data ? (
                <button onClick={() => signOut()}>Logout</button>
              ) : (
                <button onClick={() => signIn("google")}>Login with Google</button>
              )} */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
