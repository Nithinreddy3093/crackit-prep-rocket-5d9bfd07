
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LogoAnimation = ({ onAnimationComplete }: { onAnimationComplete: () => void }) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      onAnimationComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700"
      initial={{ opacity: 1 }}
      animate={{ opacity: isAnimating ? 1 : 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.5)]"
        >
          <motion.div
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 1, pathLength: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="70%" height="70%" viewBox="0 0 100 100" className="transform rotate-45">
                <motion.path
                  d="M30 30 Q45 45, 40 55 Q35 65, 50 80 Q65 65, 60 55 Q55 45, 70 30"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
                />
              </svg>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 font-poppins">
          <span className="text-primary">Crack</span>it
        </h1>
        <p className="text-blue-200 text-xl font-light tracking-wide">
          Master Tech. Ace Interviews.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default LogoAnimation;
