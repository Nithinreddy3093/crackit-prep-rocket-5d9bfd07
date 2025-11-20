import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Target, TrendingUp, Clock } from 'lucide-react';
import { useSimpleDashboard } from '@/hooks/useSimpleDashboard';
import SkillRadarChart from './SkillRadarChart';
import PerformanceTrendChart from './PerformanceTrendChart';
import StudyHeatmap from './StudyHeatmap';
import StreakCounter from './StreakCounter';
import ContinueLearning from './ContinueLearning';

const SimpleDashboard: React.FC = () => {
  const { data, loading } = useSimpleDashboard();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Welcome Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Your Learning Dashboard</h1>
        <p className="text-muted-foreground">Track your progress and keep learning</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalQuizzes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.averageScore}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.bestScore}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(data.totalTime / 60)}h</div>
          </CardContent>
        </Card>
      </div>

      {/* Streak Counter */}
      <StreakCounter 
        currentStreak={data.currentStreak} 
        longestStreak={data.longestStreak} 
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SkillRadarChart data={data.skillData} />
        <PerformanceTrendChart data={data.performanceData} />
      </div>

      {/* Heatmap and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StudyHeatmap data={data.heatmapData} />
        <ContinueLearning recommendations={data.recommendations} />
      </div>

      {/* Recent Quizzes */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.recentQuizzes.map((quiz, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{quiz.topic}</p>
                  <p className="text-sm text-muted-foreground">{quiz.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{quiz.score}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleDashboard;
