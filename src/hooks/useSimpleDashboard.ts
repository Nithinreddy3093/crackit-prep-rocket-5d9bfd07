import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalQuizzes: number;
  overallScore: number;
  averageScore: number;
  totalTimeSpent: number;
  recentQuizzes: Array<{
    id: string;
    topic_id: string;
    score_percentage: number;
    completed_at: string;
    correct_answers: number;
    total_questions: number;
  }>;
  topicPerformance: Array<{
    topic: string;
    averageScore: number;
    bestScore: number;
    quizzesCompleted: number;
    lastAttempt: string;
    weakAreas: string[];
    improvement: string;
  }>;
}

export const useSimpleDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalQuizzes: 0,
    overallScore: 0,
    averageScore: 0,
    totalTimeSpent: 0,
    recentQuizzes: [],
    topicPerformance: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('📊 Loading dashboard data for user:', user.id);

      // Get recent quiz sessions
      const { data: recentSessions, error: sessionsError } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('user_id', user.id)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(10);

      if (sessionsError) {
        console.error('Error loading quiz sessions:', sessionsError);
        throw new Error('Failed to load quiz data');
      }

      const sessions = recentSessions || [];

      // Calculate overall statistics
      const totalQuizzes = sessions.length;
      const totalTimeSpent = sessions.reduce((sum, session) => sum + (session.time_spent_ms || 0), 0);
      const averageScore = totalQuizzes > 0 
        ? Math.round(sessions.reduce((sum, session) => sum + session.score_percentage, 0) / totalQuizzes)
        : 0;

      // Get topic performance with enhanced metrics
      const topicMap = new Map<string, {
        scores: number[];
        lastAttempt: string;
        questionDetails: any[];
      }>();

      sessions.forEach(session => {
        const topic = session.topic_id;
        if (!topicMap.has(topic)) {
          topicMap.set(topic, {
            scores: [],
            lastAttempt: session.completed_at || '',
            questionDetails: []
          });
        }
        const topicData = topicMap.get(topic)!;
        topicData.scores.push(session.score_percentage);
        if (session.completed_at && session.completed_at > topicData.lastAttempt) {
          topicData.lastAttempt = session.completed_at;
        }
        if (session.question_details) {
          topicData.questionDetails.push(...(Array.isArray(session.question_details) ? session.question_details : []));
        }
      });

      const topicPerformance = Array.from(topicMap.entries()).map(([topic, data]) => {
        const averageScore = Math.round(data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length);
        const bestScore = Math.max(...data.scores);
        
        // Calculate improvement (last score vs first score)
        const improvement = data.scores.length > 1 
          ? data.scores[data.scores.length - 1] - data.scores[0]
          : 0;
        const improvementStr = improvement > 0 ? `+${improvement}%` : improvement < 0 ? `${improvement}%` : '0%';
        
        // Identify weak areas (questions answered incorrectly most often)
        const incorrectTopics = new Map<string, number>();
        data.questionDetails.forEach((detail: any) => {
          if (!detail.isCorrect && detail.topic) {
            incorrectTopics.set(detail.topic, (incorrectTopics.get(detail.topic) || 0) + 1);
          }
        });
        
        const weakAreas = Array.from(incorrectTopics.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([area]) => area);
        
        return {
          topic,
          averageScore,
          bestScore,
          quizzesCompleted: data.scores.length,
          lastAttempt: data.lastAttempt,
          weakAreas,
          improvement: improvementStr
        };
      }).sort((a, b) => new Date(b.lastAttempt).getTime() - new Date(a.lastAttempt).getTime());

      // Format recent quizzes
      const recentQuizzes = sessions.slice(0, 5).map(session => ({
        id: session.id,
        topic_id: session.topic_id,
        score_percentage: session.score_percentage,
        completed_at: session.completed_at || '',
        correct_answers: session.correct_answers,
        total_questions: session.total_questions
      }));

      const dashboardStats: DashboardStats = {
        totalQuizzes,
        overallScore: averageScore,
        averageScore,
        totalTimeSpent,
        recentQuizzes,
        topicPerformance
      };

      setStats(dashboardStats);
      
      console.log('✅ Dashboard data loaded:', dashboardStats);

    } catch (err) {
      console.error('❌ Error loading dashboard data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Refresh data
  const refreshData = useCallback(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Load data on mount and when user changes
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Format time helper
  const formatTime = useCallback((ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }, []);

  // Format date helper
  const formatDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, []);

  return {
    stats,
    isLoading,
    error,
    refreshData,
    formatTime,
    formatDate
  };
};