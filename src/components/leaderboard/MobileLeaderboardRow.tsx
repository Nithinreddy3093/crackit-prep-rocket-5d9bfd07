import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Crown, Medal, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import RankChangeIndicator from './RankChangeIndicator';
import { CompactBadgeDisplay, StreakBadge } from '@/components/badges/CompactBadgeDisplay';
import { BadgeTier } from '@/services/badgeEngine';

interface LeaderboardEntry {
  id: string;
  user_id: string;
  overall_score: number;
  rank_position: number;
  streak_count: number;
  badges_earned: string[] | null;
  display_name: string | null;
}

interface MobileLeaderboardRowProps {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
  rankChange?: number;
  index: number;
}

const MobileLeaderboardRow: React.FC<MobileLeaderboardRowProps> = ({
  entry,
  isCurrentUser,
  rankChange = 0,
  index,
}) => {
  const navigate = useNavigate();

  const getDisplayName = (entry: LeaderboardEntry) => {
    return entry.display_name || `Player ${entry.rank_position}`;
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-br from-yellow-400 to-amber-500';
    if (rank === 2) return 'bg-gradient-to-br from-gray-300 to-gray-400';
    if (rank === 3) return 'bg-gradient-to-br from-amber-400 to-orange-500';
    return 'bg-gradient-to-br from-primary/80 to-primary';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-4 w-4 text-yellow-400" />;
    if (rank === 2) return <Medal className="h-4 w-4 text-gray-300" />;
    if (rank === 3) return <Medal className="h-4 w-4 text-amber-500" />;
    return <span className="text-sm font-bold text-muted-foreground w-4 text-center">{rank}</span>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}
      onClick={() => navigate(`/profile/${entry.user_id}`)}
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all active:scale-[0.98] ${
        isCurrentUser
          ? 'bg-gradient-to-r from-primary/20 via-primary/10 to-transparent ring-1 ring-primary/30'
          : 'hover:bg-white/5'
      }`}
    >
      {/* Rank */}
      <div className="w-8 flex justify-center">
        {getRankIcon(entry.rank_position)}
      </div>

      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-full ${getAvatarColor(entry.rank_position)} flex items-center justify-center text-white font-semibold text-sm shadow-md shrink-0`}
      >
        {getInitials(getDisplayName(entry))}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white text-sm truncate">
            {getDisplayName(entry)}
          </span>
          {isCurrentUser && (
            <Badge variant="outline" className="text-[10px] h-4 border-primary/50 text-primary px-1">
              You
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          {/* Streak Badge */}
          {entry.streak_count > 0 && (
            <StreakBadge streakCount={entry.streak_count} size="sm" />
          )}
          
          {/* Badges Earned */}
          {(entry.badges_earned?.length || 0) > 0 && (
            <CompactBadgeDisplay 
              badgeCount={entry.badges_earned?.length || 0} 
              tier={entry.badges_earned && entry.badges_earned.length >= 10 ? 'gold' as BadgeTier : 'silver' as BadgeTier}
              size="sm"
            />
          )}
        </div>
      </div>

      {/* Score & Change */}
      <div className="text-right shrink-0">
        <div className="text-lg font-bold text-white">{entry.overall_score}</div>
        <RankChangeIndicator change={rankChange} />
      </div>

      <ChevronRight className="h-4 w-4 text-white/30" />
    </motion.div>
  );
};

export default MobileLeaderboardRow;