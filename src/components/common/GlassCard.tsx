import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  animate?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hover = true,
  animate = true 
}) => {
  const cardClasses = cn(
    'glass-card backdrop-blur-md bg-white/5 dark:bg-white/10',
    'border border-white/10 dark:border-white/20',
    'rounded-xl shadow-lg',
    hover && 'transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:bg-white/10',
    className
  );

  if (animate) {
    return (
      <motion.div
        className={cardClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={hover ? { y: -4 } : undefined}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={cardClasses}>{children}</div>;
};

export default GlassCard;
