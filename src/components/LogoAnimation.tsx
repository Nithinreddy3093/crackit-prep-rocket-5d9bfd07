
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LogoAnimation = ({ onAnimationComplete }: { onAnimationComplete: () => void }) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      onAnimationComplete();
    }, 3000); // Extended animation time

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  // The "crack" effect animation
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration: 1.5, 
        ease: "easeInOut",
        delay: 0.3
      } 
    }
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700"
      initial={{ opacity: 1 }}
      animate={{ opacity: isAnimating ? 1 : 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      <div className="relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-40 h-40 md:w-56 md:h-56 bg-white rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(59,130,246,0.6)]"
        >
          {/* Logo mark */}
          <motion.div className="relative w-3/4 h-3/4">
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#1D4ED8" />
                </linearGradient>
              </defs>
              
              {/* Background shape */}
              <motion.circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="none" 
                stroke="#E0E7FF" 
                strokeWidth="2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
              
              {/* The crack */}
              <motion.path
                d="M30 50 Q40 40, 50 50 Q60 60, 70 50"
                fill="none"
                stroke="url(#blueGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                variants={pathVariants}
                initial="hidden"
                animate="visible"
              />
              
              {/* Lightning bolt accent */}
              <motion.path
                d="M55 35 L45 50 L55 50 L45 65"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.3 }}
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.7 }}
      >
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-3 font-poppins tracking-tight">
          <span className="text-blue-500">Crack</span>
          <span className="text-white">it</span>
        </h1>
        <motion.p 
          className="text-blue-200 text-xl font-light tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.5 }}
        >
          Master Tech. Ace Interviews.
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default LogoAnimation;
