import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Target, TrendingUp, Clock, RefreshCw } from 'lucide-react';
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
  const { data, loading, refetch } = useSimpleDashboard();
  
  // Auto-refresh when navigating to dashboard (e.g., after quiz completion)
  useEffect(() => {
    if (location.pathname === '/dashboard' && refetch) {
      console.log('[SimpleDashboard] Auto-refreshing data on navigation');
      refetch();
    }
  }, [location.pathname]);

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
    <AnimatedPage className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Welcome Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Your Learning Dashboard</h1>
          <p className="text-muted-foreground">Track your progress and keep learning</p>
        </div>
        <Button
          onClick={refetch}
          variant="outline"
          size="sm"
          className="gap-2 ml-4"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </motion.div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="time">Time</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SkillRadarChart data={data.skillData} />
            <PerformanceTrendChart data={data.performanceData} />
          </div>

          {/* Heatmap and Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StudyHeatmap data={data.heatmapData} />
            <ContinueLearning recommendations={data.recommendations} />
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
                <div>
                  <p className="font-medium">{quiz.topic}</p>
                  <p className="text-sm text-muted-foreground">{quiz.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{quiz.score}%</p>
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
