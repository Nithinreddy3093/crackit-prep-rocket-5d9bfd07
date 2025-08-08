
import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { generateUniqueQuestionsForSession } from "@/services/questionService";
import { useQuizAnalytics } from './useQuizAnalytics';
import { useQuizSubmission, QuizSubmissionData } from './useQuizSubmission';
import { useQuizLocalStorage } from './useQuizLocalStorage';

export function useQuizActions(
  userId: string | undefined,
  topicId: string | undefined,
  questions: any[],
  currentQuestionIndex: number,
  selectedAnswer: number | null,
  correctAnswers: number,
  seenQuestionIds: string[],
  currentQuestion: any,
  questionDetails: any[],
  elapsedTime: number,
  currentTopicTitle: string | undefined,
  setQuestionDetails: (details: any[]) => void,
  setQuestions: (questions: any[]) => void,
  goToNextQuestion: () => boolean,
  resetQuestionState: () => void,
  resetQuiz: () => void,
  resetTimer: () => void,
  completeQuiz: () => void,
  userAnswers: Record<string, number> = {}
) {
  const { submitQuiz, isSubmitting } = useQuizSubmission();
  const { calculateQuizAnalytics } = useQuizAnalytics();
  const { saveQuizResults, clearQuizProgress, saveSubmittedQuizStatus } = useQuizLocalStorage(
    topicId, false, false, () => {}
  );
  
  // Modified goToNextQuestion to handle quiz completion and track question details
  const handleNextQuestion = () => {
    // Don't track details here - let goToNextQuestion handle it to avoid duplicates
    const isCompleted = goToNextQuestion();
    if (isCompleted) {
      console.log('Quiz completed, triggering completion...');
      completeQuiz();
    }
  };

  // Restart the quiz
  const handleRestartQuiz = () => {
    console.log('Restarting quiz...');
    
    // Reset all quiz state
    resetQuestionState();
    resetQuiz();
    resetTimer();
    
    // Clear localStorage entries
    clearQuizProgress();
    
    // Generate new questions for the restart
    if (topicId && userId) {
      generateUniqueQuestionsForSession(userId, topicId, seenQuestionIds)
        .then(newQuestions => {
          console.log('Generated new questions for restart:', newQuestions.length);
          setQuestions(newQuestions);
        })
        .catch(error => {
          console.error('Error generating new questions:', error);
          toast({
            title: "Error restarting quiz",
            description: error.message,
            variant: "destructive",
          });
        });
    }
  };

  // Submit quiz and save results with accurate evaluation
  const handleSubmitQuiz = async () => {
    console.log('🚀 QUIZ SUBMISSION INITIATED in useQuizActions:', {
      userId: userId || 'NOT_AUTHENTICATED',
      topicTitle: currentTopicTitle || 'General',
      correctAnswers,
      totalQuestions: questions.length,
      questionDetailsCount: questionDetails.length,
      elapsedTime,
      userAnswersCount: Object.keys(userAnswers).length
    });

    if (!userId) {
      console.error('❌ No user ID - authentication required');
      toast({
        title: "Authentication Required",
        description: "Please sign in to save your quiz results.",
        variant: "destructive",
      });
      return;
    }

    // Pre-submission validation
    if (questionDetails.length === 0) {
      console.error('🚨 CRITICAL: No question details available for submission!');
      toast({
        title: "Submission Error",
        description: "Quiz data is incomplete. Please restart the quiz.",
        variant: "destructive",
      });
      return;
    }

    if (questionDetails.length !== questions.length) {
      console.warn('⚠️ Question details count mismatch before submission:', {
        expected: questions.length,
        actual: questionDetails.length
      });
    }

    // Log all question details for comprehensive debugging
    console.log('📋 QUESTION DETAILS FOR SUBMISSION:');
    questionDetails.forEach((detail, index) => {
      console.log(`Q${index + 1} (${detail.questionId}):`, {
        question: detail.question.substring(0, 50) + '...',
        userAnswer: detail.userAnswer || 'NO ANSWER',
        correctAnswer: detail.correctAnswer,
        isCorrect: detail.isCorrect ? '✅' : '❌',
        isAnswered: detail.userAnswer ? '📝' : '⏭️'
      });
    });
    
    // Calculate analytics with the correct parameters for final validation
    const analytics = calculateQuizAnalytics(questionDetails, questions.length, elapsedTime);
    
    console.log('📊 ANALYTICS CALCULATED FOR SUBMISSION:', {
      totalQuestions: analytics.totalQuestions,
      attemptedQuestions: analytics.attemptedQuestions,
      correctCount: analytics.correctCount,
      incorrectCount: analytics.incorrectCount,
      skippedCount: analytics.skippedCount,
      accuracyPercentage: analytics.accuracyPercentage,
      overallScorePercentage: analytics.overallScorePercentage
    });
    
    const quizData: QuizSubmissionData = {
      userId: userId,
      topicTitle: currentTopicTitle || 'General Knowledge',
      correctAnswers: analytics.correctCount, // Use analytics for accurate count
      totalQuestions: questions.length,
      timeInMs: elapsedTime,
      questionDetails
    };
    
    console.log('📤 FINAL QUIZ DATA FOR SUBMISSION:', {
      userId: quizData.userId,
      topicTitle: quizData.topicTitle,
      correctAnswers: quizData.correctAnswers,
      totalQuestions: quizData.totalQuestions,
      timeInMs: quizData.timeInMs,
      questionDetailsCount: quizData.questionDetails?.length || 0,
      score: Math.round((quizData.correctAnswers / quizData.totalQuestions) * 100)
    });
    
    try {
      // Clear storage immediately to prevent "continue quiz" popup on reload
      clearQuizProgress();
      localStorage.removeItem(`quiz_progress_${currentTopicTitle}`);
      localStorage.removeItem('lastQuizResults');
      localStorage.removeItem('inProgressQuiz');
      
      console.log('🧹 Cleared all quiz progress data');
      
      // Submit quiz results
      await submitQuiz(quizData);
      
      // Save submission status to prevent resubmission
      saveSubmittedQuizStatus(topicId);
      
      console.log('✅ Quiz submission completed successfully in useQuizActions');
      
    } catch (error) {
      console.error('❌ Error submitting quiz in useQuizActions:', error);
      
      // Save to localStorage in case of submission failure
      saveQuizResults(quizData);
      console.log('💾 Saved quiz data to localStorage as backup');
      throw error; // Re-throw to trigger error handling in parent
    }
  };

  return {
    handleNextQuestion,
    handleRestartQuiz,
    handleSubmitQuiz,
    isSubmitting
  };
}
