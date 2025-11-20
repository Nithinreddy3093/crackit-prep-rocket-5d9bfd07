import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useSimpleDashboard = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('quiz_results')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        if (error) throw error;
        setResults(data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user]);

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

  // AI-based recommendations
  const topicPerformance: Record<string, { scores: number[]; count: number }> = results.reduce((acc, result) => {
    if (!acc[result.topic]) {
      acc[result.topic] = { scores: [], count: 0 };
    }
    acc[result.topic].scores.push(result.score);
    acc[result.topic].count += 1;
    return acc;
  }, {} as Record<string, { scores: number[]; count: number }>);

  const weakTopics = Object.entries(topicPerformance)
    .map(([topic, data]) => ({
      topic,
      avgScore: data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
      count: data.count,
    }))
    .filter(t => t.avgScore < 70)
    .sort((a, b) => a.avgScore - b.avgScore)
    .slice(0, 3)
    .map(t => ({
      topic: t.topic,
      reason: `Your average score is ${Math.round(t.avgScore)}%. Practice more to improve!`,
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
    },
    loading,
  };
};
