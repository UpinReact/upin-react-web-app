'use client'
import React from 'react'
import { motion } from "framer-motion";
interface MotionlistProps {
  children: React.ReactNode;
  whileHover:any
  className?: string;
}

const Motionlist: React.FC<MotionlistProps> = ({ children, whileHover, className }) => {
  return (
    <motion.li whileHover={whileHover} className={className}>
        {children}
    </motion.li>
  )
}

export default Motionlist