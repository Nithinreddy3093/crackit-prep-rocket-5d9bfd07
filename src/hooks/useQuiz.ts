
import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { generateUniqueQuestionsForSession } from "@/services/questionService";

import { useQuestionManagement } from './quiz/useQuestionManagement';
import { useTopicFetching } from './quiz/useTopicFetching';
import { useQuizTimer } from './quiz/useQuizTimer';
import { useQuizSubmission, QuizSubmissionData } from './quiz/useQuizSubmission';
import { useQuizState } from './quiz/useQuizState';

export function useQuiz(topicId: string | undefined) {
  const { user } = useAuth();
  const { 
    questions, currentQuestionIndex, selectedAnswer, correctAnswers,
    isQuestionsLoading, questionsError, currentQuestion, seenQuestionIds,
    handleAnswerSelect, goToNextQuestion, resetQuestionState, updateSeenQuestions, setQuestions,
    questionDetails, setQuestionDetails, userAnswers
  } = useQuestionManagement(user?.id, topicId);

  const {
    currentTopic, isTopicLoading, topicError
  } = useTopicFetching(topicId);

  const {
    quizStarted, quizCompleted, startQuiz, completeQuiz, resetQuiz
  } = useQuizState();

  const {
    elapsedTime, formatTime, resetTimer, pauseTimer, resumeTimer
  } = useQuizTimer(!quizCompleted && quizStarted && questions.length > 0);

  const { submitQuiz, isSubmitting } = useQuizSubmission();

  // Check if there's a saved quiz in localStorage to restore
  useEffect(() => {
    const savedResults = localStorage.getItem('lastQuizResults');
    if (savedResults && quizCompleted) {
      try {
        // There are saved results that weren't submitted
        toast({
          title: "Unsubmitted Quiz Results",
          description: "You have quiz results that weren't submitted. You can find them in your dashboard.",
          variant: "default",
        });
      } catch (error) {
        console.error('Error parsing saved results:', error);
      }
    }
    
    // Check for any in-progress quiz when component mounts
    const inProgressQuiz = localStorage.getItem('inProgressQuiz');
    if (inProgressQuiz && !quizStarted && !quizCompleted) {
      try {
        const quizData = JSON.parse(inProgressQuiz);
        if (quizData.topicId === topicId) {
          toast({
            title: "Quiz in Progress",
            description: "Continuing your in-progress quiz.",
            variant: "default",
          });
          
          // Automatically start the quiz
          setTimeout(() => startQuiz(), 500);
        }
      } catch (error) {
        console.error('Error parsing in-progress quiz:', error);
      }
    }
  }, [quizStarted, quizCompleted, topicId, startQuiz]);

  // Store seen question IDs in localStorage whenever a quiz is completed
  useEffect(() => {
    if (quizCompleted) {
      updateSeenQuestions();
    }
  }, [quizCompleted, updateSeenQuestions]);

  // Fetch data manually in useEffect as a fallback
  useEffect(() => {
    if (isQuestionsLoading === false && !questionsError && questions.length === 0 && topicId && user?.id) {
      generateUniqueQuestionsForSession(user.id, topicId, seenQuestionIds)
        .then(data => {
          setQuestions(data);
        })
        .catch(error => {
          console.error('Error fetching questions:', error);
        });
    }
  }, [isQuestionsLoading, questionsError, topicId, questions.length, user?.id, seenQuestionIds, setQuestions]);

  // Handle page visibility change to pause/resume timer
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && quizStarted && !quizCompleted) {
        pauseTimer();
      } else if (!document.hidden && quizStarted && !quizCompleted) {
        resumeTimer();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [quizStarted, quizCompleted, pauseTimer, resumeTimer]);

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
    localStorage.removeItem('inProgressQuiz');
    localStorage.removeItem('lastQuizResults');
    
    // Generate new questions for the restart
    if (topicId && user?.id) {
      generateUniqueQuestionsForSession(user.id, topicId, seenQuestionIds)
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
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to submit quiz results.",
        variant: "destructive",
      });
      return;
    }
    
    // Calculate analytics
    const skippedQuestions = questionDetails.filter(q => q.userAnswer === '').length;
    const incorrectQuestions = questionDetails.filter(q => !q.isCorrect && q.userAnswer !== '').length;
    
    console.log('Quiz analytics:', {
      correctAnswers,
      incorrectQuestions,
      skippedQuestions,
      totalQuestions: questions.length
    });
    
    const quizData: QuizSubmissionData = {
      userId: user.id,
      topicTitle: currentTopic?.title || 'General Knowledge',
      correctAnswers,
      totalQuestions: questions.length,
      timeInMs: elapsedTime,
      questionDetails
    };
    
    try {
      await submitQuiz(quizData);
      
      // Save submission status to prevent resubmission
      localStorage.removeItem('lastQuizResults');
      localStorage.setItem('lastSubmittedQuiz', JSON.stringify({
        topicId,
        timestamp: new Date().toISOString()
      }));
      
    } catch (error) {
      console.error('Error submitting quiz:', error);
      
      // Save to localStorage in case of submission failure
      localStorage.setItem('lastQuizResults', JSON.stringify({
        ...quizData,
        timestamp: new Date().toISOString()
      }));
    }
  };

  return {
    // State
    questions,
    currentQuestionIndex,
    selectedAnswer,
    correctAnswers,
    quizCompleted,
    quizStarted,
    elapsedTime,
    currentTopic,
    isLoading: isQuestionsLoading || isTopicLoading || isSubmitting,
    error: questionsError || topicError,
    seenQuestionIds,
    questionDetails,
    userAnswers,
    
    // Current question
    currentQuestion,
    
    // Actions
    handleAnswerSelect,
    goToNextQuestion: handleNextQuestion,
    handleRestartQuiz,
    handleSubmitQuiz,
    startQuiz,
    
    // Utilities
    formatTime,
  };
}
