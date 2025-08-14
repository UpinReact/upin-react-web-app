import { motion } from "framer-motion";

// Motionbutton.tsx
interface MotionbuttonProps {
  children?: React.ReactNode;
  className?: string;
  whileHover?: any;
  whileTap?: any;
  text: string;
  onClick?: () => void;  // Add this
  type?: "button" | "submit" | "reset";  // Add for form compatibility
  disabled?: boolean;  // Add for disabled state
}

export default function Motionbutton({ 
  text, 
  className, 
  whileHover, 
  whileTap, 
  onClick,  // Changed from action
  type = "button",
  disabled 
}: MotionbuttonProps) {
  return (
    <motion.button 
      className={className} 
      whileHover={whileHover} 
      whileTap={whileTap} 
      onClick={onClick}  // Now using onClick
      type={type}
      disabled={disabled}
    >
      {text}        
    </motion.button>
  )
}