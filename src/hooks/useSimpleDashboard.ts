import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useSimpleDashboard = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('[useSimpleDashboard] Fetching quiz results...');

        const { data, error } = await supabase
          .from('quiz_results')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        if (error) throw error;
        console.log('[useSimpleDashboard] Fetched', data?.length || 0, 'quiz results');
        setResults(data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user, lastRefresh]);

  // Function to manually refresh dashboard data - memoized to prevent infinite loops
  const refetchDashboardData = useCallback(() => {
    console.log('[useSimpleDashboard] Manual refresh triggered');
    setLastRefresh(Date.now());
  }, []);

  // Set up real-time subscription for quiz results
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('dashboard-quiz-results')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'quiz_results',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('[useSimpleDashboard] New quiz result:', payload);
          refetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetchDashboardData]);

  // Calculate skill data for radar chart

  const skillData: Record<string, { total: number; count: number }> = results.reduce((acc, result) => {
    if (!acc[result.topic]) {
      acc[result.topic] = { total: 0, count: 0 };
    }
    acc[result.topic].total += result.score;
    acc[result.topic].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const skillChartData = Object.entries(skillData)
    .slice(0, 6)
    .map(([skill, data]) => ({
      skill: skill.slice(0, 15),
      score: Math.round(data.total / data.count),
      fullMark: 100,
    }));

  // Calculate performance trend
  const performanceData = results
    .slice(0, 10)
    .reverse()
    .map(r => ({
      date: new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: r.score,
    }));

  // Calculate heatmap data (last 84 days)
  const heatmapData = [];
  for (let i = 83; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const count = results.filter(r => 
      new Date(r.date).toISOString().split('T')[0] === dateStr
    ).length;
    heatmapData.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count,
    });
  }

  // Calculate streak
  const sortedDates = results
    .map(r => new Date(r.date).toISOString().split('T')[0])
    .sort()
    .reverse();
  
  let currentStreak = 0;
  let longestStreak = 0;
  let temp = 0;
  let lastDate = new Date().toISOString().split('T')[0];

  for (const dateStr of sortedDates) {
    const diffDays = Math.floor((new Date(lastDate).getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      temp++;
      longestStreak = Math.max(longestStreak, temp);
    } else {
      temp = 1;
    }
    
    lastDate = dateStr;
  }

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const hasActivityToday = sortedDates.includes(today) || sortedDates.includes(yesterday);
  currentStreak = hasActivityToday ? temp : 0;

  // Enhanced topic performance analysis
  const topicPerformance: Record<string, { 
    scores: number[]; 
    count: number; 
    totalTime: number;
    recentScores: number[];
  }> = results.reduce((acc, result) => {
    if (!acc[result.topic]) {
      acc[result.topic] = { scores: [], count: 0, totalTime: 0, recentScores: [] };
    }
    acc[result.topic].scores.push(result.score);
    acc[result.topic].count += 1;
    acc[result.topic].totalTime += result.completion_time || 0;
    return acc;
  }, {} as Record<string, { scores: number[]; count: number; totalTime: number; recentScores: number[] }>);

  // Calculate strengths and weaknesses
  const topicStats = Object.entries(topicPerformance).map(([topic, data]) => {
    const avgScore = Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length);
    const recent = data.scores.slice(-3);
    const older = data.scores.slice(0, -3);
    const recentAvg = recent.length > 0 ? recent.reduce((a, b) => a + b, 0) / recent.length : avgScore;
    const olderAvg = older.length > 0 ? older.reduce((a, b) => a + b, 0) / older.length : avgScore;
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (recent.length >= 2 && older.length >= 2) {
      const diff = recentAvg - olderAvg;
      if (diff > 5) trend = 'up';
      else if (diff < -5) trend = 'down';
    }

    return {
      topic,
      avgScore,
      attempts: data.count,
      totalTime: data.totalTime,
      trend,
    };
  });

  const strengths = topicStats
    .filter(t => t.avgScore >= 75)
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 5);

  const weaknesses = topicStats
    .filter(t => t.avgScore < 75)
    .sort((a, b) => a.avgScore - b.avgScore)
    .slice(0, 5);

  // Time spent analytics
  const timeSpentByTopic = topicStats.map(t => ({
    topic: t.topic.slice(0, 15),
    minutes: Math.round(t.totalTime / 60),
    efficiency: t.avgScore,
  }));

  const avgTimePerQuiz = results.length > 0 
    ? results.reduce((sum, r) => sum + (r.completion_time || 0), 0) / results.length
    : 0;

  // Find most productive time (mock for now - could be enhanced with hour-based data)
  const mostProductiveTime = 'Afternoon';

  // Improvement trends
  const trendData = results
    .slice(0, 15)
    .reverse()
    .map(r => ({
      date: new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: r.score,
      accuracy: r.score, // Could be calculated differently
      speed: Math.min(100, Math.round((600 / (r.completion_time || 600)) * 100)), // Speed score
    }));

  // Calculate improvement rate
  const recentAvg = trendData.length > 0 
    ? trendData.slice(-5).reduce((sum, d) => sum + d.score, 0) / Math.min(5, trendData.length)
    : 0;
  const olderAvg = trendData.length > 5
    ? trendData.slice(0, 5).reduce((sum, d) => sum + d.score, 0) / 5
    : recentAvg;
  
  const improvementRate = Math.round(recentAvg - olderAvg);
  const overallTrend: 'improving' | 'stable' | 'declining' = improvementRate > 5 ? 'improving' : improvementRate < -5 ? 'declining' : 'stable';

  // AI-based recommendations
  const weakTopics = weaknesses.slice(0, 3).map(t => ({
    topic: t.topic,
    reason: `Your average score is ${t.avgScore}%. Practice more to improve!`,
    difficulty: t.avgScore < 50 ? 'Beginner' : 'Intermediate',
  }));

  const recommendations = weakTopics.length > 0 ? weakTopics : [
    {
      topic: 'Advanced Algorithms',
      reason: 'Challenge yourself with advanced topics!',
      difficulty: 'Advanced',
    },
    {
      topic: 'System Design',
      reason: 'Expand your knowledge to system architecture',
      difficulty: 'Advanced',
    },
  ];

  return {
    data: {
      totalQuizzes: results.length,
      averageScore: results.length > 0 
        ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
        : 0,
      bestScore: results.length > 0 
        ? Math.max(...results.map(r => r.score))
        : 0,
      totalTime: results.reduce((sum, r) => sum + (r.completion_time || 0), 0),
      recentQuizzes: results
        .slice(0, 5)
        .map(r => ({
          topic: r.topic,
          score: r.score,
          date: new Date(r.date).toLocaleDateString(),
        })),
      skillData: skillChartData,
      performanceData,
      heatmapData,
      currentStreak,
      longestStreak,
      recommendations,
      // New analytics data
      strengths,
      weaknesses,
      timeSpentByTopic,
      avgTimePerQuiz,
      mostProductiveTime,
      trendData,
      overallTrend,
      improvementRate,
    },
    loading,
    refetch: refetchDashboardData,
  };
};
