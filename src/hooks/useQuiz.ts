
import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { generateUniqueQuestionsForSession } from "@/services/questionService";

import { useQuestionManagement } from './quiz/useQuestionManagement';
import { useTopicFetching } from './quiz/useTopicFetching';
import { useQuizTimer } from './quiz/useQuizTimer';
import { useQuizSubmission } from './quiz/useQuizSubmission';
import { useQuizState } from './quiz/useQuizState';

export function useQuiz(topicId: string | undefined) {
  const { user } = useAuth();
  const { 
    questions, currentQuestionIndex, selectedAnswer, correctAnswers,
    isQuestionsLoading, questionsError, currentQuestion, seenQuestionIds,
    handleAnswerSelect, goToNextQuestion, resetQuestionState, updateSeenQuestions, setQuestions
  } = useQuestionManagement(user?.id, topicId);

  const {
    currentTopic, isTopicLoading, topicError
  } = useTopicFetching(topicId);

  const {
    quizStarted, quizCompleted, startQuiz, completeQuiz, resetQuiz
  } = useQuizState();

  const {
    elapsedTime, formatTime, resetTimer
  } = useQuizTimer(!quizCompleted && quizStarted && questions.length > 0);

  const { submitQuiz } = useQuizSubmission();

  // Store seen question IDs in localStorage whenever a quiz is completed
  useEffect(() => {
    if (quizCompleted) {
      updateSeenQuestions();
    }
  }, [quizCompleted]);

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
  }, [isQuestionsLoading, questionsError, topicId, questions.length, user?.id, seenQuestionIds]);

  // Modified goToNextQuestion to handle quiz completion
  const handleNextQuestion = () => {
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
    await submitQuiz(
      user?.id,
      currentTopic?.title,
      correctAnswers,
      questions.length,
      elapsedTime
    );
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
    isLoading: isQuestionsLoading || isTopicLoading,
    error: questionsError || topicError,
    seenQuestionIds,
    
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
