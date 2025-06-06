
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
  completeQuiz: () => void
) {
  const { submitQuiz, isSubmitting } = useQuizSubmission();
  const { calculateQuizAnalytics } = useQuizAnalytics();
  const { saveQuizResults, clearQuizProgress, saveSubmittedQuizStatus } = useQuizLocalStorage(
    topicId, false, false, () => {}
  );
  
  // Modified goToNextQuestion to handle quiz completion and track question details
  const handleNextQuestion = () => {
    if (currentQuestion && selectedAnswer !== null) {
      // Track question details with proper evaluation
      const userAnswerText = currentQuestion.options[selectedAnswer];
      const isCorrect = userAnswerText === currentQuestion.correctAnswer;
      
      console.log('Tracking question detail:', {
        questionId: currentQuestion.id,
        userAnswer: userAnswerText,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect,
        selectedIndex: selectedAnswer
      });
      
      const questionDetail = {
        questionId: currentQuestion.id,
        question: currentQuestion.text,
        userAnswer: userAnswerText,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect
      };
      
      setQuestionDetails([...questionDetails, questionDetail]);
    }
    
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
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to submit quiz results.",
        variant: "destructive",
      });
      return;
    }
    
    console.log('=== QUIZ SUBMISSION PREPARATION ===');
    console.log('Pre-submission state:', {
      userId,
      topicTitle: currentTopicTitle,
      questionsLength: questions.length,
      questionDetailsLength: questionDetails.length,
      correctAnswers,
      elapsedTime
    });
    
    // Log all question details for debugging
    console.log('Question details being submitted:');
    questionDetails.forEach((detail, index) => {
      console.log(`Question ${index + 1}:`, {
        id: detail.questionId,
        userAnswer: detail.userAnswer,
        correctAnswer: detail.correctAnswer,
        isCorrect: detail.isCorrect
      });
    });
    
    // Calculate analytics with the correct parameters
    const analytics = calculateQuizAnalytics(questionDetails, questions.length, elapsedTime);
    
    console.log('Analytics calculated for submission:', {
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
    
    console.log('Final quiz data for submission:', {
      userId: quizData.userId,
      topicTitle: quizData.topicTitle,
      correctAnswers: quizData.correctAnswers,
      totalQuestions: quizData.totalQuestions,
      timeInMs: quizData.timeInMs,
      questionDetailsCount: quizData.questionDetails?.length || 0
    });
    
    try {
      // Clear storage immediately to prevent "continue quiz" popup on reload
      clearQuizProgress();
      localStorage.removeItem(`quiz_progress_${currentTopicTitle}`);
      localStorage.removeItem('lastQuizResults');
      localStorage.removeItem('inProgressQuiz');
      
      console.log('Cleared all quiz progress data');
      
      // Submit quiz results
      await submitQuiz(quizData);
      
      // Save submission status to prevent resubmission
      saveSubmittedQuizStatus(topicId);
      
      console.log('Quiz submission completed successfully');
      
    } catch (error) {
      console.error('Error submitting quiz:', error);
      
      // Save to localStorage in case of submission failure
      saveQuizResults(quizData);
      console.log('Saved quiz data to localStorage as backup');
    }
  };

  return {
    handleNextQuestion,
    handleRestartQuiz,
    handleSubmitQuiz,
    isSubmitting
  };
}
