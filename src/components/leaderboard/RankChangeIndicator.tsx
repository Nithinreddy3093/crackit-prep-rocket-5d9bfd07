import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface RankChangeIndicatorProps {
  change: number;
  size?: 'sm' | 'md';
}

const RankChangeIndicator: React.FC<RankChangeIndicatorProps> = ({ change, size = 'sm' }) => {
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs';

  if (change === 0) {
    return (
      <div className="flex items-center gap-0.5 text-muted-foreground">
        <Minus className={iconSize} />
      </div>
    );
  }

  const isPositive = change > 0;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`flex items-center gap-0.5 ${
        isPositive ? 'text-green-500' : 'text-red-500'
      }`}
    >
      {isPositive ? (
        <TrendingUp className={iconSize} />
      ) : (
        <TrendingDown className={iconSize} />
      )}
      <span className={`font-semibold ${textSize}`}>
        {isPositive ? '+' : ''}{change}
      </span>
    </motion.div>
  );
};

export default RankChangeIndicator;