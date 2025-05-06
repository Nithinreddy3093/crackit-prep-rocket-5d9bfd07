
import { useState } from 'react';

interface QuestionDetail {
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface QuizAnalytics {
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  accuracyPercentage: number;
  averageTimePerQuestion?: number;
  topicStrengths?: string[];
  topicWeaknesses?: string[];
}

export function useQuizAnalytics() {
  const [analytics, setAnalytics] = useState<QuizAnalytics>({
    correctCount: 0,
    incorrectCount: 0,
    skippedCount: 0,
    accuracyPercentage: 0,
  });

  /**
   * Calculate quiz analytics based on question details and scores
   */
  const calculateQuizAnalytics = (
    questionDetails: QuestionDetail[],
    correctAnswers: number,
    totalQuestions: number,
    elapsedTime?: number
  ): QuizAnalytics => {
    // Calculate stats from question details if available
    if (questionDetails && questionDetails.length > 0) {
      const correct = questionDetails.filter(q => q.isCorrect).length;
      const incorrect = questionDetails.filter(q => !q.isCorrect && q.userAnswer !== '').length;
      const skipped = questionDetails.filter(q => q.userAnswer === '').length;
      
      const analytics: QuizAnalytics = {
        correctCount: correct,
        incorrectCount: incorrect,
        skippedCount: skipped,
        accuracyPercentage: Math.round((correct / (totalQuestions || 1)) * 100),
      };
      
      // Calculate average time per question if time data is available
      if (elapsedTime) {
        analytics.averageTimePerQuestion = Math.round(elapsedTime / (totalQuestions || 1) / 1000);
      }
      
      setAnalytics(analytics);
      return analytics;
    } 
    
    // Fallback to simple calculations if detailed data isn't available
    const analytics: QuizAnalytics = {
      correctCount: correctAnswers,
      incorrectCount: totalQuestions - correctAnswers,
      skippedCount: 0,
      accuracyPercentage: Math.round((correctAnswers / (totalQuestions || 1)) * 100),
    };
    
    setAnalytics(analytics);
    return analytics;
  };

  return {
    analytics,
    calculateQuizAnalytics
  };
}
