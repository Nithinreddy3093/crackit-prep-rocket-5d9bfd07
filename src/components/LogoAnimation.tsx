
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LogoAnimation = ({ onAnimationComplete }: { onAnimationComplete: () => void }) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      onAnimationComplete();
    }, 3500); // Extended animation time

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  // Logo elements animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        delay: 0.5
      }
    }
  };

  const sparkVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: [0, 1.2, 1],
      opacity: [0, 1, 1],
      transition: {
        duration: 0.6,
        delay: 1
      }
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700"
      initial={{ opacity: 1 }}
      animate={{ opacity: isAnimating ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        {/* Main circle */}
        <motion.div
          variants={circleVariants}
          className="w-40 h-40 md:w-56 md:h-56 bg-white rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(59,130,246,0.6)]"
        >
          {/* Inner content */}
          <motion.div className="relative w-3/4 h-3/4">
            {/* Sparks */}
            <motion.div
              variants={sparkVariants}
              className="absolute -top-4 -right-4 w-6 h-6 bg-primary rounded-full blur-[2px]"
            />
            <motion.div
              variants={sparkVariants}
              className="absolute -bottom-2 -left-4 w-4 h-4 bg-primary rounded-full blur-[1px]"
            />
            
            {/* Logo mark */}
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#1D4ED8" />
                </linearGradient>
              </defs>
              
              {/* Background circle */}
              <motion.circle 
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#E0E7FF"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              
              {/* Animated crack line */}
              <motion.path
                d="M30 50 Q40 40, 50 50 Q60 60, 70 50"
                fill="none"
                stroke="url(#blueGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
              
              {/* Lightning accent */}
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
      </motion.div>
      
      {/* Text animation */}
      <motion.div 
        variants={textVariants}
        initial="hidden"
        animate="visible"
        className="mt-10 text-center"
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
