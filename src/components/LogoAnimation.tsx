
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LogoAnimation = ({ onAnimationComplete }: { onAnimationComplete: () => void }) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      onAnimationComplete();
    }, 2500);

    return () => {
      clearTimeout(timer);
    };
  }, [onAnimationComplete]);

  const bulbVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const crackVariants = {
    hidden: { opacity: 0, pathLength: 0 },
    visible: { 
      opacity: 1, 
      pathLength: 1,
      transition: { 
        delay: 0.8,
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 1.5,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-crackit-900 to-crackit-700"
      initial={{ opacity: 1 }}
      animate={{ opacity: isAnimating ? 1 : 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="relative">
        <motion.div
          variants={bulbVariants}
          initial="hidden"
          animate="visible"
          className="w-28 h-28 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-crackit-100 to-crackit-200 flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.5)]"
        >
          <svg viewBox="0 0 100 100" width="70%" height="70%" className="text-crackit-700">
            {/* Simplified lightbulb */}
            <motion.path
              d="M50 10 C65 10, 75 25, 75 40 C75 55, 65 70, 50 70 C35 70, 25 55, 25 40 C25 25, 35 10, 50 10"
              fill="currentColor"
              variants={bulbVariants}
            />
            <motion.path
              d="M45 70 L45 85 Q45 90, 50 90 Q55 90, 55 85 L55 70"
              fill="currentColor"
              variants={bulbVariants}
            />
            
            {/* Crack through the bulb */}
            <motion.path
              d="M30 30 Q45 45, 40 55 Q35 65, 50 80 Q65 65, 60 55 Q55 45, 70 30"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              variants={crackVariants}
            />
          </svg>
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-8 text-center"
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Crackit</h1>
        <p className="text-crackit-100 text-xl">Know It. Crack It.</p>
      </motion.div>
    </motion.div>
  );
};

export default LogoAnimation;
