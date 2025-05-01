
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, CheckCircle, LineChart, Award } from 'lucide-react';
import { getUserPerformance, getPerformanceHistory, getAIRecommendations } from '@/services/supabasePerformanceService';
import { Skeleton } from '@/components/ui/skeleton';

const PerformanceSummary: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [quizzesTaken, setQuizzesTaken] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [avgCompletionTime, setAvgCompletionTime] = useState(0);
  const [aiSummary, setAiSummary] = useState('');
  const [recentSubjects, setRecentSubjects] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (user) {
          // Get performance data
          const performance = await getUserPerformance(user.id);
          if (performance) {
            setQuizzesTaken(performance.quizzesTaken);
            setAccuracy(performance.overallScore);
          }
          
          // Get performance history for completion times
          const history = await getPerformanceHistory(user.id);
          
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
          
          // Get AI summary
          const summary = await getAIRecommendations(user.id);
          setAiSummary(summary);
        }
      } catch (error) {
        console.error('Error fetching performance summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

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
          <div className="bg-darkBlue-700/50 rounded-xl p-4 flex flex-col">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-gray-300 text-sm">Quizzes Taken</span>
            </div>
            {loading ? (
              <Skeleton className="h-8 w-16 bg-darkBlue-600" />
            ) : (
              <span className="text-2xl font-bold text-white">{quizzesTaken}</span>
            )}
          </div>
          
          {/* Accuracy */}
          <div className="bg-darkBlue-700/50 rounded-xl p-4 flex flex-col">
            <div className="flex items-center mb-2">
              <Award className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="text-gray-300 text-sm">Accuracy</span>
            </div>
            {loading ? (
              <Skeleton className="h-8 w-16 bg-darkBlue-600" />
            ) : (
              <span className="text-2xl font-bold text-white">{accuracy}%</span>
            )}
          </div>
          
          {/* Avg Completion Time */}
          <div className="bg-darkBlue-700/50 rounded-xl p-4 flex flex-col">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-gray-300 text-sm">Avg. Completion Time</span>
            </div>
            {loading ? (
              <Skeleton className="h-8 w-24 bg-darkBlue-600" />
            ) : (
              <span className="text-2xl font-bold text-white">{formatTime(avgCompletionTime)}</span>
            )}
          </div>
          
          {/* Recent Subjects */}
          <div className="bg-darkBlue-700/50 rounded-xl p-4 flex flex-col">
            <div className="flex items-center mb-2">
              <LineChart className="h-5 w-5 text-purple-400 mr-2" />
              <span className="text-gray-300 text-sm">Recent Subjects</span>
            </div>
            {loading ? (
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
        
        {/* AI Summary */}
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
            <p className="text-white/80 text-sm">{aiSummary}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceSummary;
