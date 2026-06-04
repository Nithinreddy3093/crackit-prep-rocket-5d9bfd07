import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Target, TrendingUp, Clock, RefreshCw, Award } from 'lucide-react';
import { useSimpleDashboard } from '@/hooks/useSimpleDashboard';
import SkillRadarChart from './SkillRadarChart';
import PerformanceTrendChart from './PerformanceTrendChart';
import StudyHeatmap from './StudyHeatmap';
import StreakCounter from './StreakCounter';
import ContinueLearning from './ContinueLearning';
import TopicAnalytics from './analytics/TopicAnalytics';
import TimeSpentAnalytics from './analytics/TimeSpentAnalytics';
import ImprovementTrends from './analytics/ImprovementTrends';
import AnimatedPage from '@/components/common/AnimatedPage';
import GlassCard from '@/components/common/GlassCard';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SimpleDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, loading, refetch } = useSimpleDashboard();
  
  // Auto-refresh when navigating to dashboard (e.g., after quiz completion)
  useEffect(() => {
    const locationState = location.state as { quizCompleted?: boolean; refreshData?: boolean } | undefined;
    
    // Check for quiz completion flag from navigation state
    if (locationState?.quizCompleted || locationState?.refreshData) {
      console.log('[SimpleDashboard] Quiz completed - refreshing dashboard data');
      refetch();
      // Clear the state so it doesn't trigger again
      window.history.replaceState({}, document.title);
    }
    // Only run on location.state changes, not on refetch changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  // Real-time subscription is now handled in useSimpleDashboard hook
  // to avoid duplicate subscriptions and potential memory leaks

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <AnimatedPage className="max-w-7xl mx-auto px-4 py-4 sm:p-6 pb-24 md:pb-6 space-y-6 sm:space-y-8">
      {/* Welcome Header */}
      <motion.div
        className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center md:text-left flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 gradient-text">Your Learning Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Track your progress and keep learning</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto justify-center md:justify-end">
          <Button
            onClick={() => navigate('/achievements')}
            variant="outline"
            size="sm"
            className="gap-2 flex-1 md:flex-none"
          >
            <Award className="h-4 w-4" />
            Achievements
          </Button>
          <Button
            onClick={refetch}
            variant="outline"
            size="sm"
            className="gap-2 flex-1 md:flex-none"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <GlassCard className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <motion.div 
              className="text-2xl font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {data.totalQuizzes}
            </motion.div>
          </CardContent>
        </GlassCard>

        <GlassCard className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <motion.div 
              className="text-2xl font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            >
              {data.averageScore}%
            </motion.div>
          </CardContent>
        </GlassCard>

        <GlassCard className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <motion.div 
              className="text-2xl font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            >
              {data.bestScore}%
            </motion.div>
          </CardContent>
        </GlassCard>

        <GlassCard className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <motion.div 
              className="text-2xl font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
            >
              {Math.floor(data.totalTime / 60)}h
            </motion.div>
          </CardContent>
        </GlassCard>
      </div>

      {/* Streak Counter */}
      <StreakCounter 
        currentStreak={data.currentStreak} 
        longestStreak={data.longestStreak} 
      />

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="topics" className="text-xs sm:text-sm">Topics</TabsTrigger>
          <TabsTrigger value="time" className="text-xs sm:text-sm">Time</TabsTrigger>
          <TabsTrigger value="trends" className="text-xs sm:text-sm">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="min-w-0 overflow-hidden"><SkillRadarChart data={data.skillData} /></div>
            <div className="min-w-0 overflow-hidden lg:col-span-2"><PerformanceTrendChart data={data.performanceData} /></div>
          </div>

          {/* Heatmap and Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="min-w-0 overflow-hidden"><StudyHeatmap data={data.heatmapData} /></div>
            <div className="min-w-0 overflow-hidden"><ContinueLearning recommendations={data.recommendations} /></div>
          </div>
        </TabsContent>

        <TabsContent value="topics" className="mt-6">
          <TopicAnalytics 
            strengths={data.strengths} 
            weaknesses={data.weaknesses}
          />
        </TabsContent>

        <TabsContent value="time" className="mt-6">
          <TimeSpentAnalytics
            data={data.timeSpentByTopic}
            totalTime={data.totalTime}
            avgTimePerQuiz={data.avgTimePerQuiz}
            mostProductiveTime={data.mostProductiveTime}
          />
        </TabsContent>

        <TabsContent value="trends" className="mt-6">
          <ImprovementTrends
            data={data.trendData}
            overallTrend={data.overallTrend}
            improvementRate={data.improvementRate}
          />
        </TabsContent>
      </Tabs>

      {/* Recent Quizzes */}
      <GlassCard>
        <CardHeader>
          <CardTitle>Recent Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.recentQuizzes.map((quiz, index) => (
              <motion.div 
                key={index} 
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-smooth"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 4 }}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{quiz.topic}</p>
                  <p className="text-sm text-muted-foreground truncate">{quiz.date}</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-xl sm:text-2xl font-bold">{quiz.score}%</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </GlassCard>
    </AnimatedPage>
  );
};

export default SimpleDashboard;
