'use client'
import React from 'react'
import Lottie from 'lottie-react'
interface LottieanimationProps{
    animation:any;
    style:any;
}
const Lottieanimation = ({animation, style}) => {
  return (
    <Lottie animationData={animation} style={style}/>
  )
}

export default Lottieanimation