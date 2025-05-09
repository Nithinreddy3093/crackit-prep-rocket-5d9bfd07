
import React, { useEffect } from 'react';
import { Brain } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getAIRecommendations } from '@/services/performance/aiRecommendationsService';

interface AISummaryProps {
  summary?: string;
  loading?: boolean;
  forceRefresh?: boolean;
}

const AISummary: React.FC<AISummaryProps> = ({ summary: propSummary, loading: propLoading, forceRefresh }) => {
  const { user } = useAuth();
  
  const { data: fetchedSummary, isLoading, refetch } = useQuery({
    queryKey: ['aiRecommendations', user?.id],
    queryFn: async () => {
      if (!user?.id) return "Log in to get personalized recommendations";
      return getAIRecommendations(user.id);
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Force refresh when requested (e.g. after quiz submission)
  useEffect(() => {
    if (forceRefresh) {
      console.log('Forcing refresh of AI recommendations');
      refetch();
    }
  }, [forceRefresh, refetch]);

  const summary = propSummary || fetchedSummary;
  const loading = propLoading || isLoading;

  return (
    <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
      <div className="flex items-center mb-2">
        <Brain className="h-5 w-5 text-primary mr-2" />
        <span className="text-white font-medium">AI Performance Summary</span>
      </div>
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full bg-darkBlue-700" />
          <Skeleton className="h-4 w-3/4 bg-darkBlue-700" />
        </div>
      ) : (
        <p className="text-white/80 text-sm">{summary || "Complete more quizzes to get personalized AI recommendations."}</p>
      )}
    </div>
  );
};

export default AISummary;
