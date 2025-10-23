import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Clock, Target, BookOpen, TrendingUp, Calendar } from 'lucide-react';
import { useSimpleDashboard } from '@/hooks/useSimpleDashboard';

const SimpleDashboard: React.FC = () => {
  const { stats, isLoading, error, formatTime, formatDate, refreshData } = useSimpleDashboard();

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="glass-card animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-white/10 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={refreshData} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Welcome Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/70">Track your learning progress and performance</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-medium">Total Quizzes</p>
                <p className="text-2xl font-bold text-white">{stats.totalQuizzes}</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-medium">Average Score</p>
                <p className="text-2xl font-bold text-white">{stats.averageScore}%</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-medium">Time Spent</p>
                <p className="text-2xl font-bold text-white">{formatTime(stats.totalTimeSpent)}</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-medium">Best Score</p>
                <p className="text-2xl font-bold text-white">
                  {stats.recentQuizzes.length > 0 
                    ? Math.max(...stats.recentQuizzes.map(q => q.score_percentage)) 
                    : 0}%
                </p>
              </div>
              <Trophy className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Quiz Results */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Recent Quizzes
            </CardTitle>
            <CardDescription className="text-white/60">
              Your latest quiz attempts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentQuizzes.length > 0 ? (
              <div className="space-y-3">
                {stats.recentQuizzes.map((quiz) => (
                  <div 
                    key={quiz.id} 
                    className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
                  >
                    <div>
                      <p className="text-white font-medium capitalize">
                        {quiz.topic_id.replace('-', ' ')}
                      </p>
                      <p className="text-white/60 text-sm">
                        {quiz.correct_answers}/{quiz.total_questions} correct • {formatDate(quiz.completed_at)}
                      </p>
                    </div>
                    <div className={`text-lg font-bold ${
                      quiz.score_percentage >= 70 ? 'text-green-400' : 'text-orange-400'
                    }`}>
                      {quiz.score_percentage}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/60">No quizzes completed yet</p>
                <Button 
                  onClick={() => window.location.href = '/topics'}
                  className="mt-4 bg-primary hover:bg-primary/90"
                >
                  Take Your First Quiz
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Topic Performance */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Topic Performance
            </CardTitle>
            <CardDescription className="text-white/60">
              Your performance by topic
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.topicPerformance.length > 0 ? (
              <div className="space-y-3">
                {stats.topicPerformance.map((topic) => (
                  <div 
                    key={topic.topic} 
                    className="p-3 bg-white/5 rounded-lg"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-white font-medium capitalize">
                        {topic.topic.replace('-', ' ')}
                      </h4>
                      <span className={`text-lg font-bold ${
                        topic.averageScore >= 70 ? 'text-green-400' : 'text-orange-400'
                      }`}>
                        {topic.averageScore}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-white/60">
                      <span>{topic.quizzesCompleted} quiz{topic.quizzesCompleted !== 1 ? 'es' : ''}</span>
                      <span>Last: {formatDate(topic.lastAttempt)}</span>
                    </div>
                    <div className="mt-2 w-full bg-white/10 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          topic.averageScore >= 70 ? 'bg-green-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${topic.averageScore}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/60">No topic data yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      {stats.totalQuizzes > 0 && (
        <div className="text-center">
          <Card className="glass-card inline-block">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Keep Learning!
              </h3>
              <p className="text-white/70 mb-4">
                Practice more to improve your scores
              </p>
              <Button 
                onClick={() => window.location.href = '/topics'}
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                Continue Learning
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SimpleDashboard;