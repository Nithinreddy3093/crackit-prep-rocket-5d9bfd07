import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SubjectProgress {
  subjectId: string;
  progress: number;
  score: number;
  trend: 'up' | 'down' | 'stable';
}

interface UPSCProgressData {
  overallProgress: number;
  subjectProgress: SubjectProgress[];
  questionsToday: number;
  streak: number;
}

export const useUPSCProgress = () => {
  const { user } = useAuth();
  const [data, setData] = useState<UPSCProgressData>({
    overallProgress: 0,
    subjectProgress: [],
    questionsToday: 0,
    streak: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch UPSC progress from database
      const { data: progressData, error: progressError } = await supabase
        .from('upsc_progress')
        .select('*')
        .eq('user_id', user.id);

      if (progressError) throw progressError;

      if (!progressData || progressData.length === 0) {
        // No progress data yet
        setData({
          overallProgress: 0,
          subjectProgress: [],
          questionsToday: 0,
          streak: 0,
        });
        return;
      }

      // Calculate subject progress
      const subjectProgress: SubjectProgress[] = progressData.map(item => {
        const attemptedQuestions = item.questions_attempted || 0;
        const correctQuestions = item.questions_correct || 0;
        const score = attemptedQuestions > 0 
          ? Math.round((correctQuestions / attemptedQuestions) * 100) 
          : 0;
        
        // Calculate progress based on a target (e.g., 500 questions per subject)
        const targetQuestions = 500;
        const progress = Math.min(100, Math.round((attemptedQuestions / targetQuestions) * 100));

        // Determine trend based on best_score vs current score
        const bestScore = item.best_score || 0;
        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (score > bestScore - 5) trend = 'up';
        else if (score < bestScore - 10) trend = 'down';

        return {
          subjectId: item.subject_id,
          progress,
          score,
          trend,
        };
      });

      // Calculate overall progress
      const totalProgress = subjectProgress.reduce((sum, s) => sum + s.progress, 0);
      const overallProgress = subjectProgress.length > 0 
        ? Math.round(totalProgress / subjectProgress.length) 
        : 0;

      // Calculate questions completed today
      const today = new Date().toISOString().split('T')[0];
      const questionsToday = progressData
        .filter(item => item.last_practice_date?.startsWith(today))
        .reduce((sum, item) => sum + (item.questions_attempted || 0), 0);

      // Get max streak from all subjects
      const streak = Math.max(...progressData.map(item => item.daily_streak || 0), 0);

      setData({
        overallProgress,
        subjectProgress,
        questionsToday,
        streak,
      });
    } catch (err) {
      console.error('Error fetching UPSC progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch progress');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('upsc-progress-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'upsc_progress',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchProgress();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchProgress]);

  return {
    data,
    loading,
    error,
    refetch: fetchProgress,
  };
};
