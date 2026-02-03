// Compact badge display for leaderboard and profile cards
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Flame, Trophy, Crown, Zap } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BADGE_TIER_COLORS, BadgeTier } from '@/services/badgeEngine';

interface BadgeDisplayProps {
  badgeCount: number;
  tier?: BadgeTier;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Get icon based on badge tier
const getTierIcon = (tier: BadgeTier, size: 'sm' | 'md' | 'lg') => {
  const sizeClass = size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5';
  
  switch (tier) {
    case 'platinum':
      return <Crown className={sizeClass} />;
    case 'gold':
      return <Trophy className={sizeClass} />;
    case 'silver':
      return <Award className={sizeClass} />;
    default:
      return <Star className={sizeClass} />;
  }
};

export const CompactBadgeDisplay: React.FC<BadgeDisplayProps> = ({ 
  badgeCount, 
  tier = 'bronze',
  showCount = true,
  size = 'sm'
}) => {
  if (badgeCount === 0) return null;

  const tierColors = BADGE_TIER_COLORS[tier];
  const sizeClasses = {
    sm: 'h-5 px-1.5 text-[10px]',
    md: 'h-6 px-2 text-xs',
    lg: 'h-8 px-3 text-sm'
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`
              inline-flex items-center gap-0.5 rounded-full
              bg-gradient-to-r ${tierColors.bg} ${tierColors.text}
              ${sizeClasses[size]}
              cursor-pointer transition-transform hover:scale-105
            `}
          >
            {getTierIcon(tier, size)}
            {showCount && <span className="font-bold">{badgeCount}</span>}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent className="bg-darkBlue-800 border-white/10">
          <p className="text-white text-xs">{badgeCount} badge{badgeCount !== 1 ? 's' : ''} earned</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Streak badge for leaderboard
interface StreakBadgeProps {
  streakCount: number;
  size?: 'sm' | 'md' | 'lg';
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ streakCount, size = 'sm' }) => {
  if (streakCount <= 0) return null;

  const sizeClasses = {
    sm: 'h-5 px-1.5 text-[10px]',
    md: 'h-6 px-2 text-xs',
    lg: 'h-8 px-3 text-sm'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  // Color intensity based on streak length
  const getStreakColor = () => {
    if (streakCount >= 30) return 'from-red-500 to-orange-500 text-white';
    if (streakCount >= 14) return 'from-orange-500 to-amber-500 text-white';
    if (streakCount >= 7) return 'from-amber-500 to-yellow-500 text-white';
    return 'from-yellow-600 to-amber-600 text-white';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`
              inline-flex items-center gap-0.5 rounded-full
              bg-gradient-to-r ${getStreakColor()}
              ${sizeClasses[size]}
              cursor-pointer transition-transform hover:scale-105
            `}
          >
            <Flame className={iconSizes[size]} />
            <span className="font-bold">{streakCount}</span>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent className="bg-darkBlue-800 border-white/10">
          <p className="text-white text-xs">{streakCount} day streak 🔥</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Special achievement badges
interface SpecialBadgeProps {
  type: 'top-performer' | 'consistent' | 'rising-star' | 'perfectionist';
  size?: 'sm' | 'md';
}

const SPECIAL_BADGE_CONFIG = {
  'top-performer': {
    icon: <Trophy />,
    label: 'Top Performer',
    gradient: 'from-yellow-400 to-amber-500'
  },
  'consistent': {
    icon: <Flame />,
    label: 'Consistent Learner',
    gradient: 'from-orange-500 to-red-500'
  },
  'rising-star': {
    icon: <Zap />,
    label: 'Rising Star',
    gradient: 'from-purple-500 to-pink-500'
  },
  'perfectionist': {
    icon: <Star />,
    label: 'Perfectionist',
    gradient: 'from-blue-400 to-cyan-400'
  }
};

export const SpecialBadge: React.FC<SpecialBadgeProps> = ({ type, size = 'sm' }) => {
  const config = SPECIAL_BADGE_CONFIG[type];
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`
              inline-flex items-center justify-center rounded-full
              bg-gradient-to-r ${config.gradient}
              ${size === 'sm' ? 'h-5 w-5' : 'h-6 w-6'}
              cursor-pointer transition-transform hover:scale-110
            `}
          >
            {React.cloneElement(config.icon, { className: `${iconSize} text-white` })}
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-darkBlue-800 border-white/10">
          <p className="text-white text-xs">{config.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CompactBadgeDisplay;
