'use client'
import React from 'react'
import Image from 'next/image'
import upinLogo from "../../../public/Upin White (cutout content logo).png" 

const SignUpPage = () => {
  return (
    <div className='relative h-screen'>
      <Image
        src={upinLogo}
        alt="Upin Logo"
        layout='fill'
        objectFit='cover'
        className='z-0'
      />
      <div className='absolute inset-0 flex justify-center items-center  bg-opacity-75'>
        <div className='w-auto h-auto bg-upinGreen rounded-3xl p-7 opacity-90 shadow-xl shadow-upinGreen'>
          <h1 className='font-montserrat text-center mb-8 font-extrabold text-5xl text-white'>
            Sign Up!
          </h1>
          <div>
            <form className='grid grid-cols-2 gap-5'>
              <label className='text-2xl'>Email: </label>
              <input type="email" name="email" placeholder='Email...' className='border border-1 border-black mx-5 w-auto rounded-md'/>
              <label className='text-2xl'>Password: </label>
              <input type="password" name="password" placeholder='Password...' className='border border-1 border-black mx-5 w-auto rounded-md'/>
              <label className='text-2xl'>Confirm Password: </label>
              <input type="password" name="confirmPassword" placeholder='Confirm Password...' className='border border-1 border-black mx-5 w-auto rounded-md'/>
              <label className='text-2xl'>Age: </label>
              <input type="number" name="age" placeholder='Age' className='border border-1 border-black mx-5 w-auto rounded-md'/>
              <input type="submit" value="Sign Up!" className='bg-black text-white w-auto py-1 rounded-xl col-span-2 self-center' />
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
