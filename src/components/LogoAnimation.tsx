import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface LogoAnimationProps {
  onAnimationComplete: () => void;
  duration?: number;
}

const LogoAnimation: React.FC<LogoAnimationProps> = ({
  onAnimationComplete,
  duration = 2400,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(t);
  }, [duration]);

  return (
    <AnimatePresence onExitComplete={onAnimationComplete}>
      {visible && (
        <motion.div
          key="logo-intro"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Background grid + aurora glows */}
          <div className="absolute inset-0 bg-grid-soft opacity-40" />
          <motion.div
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[520px] w-[520px] rounded-full bg-primary/25 blur-3xl"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          />

          <div className="relative flex flex-col items-center">
            {/* Bulb / orb */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              className="relative"
            >
              {/* Outer ring */}
              <motion.div
                className="absolute inset-0 rounded-full border border-primary/40"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.8, 1.25, 1.5], opacity: [0.8, 0.4, 0] }}
                transition={{ duration: 1.6, delay: 0.3, ease: 'easeOut' }}
              />
              {/* Glowing orb */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-indigo shadow-glow flex items-center justify-center">
                <span className="absolute inset-2 rounded-full ring-1 ring-white/20" />
                {/* Animated crack */}
                <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-24 sm:h-24">
                  <motion.path
                    d="M50 12 L42 46 L58 50 L40 88"
                    fill="none"
                    stroke="hsl(0 0% 100%)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.5, ease: 'easeInOut' }}
                  />
                </svg>
                {/* Sparks */}
                <motion.div
                  className="absolute -top-2 -right-2"
                  initial={{ scale: 0, opacity: 0, rotate: -20 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ delay: 1.1, type: 'spring', stiffness: 260 }}
                >
                  <Sparkles className="h-5 w-5 text-primary-glow drop-shadow" />
                </motion.div>
              </div>
            </motion.div>

            {/* Wordmark */}
            <motion.h1
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5, ease: 'easeOut' }}
              className="mt-8 font-display text-5xl sm:text-6xl font-bold tracking-tight text-foreground"
            >
              Crack<span className="gradient-text">It</span>
            </motion.h1>

            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.15, duration: 0.5 }}
              className="mt-3 text-sm sm:text-base text-muted-foreground tracking-wide"
            >
              Know it. <span className="text-primary-glow">AI-level it.</span>
            </motion.p>

            {/* Loader bar */}
            <div className="mt-8 h-[3px] w-44 rounded-full bg-card/60 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-indigo"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: duration / 1000 - 0.4, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LogoAnimation;
