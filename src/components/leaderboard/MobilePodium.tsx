import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Crown, Medal, Flame, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface LeaderboardEntry {
  id: string;
  user_id: string;
  overall_score: number;
  rank_position: number;
  streak_count: number;
  display_name: string | null;
}

interface MobilePodiumProps {
  topThree: LeaderboardEntry[];
}

const MobilePodium: React.FC<MobilePodiumProps> = ({ topThree }) => {
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

  const getRingColor = (rank: number) => {
    if (rank === 1) return 'ring-yellow-400/50';
    if (rank === 2) return 'ring-gray-400/50';
    if (rank === 3) return 'ring-amber-500/50';
    return 'ring-primary/50';
  };

  if (topThree.length < 3) return null;

  // Reorder for mobile: [2nd, 1st, 3rd]
  const orderedPodium = [topThree[1], topThree[0], topThree[2]];

  return (
    <div className="md:hidden">
      {/* Horizontal scrollable podium */}
      <div className="flex items-end justify-center gap-2 px-4 pb-4 overflow-x-auto scrollbar-hide">
        {orderedPodium.map((entry, idx) => {
          const rank = idx === 0 ? 2 : idx === 1 ? 1 : 3;
          const isFirst = rank === 1;
          const isSecond = rank === 2;
          
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => navigate(`/profile/${entry.user_id}`)}
              className={`flex-shrink-0 ${isFirst ? 'order-2' : isSecond ? 'order-1' : 'order-3'}`}
            >
              <Card
                className={`relative p-3 text-center cursor-pointer transition-all hover:scale-105 ${
                  isFirst 
                    ? 'w-28 bg-gradient-to-b from-yellow-400/20 to-yellow-400/5 border-yellow-400/40 ring-2 ring-yellow-400/20' 
                    : isSecond
                    ? 'w-24 mt-4 bg-gradient-to-b from-gray-400/20 to-gray-400/5 border-gray-400/30'
                    : 'w-24 mt-6 bg-gradient-to-b from-amber-500/20 to-amber-500/5 border-amber-500/30'
                }`}
              >
                {/* Rank Icon */}
                <div className="flex justify-center mb-2">
                  {isFirst ? (
                    <Crown className="h-5 w-5 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]" />
                  ) : (
                    <Medal className={`h-4 w-4 ${isSecond ? 'text-gray-300' : 'text-amber-500'}`} />
                  )}
                </div>

                {/* Avatar */}
                <div className="flex justify-center mb-2">
                  <div
                    className={`${isFirst ? 'w-14 h-14' : 'w-12 h-12'} rounded-full ${getAvatarColor(rank)} flex items-center justify-center text-white font-bold ${isFirst ? 'text-lg' : 'text-sm'} shadow-lg ring-3 ${getRingColor(rank)}`}
                  >
                    {getInitials(getDisplayName(entry))}
                  </div>
                </div>

                {/* Name */}
                <p className={`font-semibold text-white truncate ${isFirst ? 'text-sm' : 'text-xs'}`}>
                  {getDisplayName(entry).split(' ')[0]}
                </p>

                {/* Score */}
                <p className={`font-bold text-white ${isFirst ? 'text-xl' : 'text-lg'}`}>
                  {entry.overall_score}
                </p>
                <p className="text-white/50 text-[10px]">points</p>

                {/* Streak */}
                {entry.streak_count > 0 && (
                  <div className="flex items-center justify-center gap-0.5 mt-1.5 text-orange-400">
                    <Flame className="h-3 w-3" />
                    <span className="text-[10px] font-semibold">{entry.streak_count}</span>
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MobilePodium;