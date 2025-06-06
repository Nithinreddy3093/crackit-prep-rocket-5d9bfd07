
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
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  answeredCount: number;
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
    correctCount: 0,
    incorrectCount: 0,
    skippedCount: 0,
    answeredCount: 0,
    accuracyPercentage: 0,
    overallScorePercentage: 0,
    timeEfficiency: 'Average',
    performanceLevel: 'Needs Improvement'
  });

  /**
   * Calculate comprehensive quiz analytics from question details
   */
  const calculateQuizAnalytics = (
    questionDetails: QuestionDetail[],
    totalQuestions: number,
    elapsedTime?: number
  ): QuizAnalytics => {
    if (!questionDetails || questionDetails.length === 0) {
      // Return basic analytics if no detailed data
      return {
        correctCount: 0,
        incorrectCount: 0,
        skippedCount: totalQuestions,
        answeredCount: 0,
        accuracyPercentage: 0,
        overallScorePercentage: 0,
        timeEfficiency: 'Average',
        performanceLevel: 'Needs Improvement'
      };
    }

    // Calculate basic counts
    const correctCount = questionDetails.filter(q => q.isCorrect).length;
    const answeredQuestions = questionDetails.filter(q => q.userAnswer !== '');
    const answeredCount = answeredQuestions.length;
    const incorrectCount = answeredQuestions.filter(q => !q.isCorrect).length;
    const skippedCount = questionDetails.filter(q => q.userAnswer === '').length;

    // Calculate percentages
    const accuracyPercentage = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    const overallScorePercentage = Math.round((correctCount / totalQuestions) * 100);

    // Calculate time metrics
    let averageTimePerQuestion: number | undefined;
    let timeEfficiency: 'Fast' | 'Average' | 'Slow' = 'Average';
    let fastQuestions = 0;
    let slowQuestions = 0;

    if (elapsedTime) {
      averageTimePerQuestion = Math.round(elapsedTime / totalQuestions / 1000);
      
      // Classify time efficiency
      if (averageTimePerQuestion <= 30) {
        timeEfficiency = 'Fast';
      } else if (averageTimePerQuestion > 60) {
        timeEfficiency = 'Slow';
      }

      // Count fast and slow individual questions if time data available
      questionDetails.forEach(q => {
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

    // Analyze topic strengths and weaknesses (basic implementation)
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
      correctCount,
      incorrectCount,
      skippedCount,
      answeredCount,
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
