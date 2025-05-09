
import React, { useEffect, useState } from 'react';
import { BarChart2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { getUserPerformance, getPerformanceHistory } from '@/services/performance';
import { PerformanceStat } from '@/services/performance/types';
import { useQueryClient } from '@tanstack/react-query';

// Import sub-components
import TopicProgress from './study-stats/TopicProgress';
import PerformanceChart from './study-stats/PerformanceChart';
import TopicComparison from './study-stats/TopicComparison';
import OverallScoreDisplay from './study-stats/OverallScoreDisplay';
import SectionHeader from './study-stats/SectionHeader';

interface StudyStatsProps {
  performanceStats?: PerformanceStat[];
  forceRefresh?: boolean;
}

const StudyStats: React.FC<StudyStatsProps> = ({ performanceStats: propStats, forceRefresh }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PerformanceStat[]>([]);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (user) {
          // If forceRefresh is true, invalidate the cache first
          if (forceRefresh) {
            await queryClient.invalidateQueries({ queryKey: ['userPerformance'] });
            await queryClient.invalidateQueries({ queryKey: ['performanceHistory'] });
          }

          if (propStats) {
            setStats(propStats);
          } else {
            const performance = await getUserPerformance(user.id);
            if (performance) {
              setOverallScore(performance.overallScore);
              
              const fetchedStats = Object.entries(performance.topicScores).map(([topic, score]) => ({
                topic,
                progress: score,
                quizzesTaken: performance.quizzesTaken,
                averageScore: score
              }));
              setStats(fetchedStats);
            }
          }
          
          const history = await getPerformanceHistory(user.id);
          
          const historyByTopic: Record<string, any[]> = {};
          history.forEach(item => {
            if (!historyByTopic[item.topic]) {
              historyByTopic[item.topic] = [];
            }
            historyByTopic[item.topic].push({
              date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              score: item.score
            });
          });
          
          const transformedData = Object.entries(historyByTopic).map(([topic, data]) => {
            data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            return {
              topic,
              data
            };
          });
          
          setHistoryData(transformedData);
        }
      } catch (error) {
        console.error('Error fetching study stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, propStats, forceRefresh, queryClient]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Study Progress</CardTitle>
          <CardDescription>Your performance across different subjects</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
            <p className="text-muted-foreground">Loading your stats...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Study Progress</CardTitle>
          <CardDescription>Your performance across different subjects</CardDescription>
        </div>
        <OverallScoreDisplay overallScore={overallScore} />
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-6">
          <TopicProgress stats={stats} loading={false} />
        </div>

        {historyData.length > 0 && (
          <div className="pt-4">
            <SectionHeader 
              icon={<BarChart2 className="h-5 w-5 text-primary mr-2" />} 
              title="Performance Trends" 
            />
            <PerformanceChart historyData={historyData} loading={false} />
          </div>
        )}
        
        <div className="pt-4">
          <SectionHeader 
            icon={<BarChart2 className="h-5 w-5 text-primary mr-2" />} 
            title="Topic Comparison" 
          />
          <TopicComparison stats={stats} loading={false} />
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyStats;
