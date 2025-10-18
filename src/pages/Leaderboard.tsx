import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Trophy, TrendingUp, TrendingDown, Award, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LeaderboardEntry {
  id: string;
  user_id: string;
  overall_score: number;
  rank_position: number;
  category_scores: any;
  streak_count: number;
  badges_earned: string[];
  users: {
    full_name: string;
    email: string;
  };
}

const Leaderboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('overall');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('leaderboard')
        .select(`
          *,
          users:user_id (
            full_name,
            email
          )
        `)
        .order('rank_position', { ascending: true })
        .limit(50);

      if (error) throw error;

      setLeaderboard(data || []);

      // Find current user's rank
      if (user) {
        const userEntry = data?.find((entry) => entry.user_id === user.id);
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
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Trophy className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Trophy className="h-6 w-6 text-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  const getCategoryScore = (scores: Record<string, number>, category: string) => {
    if (category === 'overall') return null;
    return scores[category] || 0;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center gap-3">
            <Trophy className="h-10 w-10 text-yellow-500" />
            Global Leaderboard
          </h1>
          <p className="text-lg text-white/80">
            Compete with {leaderboard.length}+ learners worldwide
          </p>
        </div>

        {/* User Rank Card */}
        {userRank && (
          <Card className="mb-8 bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getRankIcon(userRank.rank_position)}
                <div>
                  <h3 className="text-xl font-bold text-white">Your Rank</h3>
                  <p className="text-white/70">
                    #{userRank.rank_position} of {leaderboard.length} users
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{userRank.overall_score}</div>
                <p className="text-white/70">Overall Score</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-orange-400">
                  <Zap className="h-4 w-4" />
                  <span className="font-bold">{userRank.streak_count}</span>
                </div>
                <p className="text-xs text-white/60">Day Streak</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-yellow-400">
                  <Award className="h-4 w-4" />
                  <span className="font-bold">{userRank.badges_earned.length}</span>
                </div>
                <p className="text-xs text-white/60">Badges</p>
              </div>
            </div>
          </Card>
        )}

        {/* Category Tabs */}
        <Tabs defaultValue="overall" className="mb-6" onValueChange={setCategory}>
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
            <TabsTrigger value="overall">Overall</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="aptitude">Aptitude</TabsTrigger>
            <TabsTrigger value="coding">Coding</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Leaderboard Table */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-white/80 font-semibold">Rank</th>
                  <th className="text-left p-4 text-white/80 font-semibold">User</th>
                  <th className="text-center p-4 text-white/80 font-semibold">Score</th>
                  <th className="text-center p-4 text-white/80 font-semibold">Streak</th>
                  <th className="text-center p-4 text-white/80 font-semibold">Badges</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="p-4"><Skeleton className="h-8 w-12" /></td>
                      <td className="p-4"><Skeleton className="h-8 w-40" /></td>
                      <td className="p-4"><Skeleton className="h-8 w-16 mx-auto" /></td>
                      <td className="p-4"><Skeleton className="h-8 w-16 mx-auto" /></td>
                      <td className="p-4"><Skeleton className="h-8 w-16 mx-auto" /></td>
                    </tr>
                  ))
                ) : (
                  leaderboard.map((entry) => {
                    const displayScore = category === 'overall' 
                      ? entry.overall_score 
                      : getCategoryScore(entry.category_scores, category) || '-';
                    
                    return (
                      <tr 
                        key={entry.id} 
                        className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                          entry.user_id === user?.id ? 'bg-primary/10' : ''
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center justify-center w-12">
                            {getRankIcon(entry.rank_position)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-white font-medium">
                            {entry.users?.full_name || entry.users?.email?.split('@')[0] || 'Anonymous'}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-white font-bold text-lg">{displayScore}</span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1 text-orange-400">
                            <Zap className="h-4 w-4" />
                            <span className="font-semibold">{entry.streak_count}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1 text-yellow-400">
                            <Award className="h-4 w-4" />
                            <span className="font-semibold">{entry.badges_earned.length}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {!loading && leaderboard.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">No rankings yet. Be the first to complete a quiz!</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Leaderboard;
