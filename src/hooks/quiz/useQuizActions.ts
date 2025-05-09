
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
      // Track question details
      const questionDetail = {
        questionId: currentQuestion.id,
        question: currentQuestion.text,
        userAnswer: currentQuestion.options[selectedAnswer],
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect: currentQuestion.options[selectedAnswer] === currentQuestion.correctAnswer
      };
      
      setQuestionDetails([...questionDetails, questionDetail]);
    }
    
    const isCompleted = goToNextQuestion();
    if (isCompleted) {
      completeQuiz();
    }
  };

  // Restart the quiz
  const handleRestartQuiz = () => {
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

  // Submit quiz and save results
  const handleSubmitQuiz = async () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to submit quiz results.",
        variant: "destructive",
      });
      return;
    }
    
    // Calculate analytics
    const analytics = calculateQuizAnalytics(questionDetails, correctAnswers, questions.length, elapsedTime);
    
    console.log('Quiz analytics:', analytics);
    
    const quizData: QuizSubmissionData = {
      userId: userId,
      topicTitle: currentTopicTitle || 'General Knowledge',
      correctAnswers,
      totalQuestions: questions.length,
      timeInMs: elapsedTime,
      questionDetails
    };
    
    try {
      // Clear storage immediately to prevent "continue quiz" popup on reload
      clearQuizProgress();
      localStorage.removeItem(`quiz_progress_${currentTopicTitle}`);
      localStorage.removeItem('lastQuizResults');
      localStorage.removeItem('inProgressQuiz');
      
      // Submit quiz results
      await submitQuiz(quizData);
      
      // Save submission status to prevent resubmission
      saveSubmittedQuizStatus(topicId);
      
    } catch (error) {
      console.error('Error submitting quiz:', error);
      
      // Save to localStorage in case of submission failure
      saveQuizResults(quizData);
    }
  };

  return {
    handleNextQuestion,
    handleRestartQuiz,
    handleSubmitQuiz,
    isSubmitting
  };
}
