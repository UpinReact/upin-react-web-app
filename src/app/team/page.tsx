
import React from 'react';
import TeamTabs from './TeamTabs';
import Image from "next/image"
import bgImg from 'public/Screen Shot 2020-03-12 at 9.26.39 AM.png';
const Team = () => {
  return (
    <div className='relative w-screen h-screen flex justify-center items-center bg-upinGreen'>
      <div className="absolute inset-0 -z-0">
        <Image
          src={bgImg}
          layout="fill"
          objectFit="cover"
          alt="Background image"
          className="opacity-10"
        />
      </div>
      <TeamTabs  />
    </div>
  )
}

export default Team