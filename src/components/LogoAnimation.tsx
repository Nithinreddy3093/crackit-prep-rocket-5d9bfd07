import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface LogoAnimationProps {
  onAnimationComplete: () => void;
  duration?: number;
}

const LogoAnimation: React.FC<LogoAnimationProps> = ({
  onAnimationComplete,
  duration,
}) => {
  const reduce = useReducedMotion();
  const isMobile = useMemo(
    () => typeof window !== 'undefined' && window.innerWidth < 640,
    []
  );
  const total = duration ?? (reduce ? 900 : isMobile ? 1800 : 2400);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), total);
    return () => clearTimeout(t);
  }, [total]);

  return (
    <AnimatePresence onExitComplete={onAnimationComplete}>
      {visible && (
        <motion.div
          key="logo-intro"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden px-6"
          style={{ minHeight: '100dvh' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <div className="absolute inset-0 bg-grid-soft opacity-40" />
          <motion.div
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[320px] w-[320px] sm:h-[520px] sm:w-[520px] rounded-full bg-primary/25 blur-3xl"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />

          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              className="relative"
            >
              {!reduce && (
                <motion.div
                  className="absolute inset-0 rounded-full border border-primary/40"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [0.8, 1.25, 1.5], opacity: [0.8, 0.4, 0] }}
                  transition={{ duration: 1.4, delay: 0.2, ease: 'easeOut' }}
                />
              )}
              <div className="relative w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-gradient-indigo shadow-glow flex items-center justify-center">
                <span className="absolute inset-2 rounded-full ring-1 ring-white/20" />
                <svg viewBox="0 0 100 100" className="w-14 h-14 sm:w-24 sm:h-24">
                  <motion.path
                    d="M50 12 L42 46 L58 50 L40 88"
                    fill="none"
                    stroke="hsl(0 0% 100%)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: 'easeInOut' }}
                  />
                </svg>
                <motion.div
                  className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.9, type: 'spring', stiffness: 260 }}
                >
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary-glow drop-shadow" />
                </motion.div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.45, ease: 'easeOut' }}
              className="mt-5 sm:mt-8 font-display text-3xl sm:text-6xl font-bold tracking-tight text-foreground text-center"
            >
              Crack<span className="gradient-text">It</span>
            </motion.h1>

            <motion.p
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.95, duration: 0.4 }}
              className="mt-2 sm:mt-3 text-xs sm:text-base text-muted-foreground tracking-wide text-center"
            >
              Know it. <span className="text-primary-glow">AI-level it.</span>
            </motion.p>

            <div className="mt-5 sm:mt-8 h-[3px] w-32 sm:w-44 rounded-full bg-card/60 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-indigo"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: total / 1000 - 0.4, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LogoAnimation;
