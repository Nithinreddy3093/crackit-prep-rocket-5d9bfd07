
import { useQuestionLoading } from './useQuestionLoading';
import { useQuestionNavigation, QuestionDetail } from './useQuestionNavigation';
import { useSeenQuestions } from './useSeenQuestions';
import { Question } from "@/services/questionService";

export interface InProgressQuiz {
  topicId: string;
  currentQuestionIndex: number;
  userAnswers: (number | null)[];
  startTime: number;
  questionIds: string[];
}

export function useQuestionManagement(userId?: string, topicId?: string) {
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

  return {
    // State variables
    questions,
    currentQuestionIndex,
    selectedAnswer,
    correctAnswers,
    isQuestionsLoading,
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
