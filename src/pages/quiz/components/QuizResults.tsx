
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Undo2,
  Send
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface QuestionDetail {
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface QuizResultsProps {
  correctAnswers: number;
  totalQuestions: number;
  elapsedTime: number;
  topicTitle?: string;
  formatTime: (ms: number) => string;
  onRestart: () => void;
  onSubmit: () => void;
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
  
  // Memoize calculations to prevent recalculations on each render
  const percentage = useMemo(() => 
    Math.round((correctAnswers / totalQuestions) * 100),
    [correctAnswers, totalQuestions]
  );
  
  const averageTimePerQuestion = useMemo(() => 
    Math.round(elapsedTime / totalQuestions / 1000),
    [elapsedTime, totalQuestions]
  );
  
  // Quiz analytics calculated from question details
  const analytics = useMemo(() => {
    if (questionDetails.length > 0) {
      const correct = questionDetails.filter(q => q.isCorrect).length;
      const incorrect = questionDetails.filter(q => !q.isCorrect && q.userAnswer !== '').length;
      const skipped = questionDetails.filter(q => q.userAnswer === '').length;
      
      return {
        correctCount: correct,
        incorrectCount: incorrect,
        skippedCount: skipped,
        accuracyPercentage: Math.round((correct / (correct + incorrect || 1)) * 100),
      };
    } 
    
    return {
      correctCount: correctAnswers,
      incorrectCount: totalQuestions - correctAnswers,
      skippedCount: 0,
      accuracyPercentage: percentage,
    };
  }, [questionDetails, correctAnswers, totalQuestions, percentage]);
  
  // Save quiz results to local storage for persistence
  useEffect(() => {
    const quizResultsData = {
      correctAnswers,
      totalQuestions,
      elapsedTime,
      topicTitle,
      timestamp: new Date().toISOString(),
      questionDetails,
      analytics,
    };
    
    // Store in localStorage to persist across navigation/refresh
    localStorage.setItem('lastQuizResults', JSON.stringify(quizResultsData));
  }, [correctAnswers, totalQuestions, elapsedTime, topicTitle, questionDetails, analytics]);
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
      setIsSubmitted(true);
      // Clear from localStorage after successful submission
      localStorage.removeItem('lastQuizResults');
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Memoize performance feedback text
  const performanceFeedback = useMemo(() => {
    if (percentage >= 80) return 'Excellent! Your knowledge is solid.';
    if (percentage >= 60) return 'Good job! You\'ve got most concepts right.';
    return 'You might need to review this topic more.';
  }, [percentage]);
  
  // Memoize performance UI elements
  const performanceBarColor = useMemo(() => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  }, [percentage]);
  
  return (
    <div className="glass-card p-6 space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-1">{topicTitle} Quiz Completed!</h2>
        <p className="text-white/70">Here's how you did:</p>
        
        {isSubmitted && (
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
            <CheckCircle className="w-3 h-3 mr-1" /> Results saved to your profile
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Score */}
        <div className="bg-darkBlue-800/50 p-5 rounded-xl text-center">
          <div className="text-4xl font-bold text-primary mb-2">{correctAnswers}/{totalQuestions}</div>
          <div className="text-lg text-white/80">Questions</div>
        </div>
        
        {/* Percentage */}
        <div className="bg-darkBlue-800/50 p-5 rounded-xl text-center">
          <div className="text-4xl font-bold text-primary mb-2">{percentage}%</div>
          <div className="text-lg text-white/80">Score</div>
        </div>
        
        {/* Time */}
        <div className="bg-darkBlue-800/50 p-5 rounded-xl text-center">
          <div className="text-4xl font-bold text-primary mb-2">{formatTime(elapsedTime)}</div>
          <div className="text-lg text-white/80">Time Taken</div>
        </div>
      </div>
      
      {/* Answers breakdown */}
      <div className="bg-darkBlue-800/30 p-4 rounded-xl">
        <h3 className="text-lg font-medium text-white mb-3">Answer Breakdown</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
            <div className="text-xl font-bold text-green-400">{analytics.correctCount}</div>
            <div className="text-xs text-white/70">Correct</div>
          </div>
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
            <div className="text-xl font-bold text-red-400">{analytics.incorrectCount}</div>
            <div className="text-xs text-white/70">Incorrect</div>
          </div>
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-center">
            <div className="text-xl font-bold text-yellow-400">{analytics.skippedCount}</div>
            <div className="text-xs text-white/70">Skipped</div>
          </div>
        </div>
      </div>
      
      {/* Performance metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-darkBlue-800/30 p-4 rounded-xl">
          <div className="flex items-center mb-3">
            <Clock className="w-5 h-5 text-primary mr-2" />
            <h3 className="text-lg font-medium text-white">Time Analysis</h3>
          </div>
          <p className="text-white/70 text-sm mb-2">
            You spent an average of {averageTimePerQuestion} seconds per question.
          </p>
          <div className="h-2 bg-darkBlue-900/50 rounded-full">
            <div 
              className="h-2 bg-primary rounded-full"
              style={{ width: `${Math.min((averageTimePerQuestion / 40) * 100, 100)}%` }}  
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-white/60">
            <span>Fast (10s)</span>
            <span>Average (20s)</span>
            <span>Slow (40s+)</span>
          </div>
        </div>
        
        <div className="bg-darkBlue-800/30 p-4 rounded-xl">
          <div className="flex items-center mb-3">
            <CheckCircle className="w-5 h-5 text-primary mr-2" />
            <h3 className="text-lg font-medium text-white">Accuracy</h3>
          </div>
          <p className="text-white/70 text-sm mb-2">
            {performanceFeedback}
          </p>
          <div className="h-2 bg-darkBlue-900/50 rounded-full">
            <div 
              className={`h-2 rounded-full ${performanceBarColor}`}
              style={{ width: `${percentage}%` }}  
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-white/60">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
      
      {/* Question review - using virtualization for better performance */}
      {questionDetails && questionDetails.length > 0 && (
        <div className="bg-darkBlue-800/20 p-4 rounded-xl">
          <h3 className="text-lg font-medium text-white mb-3">Question Review</h3>
          <Accordion type="single" collapsible className="text-white">
            {questionDetails.slice(0, 15).map((detail, index) => (
              <AccordionItem key={`question-${detail.questionId}-${index}`} value={`question-${index}`}>
                <AccordionTrigger className="py-3 hover:bg-darkBlue-800/30 px-3 rounded-md">
                  <div className="flex items-center text-left">
                    <div className="mr-3">
                      {detail.isCorrect ? 
                        <CheckCircle className="h-5 w-5 text-green-400" /> : 
                        <XCircle className="h-5 w-5 text-red-400" />
                      }
                    </div>
                    <div className="flex-grow">
                      <div className="line-clamp-1">{detail.question}</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-4 pt-1">
                  <div className="space-y-2 text-sm text-white/80">
                    <div>
                      <span className="font-semibold text-white/90">Your answer:</span> 
                      <span className={`ml-2 ${detail.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                        {detail.userAnswer || 'Skipped'}
                      </span>
                    </div>
                    
                    {!detail.isCorrect && (
                      <div>
                        <span className="font-semibold text-white/90">Correct answer:</span> 
                        <span className="ml-2 text-green-400">{detail.correctAnswer}</span>
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
            <>Processing...</>
          ) : isSubmitted ? (
            <>Results Saved</>
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
