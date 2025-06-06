
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Undo2,
  Send,
  Loader2
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from "@/components/ui/use-toast";

interface QuestionDetail {
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent?: number; // Time spent on this specific question in seconds
}

interface QuizResultsProps {
  correctAnswers: number;
  totalQuestions: number;
  elapsedTime: number;
  topicTitle?: string;
  formatTime: (ms: number) => string;
  onRestart: () => void;
  onSubmit: () => Promise<any>;
  questionDetails?: QuestionDetail[];
}

const QuizResults: React.FC<QuizResultsProps> = ({
  correctAnswers,
  totalQuestions,
  elapsedTime,
  topicTitle = "Quiz",
  formatTime,
  onRestart,
  onSubmit,
  questionDetails = []
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Calculate accurate metrics from question details
  const analytics = useMemo(() => {
    if (questionDetails.length > 0) {
      const answeredQuestions = questionDetails.filter(q => q.userAnswer !== '');
      const correctCount = questionDetails.filter(q => q.isCorrect).length;
      const incorrectCount = questionDetails.filter(q => !q.isCorrect && q.userAnswer !== '').length;
      const skippedCount = questionDetails.filter(q => q.userAnswer === '').length;
      
      return {
        totalQuestions: questionDetails.length,
        answeredQuestions: answeredQuestions.length,
        correctCount,
        incorrectCount, 
        skippedCount,
        accuracyPercentage: answeredQuestions.length > 0 ? Math.round((correctCount / answeredQuestions.length) * 100) : 0,
        overallScore: Math.round((correctCount / questionDetails.length) * 100)
      };
    }
    
    // Fallback to basic calculations
    return {
      totalQuestions,
      answeredQuestions: totalQuestions,
      correctCount: correctAnswers,
      incorrectCount: totalQuestions - correctAnswers,
      skippedCount: 0,
      accuracyPercentage: Math.round((correctAnswers / totalQuestions) * 100),
      overallScore: Math.round((correctAnswers / totalQuestions) * 100)
    };
  }, [questionDetails, correctAnswers, totalQuestions]);

  // Calculate time metrics
  const timeMetrics = useMemo(() => {
    const totalTimeSeconds = Math.floor(elapsedTime / 1000);
    const averageTimePerQuestion = Math.floor(totalTimeSeconds / analytics.totalQuestions);
    const timeEfficiency = averageTimePerQuestion <= 30 ? 'Fast' : averageTimePerQuestion <= 60 ? 'Average' : 'Slow';
    
    return {
      totalTimeSeconds,
      averageTimePerQuestion,
      timeEfficiency,
      timePerQuestionBar: Math.min((averageTimePerQuestion / 90) * 100, 100) // Cap at 90 seconds for bar
    };
  }, [elapsedTime, analytics.totalQuestions]);

  // Performance feedback based on actual results
  const performanceFeedback = useMemo(() => {
    const { overallScore, accuracyPercentage, skippedCount } = analytics;
    
    if (overallScore >= 90) return {
      message: 'Outstanding! You have mastered this topic.',
      color: 'text-green-400',
      bgColor: 'bg-green-500'
    };
    if (overallScore >= 80) return {
      message: 'Excellent work! You have a strong understanding.',
      color: 'text-green-400', 
      bgColor: 'bg-green-500'
    };
    if (overallScore >= 70) return {
      message: 'Good job! You understand most concepts well.',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500'
    };
    if (overallScore >= 60) return {
      message: 'Fair performance. Some concepts need review.',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500'
    };
    if (skippedCount > analytics.totalQuestions * 0.3) return {
      message: 'Many questions were skipped. Consider reviewing the material.',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500'
    };
    return {
      message: 'Keep studying! This topic needs more attention.',
      color: 'text-red-400',
      bgColor: 'bg-red-500'
    };
  }, [analytics]);
  
  // Save quiz results
  useEffect(() => {
    const quizResultsData = {
      correctAnswers,
      totalQuestions,
      elapsedTime,
      topicTitle,
      timestamp: new Date().toISOString(),
      questionDetails,
      analytics,
      timeMetrics
    };
    
    try {
      localStorage.setItem('lastQuizResults', JSON.stringify(quizResultsData));
    } catch (error) {
      console.error('Error saving quiz results:', error);
    }
  }, [correctAnswers, totalQuestions, elapsedTime, topicTitle, questionDetails, analytics, timeMetrics]);
  
  // Check submission status
  useEffect(() => {
    const submitStatus = localStorage.getItem(`quiz_submitted_${topicTitle}`);
    if (submitStatus === 'true') {
      setIsSubmitted(true);
    }
  }, [topicTitle]);
  
  const handleSubmit = useCallback(async () => {
    if (isSubmitting || isSubmitted) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      await onSubmit();
      setIsSubmitted(true);
      localStorage.setItem(`quiz_submitted_${topicTitle}`, 'true');
      localStorage.removeItem('lastQuizResults');
    } catch (error: any) {
      console.error('Error submitting quiz:', error);
      setSubmitError(error.message || 'Failed to submit quiz. Please try again.');
      toast({
        title: "Error submitting quiz",
        description: error.message || "Failed to submit the quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, isSubmitted, onSubmit, topicTitle]);

  return (
    <div className="glass-card p-6 space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-1">{topicTitle} Quiz Completed!</h2>
        <p className="text-white/70">Here's your detailed performance analysis:</p>
        
        {isSubmitted && (
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
            <CheckCircle className="w-3 h-3 mr-1" /> Results saved to your profile
          </div>
        )}
        
        {submitError && (
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm">
            <XCircle className="w-3 h-3 mr-1" /> {submitError}
          </div>
        )}
      </div>
      
      {/* Main Score Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-darkBlue-800/50 p-5 rounded-xl text-center">
          <div className="text-4xl font-bold text-primary mb-2">{analytics.correctCount}/{analytics.totalQuestions}</div>
          <div className="text-lg text-white/80">Questions Correct</div>
        </div>
        
        <div className="bg-darkBlue-800/50 p-5 rounded-xl text-center">
          <div className="text-4xl font-bold text-primary mb-2">{analytics.overallScore}%</div>
          <div className="text-lg text-white/80">Overall Score</div>
        </div>
        
        <div className="bg-darkBlue-800/50 p-5 rounded-xl text-center">
          <div className="text-4xl font-bold text-primary mb-2">{formatTime(elapsedTime)}</div>
          <div className="text-lg text-white/80">Total Time</div>
        </div>
      </div>
      
      {/* Detailed Answer Breakdown */}
      <div className="bg-darkBlue-800/30 p-4 rounded-xl">
        <h3 className="text-lg font-medium text-white mb-3">Answer Breakdown</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
            <div className="text-xl font-bold text-green-400">{analytics.correctCount}</div>
            <div className="text-xs text-white/70">Correct ({Math.round((analytics.correctCount / analytics.totalQuestions) * 100)}%)</div>
          </div>
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
            <div className="text-xl font-bold text-red-400">{analytics.incorrectCount}</div>
            <div className="text-xs text-white/70">Incorrect ({Math.round((analytics.incorrectCount / analytics.totalQuestions) * 100)}%)</div>
          </div>
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-center">
            <div className="text-xl font-bold text-yellow-400">{analytics.skippedCount}</div>
            <div className="text-xs text-white/70">Skipped ({Math.round((analytics.skippedCount / analytics.totalQuestions) * 100)}%)</div>
          </div>
        </div>
      </div>
      
      {/* Performance Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Time Analysis */}
        <div className="bg-darkBlue-800/30 p-4 rounded-xl">
          <div className="flex items-center mb-3">
            <Clock className="w-5 h-5 text-primary mr-2" />
            <h3 className="text-lg font-medium text-white">Time Analysis</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Average per question:</span>
              <span className="text-white font-medium">{timeMetrics.averageTimePerQuestion}s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Time efficiency:</span>
              <span className={`font-medium ${
                timeMetrics.timeEfficiency === 'Fast' ? 'text-green-400' :
                timeMetrics.timeEfficiency === 'Average' ? 'text-yellow-400' : 'text-red-400'
              }`}>{timeMetrics.timeEfficiency}</span>
            </div>
            <div className="h-2 bg-darkBlue-900/50 rounded-full">
              <div 
                className={`h-2 rounded-full ${
                  timeMetrics.timeEfficiency === 'Fast' ? 'bg-green-500' :
                  timeMetrics.timeEfficiency === 'Average' ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${timeMetrics.timePerQuestionBar}%` }}  
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-white/60">
              <span>Fast (&lt;30s)</span>
              <span>Average (30-60s)</span>
              <span>Slow (&gt;60s)</span>
            </div>
          </div>
        </div>
        
        {/* Accuracy Analysis */}
        <div className="bg-darkBlue-800/30 p-4 rounded-xl">
          <div className="flex items-center mb-3">
            <CheckCircle className="w-5 h-5 text-primary mr-2" />
            <h3 className="text-lg font-medium text-white">Accuracy Analysis</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Questions attempted:</span>
              <span className="text-white font-medium">{analytics.answeredQuestions}/{analytics.totalQuestions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Accuracy rate:</span>
              <span className="text-white font-medium">{analytics.accuracyPercentage}%</span>
            </div>
            <div className="h-2 bg-darkBlue-900/50 rounded-full">
              <div 
                className={`h-2 rounded-full ${performanceFeedback.bgColor}`}
                style={{ width: `${analytics.accuracyPercentage}%` }}  
              ></div>
            </div>
            <p className={`text-sm ${performanceFeedback.color}`}>
              {performanceFeedback.message}
            </p>
          </div>
        </div>
      </div>
      
      {/* Detailed Question Review */}
      {questionDetails && questionDetails.length > 0 && (
        <div className="bg-darkBlue-800/20 p-4 rounded-xl">
          <h3 className="text-lg font-medium text-white mb-3">Question Review</h3>
          <Accordion type="single" collapsible className="text-white">
            {questionDetails.map((detail, index) => (
              <AccordionItem key={`question-${detail.questionId}-${index}`} value={`question-${index}`}>
                <AccordionTrigger className="py-3 hover:bg-darkBlue-800/30 px-3 rounded-md">
                  <div className="flex items-center text-left w-full">
                    <div className="mr-3">
                      {detail.isCorrect ? 
                        <CheckCircle className="h-5 w-5 text-green-400" /> : 
                        detail.userAnswer === '' ?
                        <div className="h-5 w-5 rounded-full bg-yellow-500" /> :
                        <XCircle className="h-5 w-5 text-red-400" />
                      }
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium">Question {index + 1}</div>
                      <div className="text-sm text-white/70 line-clamp-1">{detail.question}</div>
                    </div>
                    <div className="text-right text-sm text-white/60 ml-2">
                      {detail.isCorrect ? 'Correct' : detail.userAnswer === '' ? 'Skipped' : 'Incorrect'}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-4 pt-1">
                  <div className="space-y-2 text-sm text-white/80">
                    <div className="p-3 bg-darkBlue-900/30 rounded">
                      <span className="font-semibold text-white/90">Question: </span>
                      <span>{detail.question}</span>
                    </div>
                    
                    <div>
                      <span className="font-semibold text-white/90">Your answer: </span> 
                      <span className={`ml-1 ${
                        detail.userAnswer === '' ? 'text-yellow-400' :
                        detail.isCorrect ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {detail.userAnswer || 'Not answered'}
                      </span>
                    </div>
                    
                    {!detail.isCorrect && detail.userAnswer !== '' && (
                      <div>
                        <span className="font-semibold text-white/90">Correct answer: </span> 
                        <span className="ml-1 text-green-400">{detail.correctAnswer}</span>
                      </div>
                    )}
                    
                    {detail.timeSpent && (
                      <div>
                        <span className="font-semibold text-white/90">Time spent: </span>
                        <span className="ml-1 text-blue-400">{detail.timeSpent}s</span>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
        <Button 
          onClick={onRestart}
          variant="outline" 
          className="border-white/20 text-white hover:bg-white/10"
        >
          <Undo2 className="mr-2 h-4 w-4" />
          Try Another Quiz
        </Button>
        
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting || isSubmitted}
          className="bg-primary hover:bg-primary/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : isSubmitted ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Results Saved
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Submit Results
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default React.memo(QuizResults);
