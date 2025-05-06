
import { useState, useEffect, useCallback } from 'react';
import { Question } from "@/services/questionService";

export interface QuestionDetail {
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface InProgressQuiz {
  topicId: string;
  currentQuestionIndex: number;
  userAnswers: (number | null)[];
  startTime: number;
  questionIds: string[];
}

export function useQuestionNavigation(
  questions: Question[], 
  userId?: string, 
  topicId?: string
) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [questionDetails, setQuestionDetails] = useState<QuestionDetail[]>([]);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);

  const currentQuestion = questions[currentQuestionIndex];

  // Initialize user answers array when questions change
  useEffect(() => {
    if (questions.length > 0) {
      setUserAnswers(new Array(questions.length).fill(null));
    }
  }, [questions]);

  // When component mounts, restore selected answer for current question if available
  useEffect(() => {
    if (userAnswers[currentQuestionIndex] !== undefined) {
      setSelectedAnswer(userAnswers[currentQuestionIndex]);
    } else {
      setSelectedAnswer(null);
    }
  }, [currentQuestionIndex, userAnswers]);

  // Restore progress from localStorage
  useEffect(() => {
    if (userId && topicId) {
      // Check for in-progress quiz
      const inProgressQuiz = localStorage.getItem('inProgressQuiz');
      if (inProgressQuiz) {
        try {
          const quizData: InProgressQuiz = JSON.parse(inProgressQuiz);
          if (quizData.topicId === topicId) {
            console.log('Restoring in-progress quiz:', quizData);
            setCurrentQuestionIndex(quizData.currentQuestionIndex);
            setUserAnswers(quizData.userAnswers);
          }
        } catch (e) {
          console.error('Error parsing in-progress quiz:', e);
        }
      }
    }
  }, [userId, topicId]);

  const handleAnswerSelect = useCallback((answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    // Update userAnswers array
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(updatedUserAnswers);
    
    // Save progress to localStorage
    if (userId && topicId && currentQuestion) {
      const quizData: InProgressQuiz = {
        topicId,
        currentQuestionIndex,
        userAnswers: updatedUserAnswers,
        startTime: Date.now() - 1000, // Approximate start time
        questionIds: questions.map(q => q.id)
      };
      localStorage.setItem('inProgressQuiz', JSON.stringify(quizData));
    }
    
    if (currentQuestion && currentQuestion.options[answerIndex] === currentQuestion.correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
    }
  }, [currentQuestion, currentQuestionIndex, questions, topicId, userId, userAnswers]);

  const goToNextQuestion = useCallback(() => {
    if (!currentQuestion) return false;
    
    // Track question detail
    const detail = {
      questionId: currentQuestion.id,
      question: currentQuestion.text,
      userAnswer: selectedAnswer !== null ? currentQuestion.options[selectedAnswer] : '',
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: selectedAnswer !== null && currentQuestion.options[selectedAnswer] === currentQuestion.correctAnswer
    };
    
    setQuestionDetails(prev => [...prev, detail]);
    setSelectedAnswer(null);
    
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      
      // Update progress in localStorage
      if (userId && topicId) {
        const quizData: InProgressQuiz = {
          topicId,
          currentQuestionIndex: nextIndex,
          userAnswers,
          startTime: Date.now() - ((nextIndex + 1) * 30 * 1000), // Rough estimate
          questionIds: questions.map(q => q.id)
        };
        localStorage.setItem('inProgressQuiz', JSON.stringify(quizData));
      }
      
      return false;
    } else {
      return true;
    }
  }, [currentQuestionIndex, questions.length, selectedAnswer, currentQuestion, userAnswers, userId, topicId]);

  const resetQuestionState = useCallback(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setCorrectAnswers(0);
    setQuestionDetails([]);
    setUserAnswers(new Array(questions.length).fill(null));
    localStorage.removeItem('inProgressQuiz');
  }, [questions.length]);

  return {
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
  };
}
