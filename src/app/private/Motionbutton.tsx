'use client'
import React, { useEffect } from 'react'
import { motion } from "framer-motion";
import { logout } from '../login/actions';

interface MotionbuttonProps {
  children: React.ReactNode;
  className?: string;
  whileHover?: any;
  whileTap?: any;
  text :string
  action?: any;
}




export default function Motionbutton ({ text, className, whileHover, whileTap, action } : MotionbuttonProps) {
  return (
    <motion.button  className={className} whileHover={whileHover} whileTap={whileTap} onClick={action} >
        {text}
    </motion.button>
  )
}


