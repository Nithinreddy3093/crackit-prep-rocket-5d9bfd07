
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, CheckCircle, LineChart, Award } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getUserPerformance, 
  getPerformanceHistory, 
  getAIRecommendations, 
} from '@/services/performance';
import { getRecentQuizResults } from '@/services/performance/quizResultsService'; 

// Import custom components
import StatCard from './performance-summary/StatCard';
import StrengthAreas from './performance-summary/StrengthAreas';
import ImprovementAreas from './performance-summary/ImprovementAreas';
import AISummary from './performance-summary/AISummary';
import QuizResultSummary from './QuizResultSummary';

interface PerformanceSummaryProps {
  forceRefresh?: boolean;
}

const PerformanceSummary: React.FC<PerformanceSummaryProps> = ({ forceRefresh }) => {
  const { user } = useAuth();
  const [quizzesTaken, setQuizzesTaken] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [avgCompletionTime, setAvgCompletionTime] = useState(0);
  const [recentSubjects, setRecentSubjects] = useState<string[]>([]);
  const [improvementAreas, setImprovementAreas] = useState<string[]>([]);
  const [strengthAreas, setStrengthAreas] = useState<string[]>([]);
  const queryClient = useQueryClient();

  // Use React Query for data fetching with automatic refetching
  const { data: performance, isLoading: performanceLoading, refetch: refetchPerformance } = useQuery({
    queryKey: ['userPerformance', user?.id],
    queryFn: () => user ? getUserPerformance(user.id) : null,
    enabled: !!user,
    staleTime: 30000 // 30 seconds
  });

  const { data: history, isLoading: historyLoading, refetch: refetchHistory } = useQuery({
    queryKey: ['performanceHistory', user?.id],
    queryFn: () => user ? getPerformanceHistory(user.id) : [],
    enabled: !!user,
    staleTime: 30000
  });

  const { data: aiSummary, isLoading: aiSummaryLoading, refetch: refetchAiSummary } = useQuery({
    queryKey: ['aiRecommendations', user?.id],
    queryFn: () => user ? getAIRecommendations(user.id) : '',
    enabled: !!user,
    staleTime: 30000
  });

  const { data: recentQuizResults, isLoading: quizResultsLoading, refetch: refetchQuizResults } = useQuery({
    queryKey: ['quizResults', user?.id],
    queryFn: () => user ? getRecentQuizResults(user.id, 1) : [],
    enabled: !!user,
    staleTime: 30000
  });

  // Force refresh when the prop changes
  useEffect(() => {
    if (forceRefresh && user) {
      console.log('Forcing refresh of performance summary data');
      const refreshData = async () => {
        // Invalidate all caches first
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['userPerformance'] }),
          queryClient.invalidateQueries({ queryKey: ['performanceHistory'] }),
          queryClient.invalidateQueries({ queryKey: ['aiRecommendations'] }),
          queryClient.invalidateQueries({ queryKey: ['quizResults'] }),
        ]);

        // Trigger refetches
        await Promise.all([
          refetchPerformance(),
          refetchHistory(),
          refetchAiSummary(),
          refetchQuizResults()
        ]);
      };
      
      refreshData();
    }
  }, [forceRefresh, user, queryClient, refetchPerformance, refetchHistory, refetchAiSummary, refetchQuizResults]);
  
  const isLoading = performanceLoading || historyLoading || aiSummaryLoading || quizResultsLoading;
  const latestQuiz = recentQuizResults && recentQuizResults.length > 0 ? recentQuizResults[0] : null;

  // Process data whenever it changes
  useEffect(() => {
    if (performance) {
      setQuizzesTaken(performance.quizzesTaken);
      setAccuracy(performance.overallScore);
      
      if (performance.strongTopics) {
        setStrengthAreas(performance.strongTopics);
      }
      
      if (performance.weakTopics) {
        setImprovementAreas(performance.weakTopics);
      }
    }
  }, [performance]);

  // Process history data
  useEffect(() => {
    if (history && history.length > 0) {
      // Calculate average completion time
      const completionTimes = history
        .filter(item => item.completionTime)
        .map(item => item.completionTime);
        
      if (completionTimes.length > 0) {
        const avgTime = completionTimes.reduce((sum, time) => sum + (time || 0), 0) / completionTimes.length;
        setAvgCompletionTime(Math.round(avgTime));
      }
      
      // Get recent subjects
      const uniqueTopics = [...new Set(history.map(item => item.topic))];
      setRecentSubjects(uniqueTopics.slice(0, 3));
    }
  }, [history]);

  const formatTime = (seconds: number): string => {
    if (seconds === 0) return 'N/A';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes === 0) {
      return `${remainingSeconds} sec`;
    }
    
    return `${minutes} min ${remainingSeconds} sec`;
  };

  return (
    <Card className="bg-darkBlue-800 border-darkBlue-700">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Quizzes Taken */}
          <StatCard 
            icon={<CheckCircle className="h-5 w-5 text-green-400 mr-2" />}
            title="Quizzes Taken"
            value={quizzesTaken}
            loading={isLoading}
          />
          
          {/* Accuracy */}
          <StatCard 
            icon={<Award className="h-5 w-5 text-yellow-400 mr-2" />}
            title="Accuracy"
            value={`${accuracy}%`}
            loading={isLoading}
          />
          
          {/* Avg Completion Time */}
          <StatCard 
            icon={<Clock className="h-5 w-5 text-blue-400 mr-2" />}
            title="Avg. Completion Time"
            value={formatTime(avgCompletionTime)}
            loading={isLoading}
          />
          
          {/* Recent Subjects */}
          <div className="bg-darkBlue-700/50 rounded-xl p-4 flex flex-col">
            <div className="flex items-center mb-2">
              <LineChart className="h-5 w-5 text-purple-400 mr-2" />
              <span className="text-gray-300 text-sm">Recent Subjects</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-32 bg-darkBlue-600" />
            ) : (
              <div className="flex flex-wrap gap-1">
                {recentSubjects.length > 0 ? (
                  recentSubjects.map((subject, index) => (
                    <span key={index} className="text-xs bg-darkBlue-600 text-primary px-2 py-1 rounded-full">
                      {subject}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No recent subjects</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Latest Quiz Result */}
          <QuizResultSummary latestQuiz={latestQuiz} loading={isLoading} />
          
          {/* Performance Insights */}
          <div className="space-y-4">
            {/* Strengths */}
            <StrengthAreas areas={strengthAreas} loading={isLoading} />
            
            {/* Areas to Improve */}
            <ImprovementAreas areas={improvementAreas} loading={isLoading} />
          </div>
        </div>
        
        {/* AI Summary */}
        <AISummary summary={aiSummary || ''} loading={isLoading} forceRefresh={forceRefresh} />
      </CardContent>
    </Card>
  );
};

export default PerformanceSummary;
