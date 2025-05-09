
import React from 'react';
import { Clock, CheckCircle, AlertTriangle, Check, X, HelpCircle } from 'lucide-react';
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
    total_questions, 
    correct_answers, 
    incorrect_answers, 
    skipped_questions, 
    completion_time, 
    submitted_at 
  } = latestQuiz;

  const submittedDate = submitted_at 
    ? new Date(submitted_at).toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }) 
    : 'Recently';

  return (
    <Card className="bg-darkBlue-800 border-darkBlue-700">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white">Latest Quiz Result</CardTitle>
          <span className="text-xs text-gray-400">{submittedDate}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-md font-medium text-white">{topic}</h3>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-400">Score</span>
            <span className="font-medium text-white">{score}%</span>
          </div>
          <Progress
            value={score}
            className="h-2 bg-darkBlue-700"
          />
        </div>
        
        <div className="mb-4 p-3 bg-darkBlue-700/50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-sm text-gray-300">Completion Time</span>
            </div>
            <span className="text-sm text-gray-300">{formatTime(completion_time)}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center p-2 bg-darkBlue-700 rounded-lg">
              <div className="flex items-center text-green-500 mb-1">
                <Check className="h-3 w-3 mr-1" />
                <span className="text-xs">Correct</span>
              </div>
              <span className="font-bold text-white">{correct_answers}</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-darkBlue-700 rounded-lg">
              <div className="flex items-center text-red-500 mb-1">
                <X className="h-3 w-3 mr-1" />
                <span className="text-xs">Incorrect</span>
              </div>
              <span className="font-bold text-white">{incorrect_answers}</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-darkBlue-700 rounded-lg">
              <div className="flex items-center text-gray-500 mb-1">
                <HelpCircle className="h-3 w-3 mr-1" />
                <span className="text-xs">Skipped</span>
              </div>
              <span className="font-bold text-white">{skipped_questions}</span>
            </div>
          </div>
        </div>
        
        <div className={`py-3 px-4 rounded-lg text-sm border ${
          score >= 70 
            ? 'bg-green-500/10 border-green-500/30 text-green-400' 
            : score >= 40 
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {score >= 70 ? (
            <div className="flex items-start">
              <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>Great job! You have a strong understanding of this topic.</span>
            </div>
          ) : score >= 40 ? (
            <div className="flex items-start">
              <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>You're making progress. Keep practicing to improve your score.</span>
            </div>
          ) : (
            <div className="flex items-start">
              <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>This topic needs attention. Review the material and try again.</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizResultSummary;
