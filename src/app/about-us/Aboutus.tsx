"use client"
import React from 'react'
import Lottie from 'lottie-react';
import aboutLottie from '../../../public/aboutLottie.json'


const Aboutus = () => {
  return (
    <div className='flex justify-end'>
        <Lottie  animationData={aboutLottie} style={{width:700, height:100}} loop={true} />
    </div>
  )
}

export default Aboutus