
import { useState } from 'react';

interface QuestionDetail {
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent?: number;
}

interface QuizAnalytics {
  totalQuestions: number;
  attemptedQuestions: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  accuracyPercentage: number;
  overallScorePercentage: number;
  averageTimePerQuestion?: number;
  fastQuestions?: number;
  slowQuestions?: number;
  topicStrengths?: string[];
  topicWeaknesses?: string[];
  timeEfficiency: 'Fast' | 'Average' | 'Slow';
  performanceLevel: 'Outstanding' | 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement';
}

export function useQuizAnalytics() {
  const [analytics, setAnalytics] = useState<QuizAnalytics>({
    totalQuestions: 0,
    attemptedQuestions: 0,
    correctCount: 0,
    incorrectCount: 0,
    skippedCount: 0,
    accuracyPercentage: 0,
    overallScorePercentage: 0,
    timeEfficiency: 'Average',
    performanceLevel: 'Needs Improvement'
  });

  /**
   * Calculate comprehensive quiz analytics from question details with accurate evaluation
   */
  const calculateQuizAnalytics = (
    questionDetails: QuestionDetail[],
    totalQuestions: number,
    elapsedTime?: number
  ): QuizAnalytics => {
    console.log('=== QUIZ ANALYTICS CALCULATION START ===');
    console.log('Input data:', {
      questionDetailsCount: questionDetails.length,
      totalQuestions,
      elapsedTime
    });

    if (!questionDetails || questionDetails.length === 0) {
      console.warn('No question details provided for analytics');
      const fallbackAnalytics = {
        totalQuestions,
        attemptedQuestions: 0,
        correctCount: 0,
        incorrectCount: 0,
        skippedCount: totalQuestions,
        accuracyPercentage: 0,
        overallScorePercentage: 0,
        timeEfficiency: 'Average' as const,
        performanceLevel: 'Needs Improvement' as const
      };
      console.log('Returning fallback analytics:', fallbackAnalytics);
      return fallbackAnalytics;
    }

    // Ensure unique questions by ID to prevent double counting
    const uniqueQuestions = questionDetails.reduce((acc, current) => {
      const existing = acc.find(item => item.questionId === current.questionId);
      if (!existing) {
        acc.push(current);
      } else {
        console.warn('Duplicate question detected and removed:', current.questionId);
      }
      return acc;
    }, [] as QuestionDetail[]);

    console.log('Unique questions after deduplication:', uniqueQuestions.length);

    // Debug each question evaluation
    console.log('=== INDIVIDUAL QUESTION EVALUATION ===');
    uniqueQuestions.forEach((q, index) => {
      console.log(`Question ${index + 1} (${q.questionId}):`, {
        userAnswer: q.userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect: q.isCorrect,
        answered: q.userAnswer !== '',
        evaluation: q.userAnswer === q.correctAnswer ? 'CORRECT' : q.userAnswer === '' ? 'SKIPPED' : 'INCORRECT'
      });
    });

    // Calculate metrics based on actual answers with proper validation
    const answeredQuestions = uniqueQuestions.filter(q => q.userAnswer !== '' && q.userAnswer !== null);
    const correctAnswers = uniqueQuestions.filter(q => {
      // Double-check the correctness evaluation
      const isAnswered = q.userAnswer !== '' && q.userAnswer !== null;
      const isCorrectByComparison = isAnswered && q.userAnswer === q.correctAnswer;
      const isCorrectByFlag = q.isCorrect;
      
      // Log if there's a mismatch in evaluation
      if (isAnswered && isCorrectByComparison !== isCorrectByFlag) {
        console.error('Evaluation mismatch detected:', {
          questionId: q.questionId,
          userAnswer: q.userAnswer,
          correctAnswer: q.correctAnswer,
          isCorrectByComparison,
          isCorrectByFlag
        });
      }
      
      return isAnswered && isCorrectByComparison;
    });
    
    const incorrectAnswers = answeredQuestions.filter(q => {
      const isCorrect = q.userAnswer === q.correctAnswer;
      return !isCorrect;
    });
    
    const skippedQuestions = uniqueQuestions.filter(q => q.userAnswer === '' || q.userAnswer === null);

    const attemptedQuestions = answeredQuestions.length;
    const correctCount = correctAnswers.length;
    const incorrectCount = incorrectAnswers.length;
    const skippedCount = skippedQuestions.length;

    // Validate totals
    const calculatedTotal = attemptedQuestions + skippedCount;
    if (calculatedTotal !== uniqueQuestions.length) {
      console.error('Total calculation mismatch:', {
        attempted: attemptedQuestions,
        skipped: skippedCount,
        calculated: calculatedTotal,
        expected: uniqueQuestions.length
      });
    }

    // Calculate percentages
    const accuracyPercentage = attemptedQuestions > 0 ? 
      Math.round((correctCount / attemptedQuestions) * 100) : 0;
    const overallScorePercentage = totalQuestions > 0 ? 
      Math.round((correctCount / totalQuestions) * 100) : 0;

    console.log('=== CALCULATED METRICS ===');
    console.log('Breakdown:', {
      totalQuestions,
      uniqueQuestions: uniqueQuestions.length,
      attemptedQuestions,
      correctCount,
      incorrectCount,
      skippedCount,
      accuracyPercentage,
      overallScorePercentage
    });

    // Calculate time metrics
    let averageTimePerQuestion: number | undefined;
    let timeEfficiency: 'Fast' | 'Average' | 'Slow' = 'Average';
    let fastQuestions = 0;
    let slowQuestions = 0;

    if (elapsedTime && totalQuestions > 0) {
      averageTimePerQuestion = Math.round(elapsedTime / totalQuestions / 1000);
      
      // Classify time efficiency
      if (averageTimePerQuestion <= 30) {
        timeEfficiency = 'Fast';
      } else if (averageTimePerQuestion > 60) {
        timeEfficiency = 'Slow';
      }

      // Count fast and slow individual questions if time data available
      uniqueQuestions.forEach(q => {
        if (q.timeSpent) {
          if (q.timeSpent <= 20) fastQuestions++;
          if (q.timeSpent >= 90) slowQuestions++;
        }
      });
    }

    // Determine performance level
    let performanceLevel: 'Outstanding' | 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement';
    if (overallScorePercentage >= 90) {
      performanceLevel = 'Outstanding';
    } else if (overallScorePercentage >= 80) {
      performanceLevel = 'Excellent';
    } else if (overallScorePercentage >= 70) {
      performanceLevel = 'Good';
    } else if (overallScorePercentage >= 60) {
      performanceLevel = 'Fair';
    } else {
      performanceLevel = 'Needs Improvement';
    }

    // Analyze topic strengths and weaknesses
    const topicStrengths: string[] = [];
    const topicWeaknesses: string[] = [];

    if (accuracyPercentage >= 80) {
      topicStrengths.push('Strong comprehension of core concepts');
    }
    if (timeEfficiency === 'Fast') {
      topicStrengths.push('Quick problem solving');
    }
    if (skippedCount === 0) {
      topicStrengths.push('Confident in attempting all questions');
    }

    if (accuracyPercentage < 60) {
      topicWeaknesses.push('Fundamental concepts need review');
    }
    if (timeEfficiency === 'Slow') {
      topicWeaknesses.push('Problem solving speed could improve');
    }
    if (skippedCount > totalQuestions * 0.2) {
      topicWeaknesses.push('Confidence building needed');
    }

    const analyticsResult: QuizAnalytics = {
      totalQuestions,
      attemptedQuestions,
      correctCount,
      incorrectCount,
      skippedCount,
      accuracyPercentage,
      overallScorePercentage,
      averageTimePerQuestion,
      fastQuestions,
      slowQuestions,
      topicStrengths,
      topicWeaknesses,
      timeEfficiency,
      performanceLevel
    };

    console.log('=== FINAL ANALYTICS RESULT ===');
    console.log('Final analytics:', analyticsResult);
    console.log('=== QUIZ ANALYTICS CALCULATION END ===');
    
    setAnalytics(analyticsResult);
    return analyticsResult;
  };

  /**
   * Get performance insights based on analytics
   */
  const getPerformanceInsights = (analytics: QuizAnalytics): string[] => {
    const insights: string[] = [];

    // Score-based insights
    if (analytics.overallScorePercentage >= 90) {
      insights.push('Exceptional performance! You have mastered this topic.');
    } else if (analytics.overallScorePercentage >= 80) {
      insights.push('Excellent work! You have a solid understanding.');
    } else if (analytics.overallScorePercentage >= 70) {
      insights.push('Good performance with room for minor improvements.');
    } else if (analytics.overallScorePercentage >= 60) {
      insights.push('Fair performance. Focus on strengthening weak areas.');
    } else {
      insights.push('This topic requires significant study and practice.');
    }

    // Time-based insights
    if (analytics.timeEfficiency === 'Fast' && analytics.accuracyPercentage >= 80) {
      insights.push('Great balance of speed and accuracy!');
    } else if (analytics.timeEfficiency === 'Slow' && analytics.accuracyPercentage >= 80) {
      insights.push('High accuracy but consider practicing for better speed.');
    } else if (analytics.timeEfficiency === 'Fast' && analytics.accuracyPercentage < 70) {
      insights.push('Good speed but focus on accuracy over speed.');
    }

    // Skipping behavior insights
    if (analytics.skippedCount === 0) {
      insights.push('Confident approach - attempted all questions!');
    } else if (analytics.skippedCount > analytics.correctCount) {
      insights.push('Consider building confidence by reviewing fundamentals.');
    }

    return insights;
  };

  return {
    analytics,
    calculateQuizAnalytics,
    getPerformanceInsights
  };
}
