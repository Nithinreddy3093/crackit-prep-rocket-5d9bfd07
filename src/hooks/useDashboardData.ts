import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { getPerformanceHistory } from '@/services/performance/userPerformanceService';
import { getUserQuizResults } from '@/services/performance/quizResultsService';
import { ActivityItem } from '@/types/dashboard';

export function useDashboardData() {
  const { user } = useAuth();
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [forceRefresh, setForceRefresh] = useState(false);
  const location = useLocation();
  const queryClient = useQueryClient();
  
  // Fetch both performance history and detailed quiz results
  const { data: activities, isLoading: activitiesLoading, refetch: refetchActivities } = useQuery({
    queryKey: ['userActivities', user?.id],
    queryFn: async () => {
      if (!user) return [];
      try {
        // Get historical performance data
        const history = await getPerformanceHistory(user.id);
        const historyActivities = history.map((item, index) => ({
          id: index + 1,
          type: 'quiz' as const,
          name: `${item.topic} Quiz`,
          score: `${item.score}/100`,
          date: item.date,
          topic: item.topic
        }));
        
        // Get detailed quiz results 
        const quizResults = await getUserQuizResults(user.id);
        const quizActivities = quizResults.map((result, index) => ({
          id: history.length + index + 1,
          type: 'quiz' as const,
          name: `${result.topic} Quiz`,
          score: `${result.score}/100`,
          date: result.date || new Date().toISOString(),
          topic: result.topic
        }));
        
        // Combine and deduplicate (prefer quiz results data if available)
        const combined = [...quizActivities, ...historyActivities];
        const seen = new Set();
        const unique = combined.filter(item => {
          const key = `${item.topic}-${item.date}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        
        // Sort by date, most recent first
        return unique.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      } catch (error) {
        console.error('Error fetching activities:', error);
        return [];
      }
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Effect to handle refreshed data flag from location state after quiz submission
  useEffect(() => {
    if (location.state?.refreshData) {
      console.log('Refreshing dashboard data after quiz submission');
      
      // Invalidate all relevant queries
      const refreshQueries = async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['userPerformance'] }),
          queryClient.invalidateQueries({ queryKey: ['performanceHistory'] }),
          queryClient.invalidateQueries({ queryKey: ['quizResults'] }),
          queryClient.invalidateQueries({ queryKey: ['topicScores'] }),
          queryClient.invalidateQueries({ queryKey: ['aiRecommendations'] }),
          queryClient.invalidateQueries({ queryKey: ['userActivities'] }),
          queryClient.invalidateQueries({ queryKey: ['userBadges'] }),
        ]);
        
        // Trigger refetch
        await refetchActivities();
        
        // Trigger a force refresh for components
        setForceRefresh(prev => !prev);
      };
      
      refreshQueries();
      
      // If there's specific quiz completion data, show a toast
      if (location.state?.quizCompleted && location.state?.topic) {
        toast({
          title: "Quiz Results Updated",
          description: `Your ${location.state.topic} quiz has been recorded in your profile.`,
          variant: "default",
        });
      }
      
      // Clear the state to avoid unnecessary refreshes
      window.history.replaceState({}, document.title);
    }
  }, [location.state, queryClient, refetchActivities]);

  useEffect(() => {
    if (activities) {
      setRecentActivities(activities);
    }
  }, [activities]);

  return {
    user,
    recentActivities,
    activitiesLoading,
    forceRefresh,
    refetchActivities
  };
}