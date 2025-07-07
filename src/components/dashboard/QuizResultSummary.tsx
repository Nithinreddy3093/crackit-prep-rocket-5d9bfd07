
import React from 'react';
import { Clock, CheckCircle, AlertTriangle, Check, X, HelpCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { QuizResult } from '@/services/performance/quizResultsService';
import { Skeleton } from '@/components/ui/skeleton';

interface QuizResultSummaryProps {
  latestQuiz?: QuizResult | null;
  loading: boolean;
}

const QuizResultSummary: React.FC<QuizResultSummaryProps> = ({ latestQuiz, loading }) => {
  // Format time from seconds to minutes and seconds
  const formatTime = (seconds: number): string => {
    if (!seconds) return '0s';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes === 0) {
      return `${remainingSeconds}s`;
    }
    
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Calculate performance metrics from question details if available
  const calculateDetailedMetrics = (quiz: QuizResult) => {
    if (quiz.question_details && Array.isArray(quiz.question_details)) {
      const details = quiz.question_details as any[];
      const answeredQuestions = details.filter(q => q.userAnswer && q.userAnswer !== '');
      const correctAnswers = details.filter(q => q.isCorrect === true).length;
      const incorrectAnswers = details.filter(q => q.isCorrect === false && q.userAnswer && q.userAnswer !== '').length;
      const skippedQuestions = details.filter(q => !q.userAnswer || q.userAnswer === '').length;
      
      const accuracyRate = answeredQuestions.length > 0 ? Math.round((correctAnswers / answeredQuestions.length) * 100) : 0;
      const completionRate = Math.round((answeredQuestions.length / details.length) * 100);
      
      return {
        totalQuestions: details.length,
        correctAnswers,
        incorrectAnswers,
        skippedQuestions,
        answeredQuestions: answeredQuestions.length,
        accuracyRate,
        completionRate,
        hasDetailedData: true
      };
    }
    
    // Fallback to basic data - estimate from score
    const estimatedTotal = 10; // Default assumption
    const estimatedCorrect = Math.round((quiz.score / 100) * estimatedTotal);
    
    return {
      totalQuestions: estimatedTotal,
      correctAnswers: estimatedCorrect,
      incorrectAnswers: estimatedTotal - estimatedCorrect,
      skippedQuestions: 0,
      answeredQuestions: estimatedTotal,
      accuracyRate: quiz.score,
      completionRate: 100,
      hasDetailedData: false
    };
  };

  if (loading) {
    return (
      <Card className="bg-darkBlue-800 border-darkBlue-700">
        <CardHeader>
          <CardTitle className="text-lg text-white">Latest Quiz Result</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full bg-darkBlue-700" />
            <Skeleton className="h-12 w-full bg-darkBlue-700" />
            <Skeleton className="h-4 w-full bg-darkBlue-700" />
            <Skeleton className="h-20 w-full bg-darkBlue-700" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!latestQuiz) {
    return (
      <Card className="bg-darkBlue-800 border-darkBlue-700">
        <CardHeader>
          <CardTitle className="text-lg text-white">Latest Quiz Result</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            <p className="text-gray-400 text-center">
              No quiz results yet. Take your first quiz to see your performance!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { 
    topic, 
    score, 
    completion_time, 
    date 
  } = latestQuiz;

  const metrics = calculateDetailedMetrics(latestQuiz);
  const submittedDate = date 
    ? new Date(date).toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }) 
    : 'Recently';

  // Calculate average time per question
  const averageTimePerQuestion = completion_time && metrics.totalQuestions > 0 
    ? Math.round(completion_time / metrics.totalQuestions) 
    : 0;

  // Determine time efficiency
  const timeEfficiency = averageTimePerQuestion <= 30 ? 'Fast' : 
                        averageTimePerQuestion <= 60 ? 'Average' : 'Slow';

  const timeEfficiencyColor = timeEfficiency === 'Fast' ? 'text-green-400' :
                             timeEfficiency === 'Average' ? 'text-yellow-400' : 'text-red-400';

  return (
    <Card className="bg-darkBlue-800 border-darkBlue-700">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white">Latest Quiz Result</CardTitle>
          <div className="flex items-center gap-2">
            {metrics.hasDetailedData && (
              <div className="text-xs text-green-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Detailed
              </div>
            )}
            <span className="text-xs text-gray-400">{submittedDate}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-md font-medium text-white">{topic}</h3>
        </div>
        
        {/* Score and Accuracy Display */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-400">Overall Score</span>
              <span className="font-medium text-white">{score}%</span>
            </div>
            <Progress
              value={score}
              className="h-2 bg-darkBlue-700"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-400">Accuracy Rate</span>
              <span className="font-medium text-white">{metrics.accuracyRate}%</span>
            </div>
            <Progress
              value={metrics.accuracyRate}
              className="h-2 bg-darkBlue-700"
            />
          </div>
        </div>
        
        {/* Performance Stats */}
        <div className="mb-4 p-3 bg-darkBlue-700/50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-blue-400 mr-2" />
                <span className="text-sm text-gray-300">Total Time</span>
              </div>
              <span className="text-sm text-gray-300">{formatTime(completion_time)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Avg/Question</span>
              <span className={`text-sm ${timeEfficiencyColor}`}>
                {averageTimePerQuestion}s ({timeEfficiency})
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center p-2 bg-darkBlue-700 rounded-lg">
              <div className="flex items-center text-green-500 mb-1">
                <Check className="h-3 w-3 mr-1" />
                <span className="text-xs">Correct</span>
              </div>
              <span className="font-bold text-white">{metrics.correctAnswers}</span>
              <span className="text-xs text-gray-400">
                {Math.round((metrics.correctAnswers / metrics.totalQuestions) * 100)}%
              </span>
            </div>
            <div className="flex flex-col items-center p-2 bg-darkBlue-700 rounded-lg">
              <div className="flex items-center text-red-500 mb-1">
                <X className="h-3 w-3 mr-1" />
                <span className="text-xs">Incorrect</span>
              </div>
              <span className="font-bold text-white">{metrics.incorrectAnswers}</span>
              <span className="text-xs text-gray-400">
                {Math.round((metrics.incorrectAnswers / metrics.totalQuestions) * 100)}%
              </span>
            </div>
            <div className="flex flex-col items-center p-2 bg-darkBlue-700 rounded-lg">
              <div className="flex items-center text-gray-500 mb-1">
                <HelpCircle className="h-3 w-3 mr-1" />
                <span className="text-xs">Skipped</span>
              </div>
              <span className="font-bold text-white">{metrics.skippedQuestions}</span>
              <span className="text-xs text-gray-400">
                {Math.round((metrics.skippedQuestions / metrics.totalQuestions) * 100)}%
              </span>
            </div>
          </div>
        </div>
        
        {/* Performance Feedback */}
        <div className={`py-3 px-4 rounded-lg text-sm border ${
          score >= 80 
            ? 'bg-green-500/10 border-green-500/30 text-green-400' 
            : score >= 60 
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {score >= 80 ? (
            <div className="flex items-start">
              <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Excellent Performance!</span>
                <div className="text-xs mt-1 opacity-90">
                  Strong understanding with {metrics.accuracyRate}% accuracy on attempted questions.
                </div>
              </div>
            </div>
          ) : score >= 60 ? (
            <div className="flex items-start">
              <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Good Progress!</span>
                <div className="text-xs mt-1 opacity-90">
                  Keep practicing to improve accuracy. {metrics.skippedQuestions > 0 && `Consider attempting all ${metrics.totalQuestions} questions.`}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start">
              <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Needs Attention</span>
                <div className="text-xs mt-1 opacity-90">
                  Focus on core concepts. {timeEfficiency === 'Slow' ? 'Also practice for better speed.' : 'Review fundamentals thoroughly.'}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizResultSummary;
