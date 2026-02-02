import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Trophy, Award, Zap, Medal, Crown, Star, Users, Target, Flame, ExternalLink, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import MobilePodium from '@/components/leaderboard/MobilePodium';
import MobileLeaderboardRow from '@/components/leaderboard/MobileLeaderboardRow';
import TimeFilter from '@/components/leaderboard/TimeFilter';
import ExamTypeFilter from '@/components/leaderboard/ExamTypeFilter';

interface LeaderboardEntry {
  id: string;
  user_id: string;
  overall_score: number;
  rank_position: number;
  category_scores: Record<string, number> | null;
  streak_count: number;
  badges_earned: string[] | null;
  display_name: string | null;
}

type TimeRange = 'weekly' | 'monthly' | 'all-time';
type ExamType = 'all' | 'tech' | 'upsc';

const Leaderboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('overall');
  const [timeRange, setTimeRange] = useState<TimeRange>('all-time');
  const [examType, setExamType] = useState<ExamType>('all');
  const [refreshing, setRefreshing] = useState(false);

  const categories = [
    { value: 'overall', label: 'Overall' },
    { value: 'dsa', label: 'DSA' },
    { value: 'oops', label: 'OOPs' },
    { value: 'dbms', label: 'DBMS' },
    { value: 'os', label: 'OS' },
    { value: 'upsc-polity', label: 'Polity' },
    { value: 'upsc-history', label: 'History' },
    { value: 'upsc-geography', label: 'Geography' },
  ];

  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  useEffect(() => {
    fetchLeaderboard();

    const channel = supabase
      .channel('leaderboard-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leaderboard' },
        () => fetchLeaderboard()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [timeRange, examType, category]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('leaderboard')
        .select('*');

      // Apply exam type filter
      if (examType !== 'all') {
        query = query.eq('exam_type', examType);
      }

      // Apply time range filter using score columns
      if (timeRange === 'weekly') {
        query = query.order('weekly_score', { ascending: false, nullsFirst: false });
      } else if (timeRange === 'monthly') {
        query = query.order('monthly_score', { ascending: false, nullsFirst: false });
      } else {
        query = query.order('overall_score', { ascending: false });
      }

      query = query.limit(100);

      const { data, error } = await query;

      if (error) throw error;

      const typedData = (data || []).map((entry, index) => ({
        ...entry,
        category_scores: entry.category_scores as Record<string, number> | null,
        badges_earned: entry.badges_earned as string[] | null,
        // Recalculate rank_position based on current sort
        rank_position: index + 1,
      }));

      setLeaderboard(typedData);

      if (user) {
        const userEntry = typedData.find((entry) => entry.user_id === user.id);
        setUserRank(userEntry || null);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast({
        title: 'Error',
        description: 'Failed to load leaderboard',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLeaderboard();
  };

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return (
      <div className="relative">
        <Crown className="h-8 w-8 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
      </div>
    );
    if (rank === 2) return (
      <div className="relative">
        <Medal className="h-7 w-7 text-gray-300 drop-shadow-[0_0_6px_rgba(209,213,219,0.5)]" />
      </div>
    );
    if (rank === 3) return (
      <div className="relative">
        <Medal className="h-7 w-7 text-amber-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
      </div>
    );
    return (
      <span className="text-lg font-bold text-muted-foreground w-8 text-center">
        {rank}
      </span>
    );
  };

  const getRowStyles = (rank: number, isCurrentUser: boolean) => {
    let baseStyles = "border-b border-white/5 transition-all duration-300 ";
    
    if (isCurrentUser) {
      baseStyles += "bg-gradient-to-r from-primary/20 via-primary/10 to-transparent ring-1 ring-primary/30 ";
    } else if (rank === 1) {
      baseStyles += "bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-transparent ";
    } else if (rank === 2) {
      baseStyles += "bg-gradient-to-r from-gray-400/10 via-gray-400/5 to-transparent ";
    } else if (rank === 3) {
      baseStyles += "bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent ";
    } else {
      baseStyles += "hover:bg-white/5 ";
    }
    
    return baseStyles;
  };

  const getCategoryScore = (scores: Record<string, number> | null, cat: string) => {
    if (cat === 'overall' || !scores) return null;
    return scores[cat] || 0;
  };

  const getDisplayName = (entry: LeaderboardEntry) => {
    if (entry.display_name) return entry.display_name;
    return `Player ${entry.rank_position}`;
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-br from-yellow-400 to-amber-500";
    if (rank === 2) return "bg-gradient-to-br from-gray-300 to-gray-400";
    if (rank === 3) return "bg-gradient-to-br from-amber-400 to-orange-500";
    return "bg-gradient-to-br from-primary/80 to-primary";
  };

  const topThree = leaderboard.slice(0, 3);
  const restOfLeaderboard = leaderboard.slice(3);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8 max-w-6xl pb-24 md:pb-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 md:mb-10"
        >
          <div className="inline-flex items-center gap-3 mb-3 md:mb-4">
            <Trophy className="h-8 w-8 md:h-12 md:w-12 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]" />
            <h1 className="text-3xl md:text-5xl font-bold text-white">
              Leaderboard
            </h1>
          </div>
          <p className="text-sm md:text-lg text-white/70 flex items-center justify-center gap-2">
            <Users className="h-4 w-4 md:h-5 md:w-5" />
            <span>{leaderboard.length} active learners competing</span>
          </p>
        </motion.div>

        {/* Filters - Mobile: Horizontal scroll, Desktop: Row */}
        <div className="mb-6 space-y-3">
          {/* Time & Exam Type Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
            <TimeFilter value={timeRange} onChange={setTimeRange} />
            <ExamTypeFilter value={examType} onChange={setExamType} />
            <button
              onClick={handleRefresh}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Category Pills - Horizontal Scroll on Mobile */}
          <ScrollArea className="w-full">
            <div className="flex items-center gap-2 pb-2 px-1">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                    category === cat.value
                      ? 'text-white bg-primary'
                      : 'text-white/60 bg-white/5 hover:bg-white/10 hover:text-white/80'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>
        </div>

        {/* User Rank Card */}
        {userRank && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="mb-6 md:mb-8 bg-gradient-to-r from-primary/30 via-primary/20 to-secondary/20 border-primary/40 p-4 md:p-6 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full ${getAvatarColor(userRank.rank_position)} flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg`}>
                    {getInitials(getDisplayName(userRank))}
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-1 bg-white/20 text-white border-0 text-xs">
                      Your Position
                    </Badge>
                    <h3 className="text-xl md:text-2xl font-bold text-white">Rank #{userRank.rank_position}</h3>
                    <p className="text-white/70 text-sm">{getDisplayName(userRank)}</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-white">{userRank.overall_score}</div>
                    <p className="text-white/60 text-xs md:text-sm flex items-center gap-1">
                      <Target className="h-3 w-3" /> Score
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-orange-400 flex items-center gap-1">
                      <Flame className="h-5 w-5 md:h-6 md:w-6" />
                      {userRank.streak_count}
                    </div>
                    <p className="text-white/60 text-xs md:text-sm">Streak</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-yellow-400 flex items-center gap-1">
                      <Star className="h-5 w-5 md:h-6 md:w-6" />
                      {userRank.badges_earned?.length || 0}
                    </div>
                    <p className="text-white/60 text-xs md:text-sm">Badges</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Mobile Podium */}
        {!loading && topThree.length >= 3 && (
          <MobilePodium topThree={topThree} />
        )}

        {/* Desktop Top 3 Podium */}
        {!loading && topThree.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden md:grid grid-cols-3 gap-4 mb-8"
          >
            {/* Second Place */}
            <div className="mt-8">
              <Card 
                className="bg-gradient-to-b from-gray-400/20 to-gray-400/5 border-gray-400/30 p-4 text-center backdrop-blur-sm cursor-pointer hover:scale-105 transition-transform hover:ring-2 ring-gray-400/50"
                onClick={() => handleViewProfile(topThree[1].user_id)}
              >
                <div className="flex justify-center mb-3">
                  <div className={`w-16 h-16 rounded-full ${getAvatarColor(2)} flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-gray-400/30`}>
                    {getInitials(getDisplayName(topThree[1]))}
                  </div>
                </div>
                <Medal className="h-6 w-6 text-gray-300 mx-auto mb-2" />
                <h3 className="text-white font-semibold truncate text-sm">{getDisplayName(topThree[1])}</h3>
                <p className="text-2xl font-bold text-white">{topThree[1].overall_score}</p>
                <p className="text-white/50 text-xs">points</p>
              </Card>
            </div>

            {/* First Place */}
            <div>
              <Card 
                className="bg-gradient-to-b from-yellow-400/20 to-yellow-400/5 border-yellow-400/40 p-4 text-center backdrop-blur-sm ring-2 ring-yellow-400/20 cursor-pointer hover:scale-105 transition-transform hover:ring-4"
                onClick={() => handleViewProfile(topThree[0].user_id)}
              >
                <div className="flex justify-center mb-3">
                  <div className={`w-20 h-20 rounded-full ${getAvatarColor(1)} flex items-center justify-center text-white font-bold text-2xl shadow-xl ring-4 ring-yellow-400/40`}>
                    {getInitials(getDisplayName(topThree[0]))}
                  </div>
                </div>
                <Crown className="h-8 w-8 text-yellow-400 mx-auto mb-2 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                <h3 className="text-white font-semibold truncate">{getDisplayName(topThree[0])}</h3>
                <p className="text-3xl font-bold text-white">{topThree[0].overall_score}</p>
                <p className="text-white/50 text-xs">points</p>
              </Card>
            </div>

            {/* Third Place */}
            <div className="mt-12">
              <Card 
                className="bg-gradient-to-b from-amber-500/20 to-amber-500/5 border-amber-500/30 p-4 text-center backdrop-blur-sm cursor-pointer hover:scale-105 transition-transform hover:ring-2 ring-amber-500/50"
                onClick={() => handleViewProfile(topThree[2].user_id)}
              >
                <div className="flex justify-center mb-3">
                  <div className={`w-14 h-14 rounded-full ${getAvatarColor(3)} flex items-center justify-center text-white font-bold text-lg shadow-lg ring-4 ring-amber-500/30`}>
                    {getInitials(getDisplayName(topThree[2]))}
                  </div>
                </div>
                <Medal className="h-5 w-5 text-amber-500 mx-auto mb-2" />
                <h3 className="text-white font-semibold truncate text-sm">{getDisplayName(topThree[2])}</h3>
                <p className="text-xl font-bold text-white">{topThree[2].overall_score}</p>
                <p className="text-white/50 text-xs">points</p>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Mobile List View */}
        <div className="md:hidden space-y-2 mb-6">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <Skeleton className="h-8 w-8 bg-white/10" />
                <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 bg-white/10 mb-1" />
                  <Skeleton className="h-3 w-16 bg-white/10" />
                </div>
                <Skeleton className="h-6 w-12 bg-white/10" />
              </div>
            ))
          ) : (
            restOfLeaderboard.map((entry, index) => (
              <MobileLeaderboardRow
                key={entry.id}
                entry={entry}
                isCurrentUser={entry.user_id === user?.id}
                rankChange={0}
                index={index}
              />
            ))
          )}
        </div>

        {/* Desktop Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="hidden md:block"
        >
          <Card className="bg-white/5 backdrop-blur-md border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left p-4 text-white/80 font-semibold w-20">Rank</th>
                    <th className="text-left p-4 text-white/80 font-semibold">Player</th>
                    <th className="text-center p-4 text-white/80 font-semibold">Score</th>
                    <th className="text-center p-4 text-white/80 font-semibold">Streak</th>
                    <th className="text-center p-4 text-white/80 font-semibold">Badges</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="p-4"><Skeleton className="h-8 w-10 bg-white/10" /></td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
                            <Skeleton className="h-5 w-32 bg-white/10" />
                          </div>
                        </td>
                        <td className="p-4"><Skeleton className="h-6 w-14 mx-auto bg-white/10" /></td>
                        <td className="p-4"><Skeleton className="h-6 w-10 mx-auto bg-white/10" /></td>
                        <td className="p-4"><Skeleton className="h-6 w-10 mx-auto bg-white/10" /></td>
                      </tr>
                    ))
                  ) : (
                    (category === 'overall' ? restOfLeaderboard : leaderboard).map((entry, index) => {
                      const displayScore = category === 'overall' 
                        ? entry.overall_score 
                        : getCategoryScore(entry.category_scores, category) || 0;
                      const isCurrentUser = entry.user_id === user?.id;
                      const displayRank = category === 'overall' ? entry.rank_position : index + 1;
                      
                      return (
                        <motion.tr 
                          key={entry.id} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className={`${getRowStyles(displayRank, isCurrentUser)} cursor-pointer group`}
                          onClick={() => handleViewProfile(entry.user_id)}
                        >
                          <td className="p-4">
                            <div className="flex items-center justify-center">
                              {getRankDisplay(displayRank)}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full ${getAvatarColor(displayRank)} flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:ring-2 ring-primary/50 transition-all`}>
                                {getInitials(getDisplayName(entry))}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-white font-medium block group-hover:text-primary transition-colors">
                                  {getDisplayName(entry)}
                                  {isCurrentUser && (
                                    <Badge variant="outline" className="ml-2 text-xs border-primary/50 text-primary">
                                      You
                                    </Badge>
                                  )}
                                </span>
                                <ExternalLink className="h-3 w-3 text-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <span className="text-white font-bold text-lg">{displayScore}</span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1 text-orange-400">
                              <Flame className="h-4 w-4" />
                              <span className="font-semibold">{entry.streak_count}</span>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1 text-yellow-400">
                              <Star className="h-4 w-4" />
                              <span className="font-semibold">{entry.badges_earned?.length || 0}</span>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {!loading && leaderboard.length === 0 && (
          <div className="text-center py-16">
            <Trophy className="h-20 w-20 text-white/20 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-white/80 mb-2">No Rankings Yet</h3>
            <p className="text-white/50">Be the first to complete a quiz and claim the top spot!</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Leaderboard;