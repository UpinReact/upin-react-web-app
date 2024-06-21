import React from 'react'
import SouthOutlinedIcon from '@mui/icons-material/SouthOutlined';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Upin",
  description: "Generated by create next app",
};
const aboutUs = () => {
  return (
    <div className='w-full bg-green-300'>
      <div className='flex justify-center pt-16'>
        <h1 className=' font-serif text-6xl mr-3'>About Us</h1>
      </div>
      <div className='flex justify-center mt-5 mb-8'>
        <p className='font-serif text-3xl'>We believe we are one and we value the importance of connecting with people in real life.</p>
      </div>
      <div></div>
      <div className='flex justify-center px-8'>
        <div className='border border-black rounded-md bg-green-500 shadow-2xl shadow-white p-6'>
          <p className='font-serif text-2xl'>
            <span className='font-bold'>Our Mission - </span>
            Upin is 100% fully committed to creating the best platform for keeping your real social life in one place. We create the best experience for hosting and joining local activities by making it more convenient, organized, and safe. Our mission is to create more real-life interaction by being able to create & join gatherings of people anywhere at any time. We are focused on creating more peace and oneness amongst each other by being more openly social. With Upin, you will never feel alone again.
          </p>
        </div>
      </div>
      <div className='flex justify-center m-10'>
        <SouthOutlinedIcon className='w-20 h-20'/>
      </div>
      <div className='flex justify-center px-8'>
      <div className='border border-black rounded-md bg-green-500 shadow-2xl shadow-white p-6'>
      <p className='font-serif text-2xl'><span className='font-bold'>We Value & Provide -</span> Connection, Relationships, Community. Connection is key to growing in a community. It takes strong relationships to have strong community, and with strong community we grow together in power! </p>
      </div>
      </div>
      <div className='flex justify-center m-10'>
        <SouthOutlinedIcon className='w-20 h-20'/>
      </div>
      <div className='flex justify-center px-8'>
        <div className='border border-black rounded-md bg-green-500 shadow-2xl shadow-white p-6 mb-5'>
        <p className='font-serif text-2xl'><span className='font-bold'>Our Philosophy -</span> stands behind living longer & stronger with more loving community & social interaction. We are backed by our philosophy, mission, & life guidelines at <span className=' underline'>All Is One Movement.</span> </p>
        </div>
      </div>
    

    </div>
  )
}

export default aboutUs