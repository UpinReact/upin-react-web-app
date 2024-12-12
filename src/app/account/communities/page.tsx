import React from 'react'
import Image from 'next/image'
import backImg from 'public/background.jpg'
import Grid from './Grid'

const Communities = () => {
  return (
    <div>
         <Image
        src={backImg}
        alt="Background"
        fill
        style={{ objectFit: "cover", objectPosition:"bottom" }}
        quality={100}
        priority
        className="absolute object-cover z-[-1]"
      />
      <div className="absolute w-full h-full bg-black opacity-50 z-[-1]"></div>
      <div className="flex  flex-col items-center justify-center pt-5 z-10 p-28">
        <div className='bg-slate-400 rounded-3xl p-7 w-full backdrop-filter backdrop-blur-3xl border border-green-200 bg-opacity-20 shadow-2xl shadow-gray-700'>
        <h1 className="text-4xl font-bold text-black text-center p-5">Welcome to the Communities</h1>
          <div className='flex justify-center'>
          <Grid />
          </div>
        </div>
        </div>
    </div>
  )
}

export default Communities