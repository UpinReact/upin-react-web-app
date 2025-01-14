'use client'
import React from 'react'

import { motion } from 'framer-motion';
interface MotiondivProps {
  children: React.ReactNode;
  initial: any;
  animate: any
  transition : any
  className?: string; 
}

const Motiondiv: React.FC<MotiondivProps> = ({ children , initial, animate, transition, className }) => {
  return (
    <motion.div initial={initial} animate={animate} transition={transition} className={className}>
      {children}
    </motion.div>
  )
}

export default Motiondiv