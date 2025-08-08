
import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { generateUniqueQuestionsForSession } from "@/services/questionService";

import { useQuestionManagement } from './quiz/useQuestionManagement';
import { useTopicFetching } from './quiz/useTopicFetching';
import { useQuizTimer } from './quiz/useQuizTimer';
import { useQuizState } from './quiz/useQuizState';
import { useQuizLocalStorage, QuizLocalStorageData } from './quiz/useQuizLocalStorage';
import { useQuizActions } from './quiz/useQuizActions';

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

  const { saveQuizProgress } = useQuizLocalStorage(
    topicId,
    quizStarted,
    quizCompleted,
    startQuiz
  );

  const { handleNextQuestion, handleRestartQuiz, handleSubmitQuiz, isSubmitting } = useQuizActions(
    user?.id,
    topicId,
    questions,
    currentQuestionIndex,
    selectedAnswer,
    correctAnswers,
    seenQuestionIds,
    currentQuestion,
    questionDetails,
    elapsedTime,
    currentTopic?.title,
    setQuestionDetails,
    setQuestions,
    goToNextQuestion,
    resetQuestionState,
    resetQuiz,
    resetTimer,
    completeQuiz,
    userAnswers
  );

  // Store seen question IDs in localStorage whenever a quiz is completed
  useEffect(() => {
    if (quizCompleted) {
      updateSeenQuestions(questions);
    }
  }, [quizCompleted, updateSeenQuestions, questions]);

  // Save quiz progress periodically
  useEffect(() => {
    if (quizStarted && !quizCompleted && topicId && questions.length > 0) {
      const quizData: QuizLocalStorageData = {
        topicId,
        questions,
        currentQuestionIndex,
        correctAnswers,
        userAnswers,
        elapsedTime,
        questionDetails
      };
      saveQuizProgress(quizData);
    }
  }, [quizStarted, quizCompleted, currentQuestionIndex, correctAnswers, questions, userAnswers, questionDetails, elapsedTime, topicId, saveQuizProgress]);

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
