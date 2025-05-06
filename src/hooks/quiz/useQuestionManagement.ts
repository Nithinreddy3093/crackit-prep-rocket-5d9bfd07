
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useQuestionLoading } from './useQuestionLoading';
import { useQuestionNavigation, QuestionDetail } from './useQuestionNavigation';
import { useSeenQuestions } from './useSeenQuestions';
import { Question, generateUniqueQuestionsForSession } from "@/services/questionService";

export interface InProgressQuiz {
  topicId: string;
  currentQuestionIndex: number;
  userAnswers: (number | null)[];
  startTime: number;
  questionIds: string[];
}

export function useQuestionManagement(userId?: string, topicId?: string) {
  const [isRetrying, setIsRetrying] = useState(false);
  const { seenQuestionIds, updateSeenQuestions } = useSeenQuestions(userId, topicId);
  
  const { 
    questions, 
    setQuestions, 
    isQuestionsLoading, 
    questionsError 
  } = useQuestionLoading(userId, topicId, seenQuestionIds);
  
  const {
    currentQuestionIndex,
    selectedAnswer,
    correctAnswers,
    questionDetails,
    userAnswers,
    currentQuestion,
    setQuestionDetails,
    handleAnswerSelect,
    goToNextQuestion,
    resetQuestionState
  } = useQuestionNavigation(questions, userId, topicId);

  // Retry loading questions if initial load failed
  useEffect(() => {
    if (questionsError && !isRetrying && topicId && userId) {
      setIsRetrying(true);
      
      // Show error toast
      toast({
        title: "Error loading questions",
        description: "Retrying to load quiz questions...",
        variant: "default",
      });
      
      // Wait a moment and retry
      const timer = setTimeout(() => {
        generateUniqueQuestionsForSession(userId, topicId, seenQuestionIds)
          .then(data => {
            if (data.length > 0) {
              setQuestions(data);
              toast({
                title: "Questions loaded successfully",
                description: `${data.length} questions loaded`,
                variant: "default",
              });
            } else {
              throw new Error("No questions available for this topic");
            }
          })
          .catch(error => {
            console.error('Error retrying question fetch:', error);
            toast({
              title: "Failed to load questions",
              description: error.message || "Please try another topic",
              variant: "destructive",
            });
          })
          .finally(() => {
            setIsRetrying(false);
          });
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [questionsError, topicId, userId, seenQuestionIds, isRetrying, setQuestions]);
  
  // Handle case where questions array is empty but not in loading state
  useEffect(() => {
    if (!isQuestionsLoading && !questionsError && questions.length === 0 && topicId && userId && !isRetrying) {
      setIsRetrying(true);
      
      console.log("No questions loaded, retrying...");
      
      // Wait a moment and retry
      const timer = setTimeout(() => {
        generateUniqueQuestionsForSession(userId, topicId, seenQuestionIds)
          .then(data => {
            if (data.length > 0) {
              setQuestions(data);
            } else {
              throw new Error("No questions available for this topic");
            }
          })
          .catch(error => {
            console.error('Error retrying question fetch:', error);
          })
          .finally(() => {
            setIsRetrying(false);
          });
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isQuestionsLoading, questionsError, questions.length, topicId, userId, seenQuestionIds, isRetrying, setQuestions]);

  return {
    // State variables
    questions,
    currentQuestionIndex,
    selectedAnswer,
    correctAnswers,
    isQuestionsLoading: isQuestionsLoading || isRetrying,
    questionsError,
    currentQuestion,
    seenQuestionIds,
    questionDetails,
    userAnswers,
    
    // Actions
    setQuestions,
    setQuestionDetails,
    handleAnswerSelect,
    goToNextQuestion,
    resetQuestionState,
    updateSeenQuestions
  };
}
