
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
  
  // Enhanced data fetching with better deduplication and error handling
  const { data: activities, isLoading: activitiesLoading, refetch: refetchActivities } = useQuery({
    queryKey: ['userActivities', user?.id],
    queryFn: async () => {
      if (!user) return [];
      try {
        console.log('Fetching dashboard activities for user:', user.id);
        
        // Get both data sources
        const [history, quizResults] = await Promise.all([
          getPerformanceHistory(user.id),
          getUserQuizResults(user.id)
        ]);
        
        console.log('Fetched data:', {
          historyCount: history.length,
          quizResultsCount: quizResults.length
        });
        
        // Convert performance history to activities
        const historyActivities = history.map((item, index) => ({
          id: `history-${index + 1}`,
          type: 'quiz' as const,
          name: `${item.topic} Quiz`,
          score: `${item.score}/100`,
          date: item.date,
          topic: item.topic
        }));
        
        // Convert quiz results to activities with better score formatting
        const quizActivities = quizResults.map((result, index) => ({
          id: `quiz-${result.id || index + 1}`,
          type: 'quiz' as const,
          name: `${result.topic} Quiz`,
          score: `${result.score}%`,
          date: result.date || new Date().toISOString(),
          topic: result.topic
        }));
        
        // Combine and deduplicate more intelligently
        const allActivities = [...quizActivities, ...historyActivities];
        
        // Remove duplicates based on topic and similar timestamps (within 1 minute)
        const deduplicatedActivities = allActivities.filter((activity, index, arr) => {
          const activityTime = new Date(activity.date).getTime();
          
          // Find if there's a duplicate
          const duplicateIndex = arr.findIndex((other, otherIndex) => {
            if (otherIndex >= index) return false; // Only check previous items
            
            const otherTime = new Date(other.date).getTime();
            const timeDiff = Math.abs(activityTime - otherTime);
            
            return other.topic === activity.topic && 
                   timeDiff < 60000; // Within 1 minute
          });
          
          return duplicateIndex === -1; // Keep if no duplicate found
        });
        
        // Sort by date, most recent first
        const sortedActivities = deduplicatedActivities.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        console.log('Activities processing result:', {
          originalCount: allActivities.length,
          afterDeduplication: deduplicatedActivities.length,
          finalCount: sortedActivities.length
        });
        
        return sortedActivities;
      } catch (error) {
        console.error('Error fetching dashboard activities:', error);
        return [];
      }
    },
    enabled: !!user,
    staleTime: 1000 * 30, // 30 seconds - shorter for more frequent updates
    refetchOnWindowFocus: true, // Refetch when user returns to tab
  });

  // Enhanced effect to handle quiz completion and dashboard refresh
  useEffect(() => {
    if (location.state?.refreshData || location.state?.quizCompleted) {
      console.log('Dashboard refresh triggered by location state:', {
        refreshData: location.state?.refreshData,
        quizCompleted: location.state?.quizCompleted,
        topic: location.state?.topic,
        score: location.state?.score,
        timestamp: location.state?.timestamp
      });
      
      // Comprehensive cache invalidation
      const refreshQueries = async () => {
        try {
          console.log('Starting comprehensive dashboard refresh...');
          
          // Invalidate all relevant queries
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['userPerformance'] }),
            queryClient.invalidateQueries({ queryKey: ['performanceHistory'] }),
            queryClient.invalidateQueries({ queryKey: ['quizResults'] }),
            queryClient.invalidateQueries({ queryKey: ['topicScores'] }),
            queryClient.invalidateQueries({ queryKey: ['aiRecommendations'] }),
            queryClient.invalidateQueries({ queryKey: ['userActivities'] }),
            queryClient.invalidateQueries({ queryKey: ['userBadges'] }),
          ]);
          
          console.log('✅ Cache invalidation completed');
          
          // Force refetch of critical data
          await Promise.all([
            refetchActivities(),
            queryClient.refetchQueries({ queryKey: ['userPerformance', user?.id] }),
          ]);
          
          console.log('✅ Data refetch completed');
          
          // Trigger component re-renders
          setForceRefresh(prev => !prev);
          
          console.log('✅ Dashboard refresh completed');
          
        } catch (error) {
          console.error('Error during dashboard refresh:', error);
        }
      };
      
      refreshQueries();
      
      // Show completion toast for quiz
      if (location.state?.quizCompleted && location.state?.topic) {
        toast({
          title: "Quiz Completed! 🎉",
          description: `Your ${location.state.topic} quiz result (${location.state.score}%) has been added to your profile.`,
          variant: "default",
        });
      }
      
      // Clear the state to avoid unnecessary refreshes
      window.history.replaceState({}, document.title);
    }
  }, [location.state, queryClient, refetchActivities, user?.id]);

  // Update activities when data changes
  useEffect(() => {
    if (activities) {
      console.log('Setting recent activities:', activities.length);
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
