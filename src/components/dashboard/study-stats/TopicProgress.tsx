
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { PerformanceStat } from '@/services/performance/types';
import { Skeleton } from '@/components/ui/skeleton';

interface TopicProgressProps {
  stats: PerformanceStat[];
  loading: boolean;
}

const TopicProgress: React.FC<TopicProgressProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No topic progress data available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {stats.map((stat, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">{stat.topic}</p>
              <p className="text-sm text-muted-foreground">
                {stat.quizzesTaken} quiz{stat.quizzesTaken !== 1 ? "zes" : ""} taken
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${
                stat.averageScore >= 75 ? 'text-green-500' : 
                stat.averageScore >= 60 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {stat.averageScore}%
              </span>
              {stat.averageScore >= 70 ? (
                <ArrowUp className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
          <Progress value={stat.progress} className="h-2" />
        </div>
      ))}
    </div>
  );
};

export default TopicProgress;
