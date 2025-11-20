import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

interface AnimatedTooltipProps {
  children: React.ReactNode;
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

const AnimatedTooltip: React.FC<AnimatedTooltipProps> = ({ 
  children, 
  content, 
  side = 'top' 
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side} className="glass-card z-50">
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm"
          >
            {content}
          </motion.p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AnimatedTooltip;
