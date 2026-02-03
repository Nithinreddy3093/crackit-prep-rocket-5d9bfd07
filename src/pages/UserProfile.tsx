import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Trophy, Award, Target, Flame, Star, ArrowLeft, 
  Calendar, Clock, TrendingUp, BarChart3, Medal,
  Crown, BookOpen, Zap, CheckCircle2, XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import PremiumBadges from '@/components/dashboard/PremiumBadges';

interface UserProfileData {
  userId: string;
  displayName: string;
  rank: number;
  overallScore: number;
  categoryScores: Record<string, number>;
  streakCount: number;
  badgesEarned: string[];
  lastActivity: string;
  joinedDate: string;
}

interface QuizHistoryItem {
  id: string;
  topic: string;
  score: number;
  date: string;
  completionTime: number | null;
  questionDetails: any[] | null;
}

interface UserBadge {
  id: string;
  badge_id: string;
  badge_name: string;
  badge_description: string;
  icon: string;
  earned_date: string;
}

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>([]);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    if (userId) {
      setIsOwnProfile(user?.id === userId);
      fetchUserProfile();
    }
  }, [userId, user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      // Fetch leaderboard entry for public profile data
      const { data: leaderboardData, error: leaderboardError } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (leaderboardError) throw leaderboardError;

      // Fetch user's join date from users table (only accessible if own profile)
      let joinedDate = '';
      if (user?.id === userId) {
        const { data: userData } = await supabase
          .from('users')
          .select('created_at')
          .eq('id', userId)
          .single();
        joinedDate = userData?.created_at || '';
      }

      // Fetch quiz history (only accessible if own profile due to RLS)
      let quizData: QuizHistoryItem[] = [];
      if (user?.id === userId) {
        const { data: quizResults, error: quizError } = await supabase
          .from('quiz_results')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false })
          .limit(50);

        if (!quizError && quizResults) {
          quizData = quizResults.map(q => ({
            id: q.id,
            topic: q.topic,
            score: q.score,
            date: q.date,
            completionTime: q.completion_time,
            questionDetails: q.question_details as any[] | null
          }));
        }
      }

      // Fetch badges (only accessible if own profile due to RLS)
      let badgeData: UserBadge[] = [];
      if (user?.id === userId) {
        const { data: userBadges, error: badgeError } = await supabase
          .from('user_badges')
          .select('*')
          .eq('user_id', userId)
          .order('earned_date', { ascending: false });

        if (!badgeError && userBadges) {
          badgeData = userBadges;
        }
      }

      setProfile({
        userId: userId!,
        displayName: leaderboardData.display_name || `Player ${leaderboardData.rank_position}`,
        rank: leaderboardData.rank_position || 0,
        overallScore: leaderboardData.overall_score || 0,
        categoryScores: (leaderboardData.category_scores as Record<string, number>) || {},
        streakCount: leaderboardData.streak_count || 0,
        badgesEarned: (leaderboardData.badges_earned as string[]) || [],
        lastActivity: leaderboardData.last_activity || '',
        joinedDate
      });

      setQuizHistory(quizData);
      setBadges(badgeData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-8 w-8 text-yellow-400" />;
    if (rank === 2) return <Medal className="h-8 w-8 text-gray-300" />;
    if (rank === 3) return <Medal className="h-8 w-8 text-amber-500" />;
    return <Trophy className="h-8 w-8 text-primary" />;
  };

  const getAvatarColor = (rank: number) => {
    if (rank === 1) return "from-yellow-400 to-amber-500";
    if (rank === 2) return "from-gray-300 to-gray-400";
    if (rank === 3) return "from-amber-400 to-orange-500";
    return "from-primary to-primary/80";
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const formatTopicName = (topic: string) => {
    const topicNames: Record<string, string> = {
      'dsa': 'Data Structures & Algorithms',
      'oops': 'Object-Oriented Programming',
      'dbms': 'Database Management',
      'os': 'Operating Systems',
      'ai-ml': 'AI & Machine Learning',
      'web-development': 'Web Development',
      'infosys-prep': 'Infosys Prep',
      'tcs-nqt': 'TCS NQT',
      'Data Structures & Algorithms': 'DSA',
      'Object-Oriented Programming': 'OOPs',
      'Database Management': 'DBMS',
      'AI & Machine Learning': 'AI/ML'
    };
    return topicNames[topic] || topic.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
          <div className="space-y-6">
            <Skeleton className="h-12 w-48 bg-white/10" />
            <Skeleton className="h-64 w-full bg-white/10 rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-32 bg-white/10 rounded-xl" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl flex items-center justify-center">
          <Card className="bg-white/5 border-white/10 p-8 text-center">
            <Trophy className="h-16 w-16 text-white/30 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Profile Not Found</h2>
            <p className="text-white/60 mb-4">This user hasn't completed any quizzes yet.</p>
            <Button onClick={() => navigate('/leaderboard')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Leaderboard
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button 
            onClick={() => navigate('/leaderboard')} 
            variant="ghost" 
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leaderboard
          </Button>
        </motion.div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-white/10 via-white/5 to-transparent border-white/10 mb-8 overflow-hidden">
            <div className="relative p-8">
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-50" />
              
              <div className="relative flex flex-col md:flex-row items-center gap-6">
                {/* Avatar */}
                <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${getAvatarColor(profile.rank)} flex items-center justify-center text-white font-bold text-4xl shadow-2xl ring-4 ring-white/20`}>
                  {getInitials(profile.displayName)}
                </div>

                {/* User Info */}
                <div className="text-center md:text-left flex-1">
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                    <h1 className="text-3xl font-bold text-white">{profile.displayName}</h1>
                    {isOwnProfile && (
                      <Badge variant="secondary" className="bg-primary/30 text-primary-foreground border-0">
                        You
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 justify-center md:justify-start text-white/70">
                    {getRankIcon(profile.rank)}
                    <span className="text-xl">Rank #{profile.rank}</span>
                  </div>
                  {profile.lastActivity && (
                    <p className="text-white/50 mt-2 text-sm flex items-center gap-1 justify-center md:justify-start">
                      <Clock className="h-3 w-3" />
                      Last active {formatDistanceToNow(new Date(profile.lastActivity), { addSuffix: true })}
                    </p>
                  )}
                </div>

                {/* Stats Cards */}
                <div className="flex gap-4 md:gap-6">
                  <div className="text-center bg-white/5 rounded-xl p-4 min-w-[100px]">
                    <div className="text-3xl font-bold text-white flex items-center justify-center gap-1">
                      <Target className="h-6 w-6 text-primary" />
                      {profile.overallScore}
                    </div>
                    <p className="text-white/60 text-sm">Score</p>
                  </div>
                  <div className="text-center bg-white/5 rounded-xl p-4 min-w-[100px]">
                    <div className="text-3xl font-bold text-orange-400 flex items-center justify-center gap-1">
                      <Flame className="h-6 w-6" />
                      {profile.streakCount}
                    </div>
                    <p className="text-white/60 text-sm">Streak</p>
                  </div>
                  <div className="text-center bg-white/5 rounded-xl p-4 min-w-[100px]">
                    <div className="text-3xl font-bold text-yellow-400 flex items-center justify-center gap-1">
                      <Star className="h-6 w-6" />
                      {badges.length || profile.badgesEarned.length}
                    </div>
                    <p className="text-white/60 text-sm">Badges</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Category Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Topic Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(profile.categoryScores)
                  .filter(([_, score]) => score > 0)
                  .sort(([, a], [, b]) => b - a)
                  .map(([topic, score], index) => (
                    <motion.div
                      key={topic}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="bg-white/5 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/80 font-medium text-sm">
                          {formatTopicName(topic)}
                        </span>
                        <span className={`font-bold ${getScoreColor(score)}`}>
                          {score}%
                        </span>
                      </div>
                      <Progress 
                        value={score} 
                        className="h-2 bg-white/10"
                      />
                    </motion.div>
                  ))}
              </div>
              {Object.values(profile.categoryScores).every(s => s === 0) && (
                <p className="text-white/50 text-center py-8">No topic scores available yet.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs for Quiz History and Badges (only for own profile) */}
        {isOwnProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10">
                <TabsTrigger value="history" className="data-[state=active]:bg-primary">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Quiz History
                </TabsTrigger>
                <TabsTrigger value="badges" className="data-[state=active]:bg-primary">
                  <Award className="h-4 w-4 mr-2" />
                  Achievements
                </TabsTrigger>
              </TabsList>

              <TabsContent value="history" className="mt-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Recent Quiz Results ({quizHistory.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {quizHistory.length > 0 ? (
                      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                        {quizHistory.map((quiz, index) => (
                          <motion.div
                            key={quiz.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.02 }}
                            className="bg-white/5 rounded-lg p-4 flex items-center justify-between hover:bg-white/10 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                quiz.score >= 70 ? 'bg-green-500/20' : 
                                quiz.score >= 40 ? 'bg-yellow-500/20' : 'bg-red-500/20'
                              }`}>
                                {quiz.score >= 70 ? (
                                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                                ) : quiz.score >= 40 ? (
                                  <TrendingUp className="h-6 w-6 text-yellow-400" />
                                ) : (
                                  <XCircle className="h-6 w-6 text-red-400" />
                                )}
                              </div>
                              <div>
                                <h4 className="text-white font-medium">
                                  {formatTopicName(quiz.topic)}
                                </h4>
                                <div className="flex items-center gap-3 text-white/50 text-sm">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {format(new Date(quiz.date), 'MMM d, yyyy')}
                                  </span>
                                  {quiz.completionTime && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {Math.floor(quiz.completionTime / 60)}m {quiz.completionTime % 60}s
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`text-2xl font-bold ${getScoreColor(quiz.score)}`}>
                                {quiz.score}%
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <BookOpen className="h-16 w-16 text-white/20 mx-auto mb-4" />
                        <p className="text-white/50">No quiz history available yet.</p>
                        <Button 
                          onClick={() => navigate('/topics')}
                          className="mt-4"
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Take Your First Quiz
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="badges" className="mt-6">
                <PremiumBadges showCategories={true} />
              </TabsContent>
            </Tabs>
          </motion.div>
        )}

        {/* Public view message for other users' profiles */}
        {!isOwnProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/5 border-white/10 text-center py-8">
              <CardContent>
                <Trophy className="h-12 w-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/60">
                  Quiz history and detailed achievements are only visible on your own profile.
                </p>
                {user && (
                  <Button 
                    onClick={() => navigate(`/profile/${user.id}`)}
                    variant="outline"
                    className="mt-4"
                  >
                    View Your Profile
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;
