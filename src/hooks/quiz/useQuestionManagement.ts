
import { useState, useEffect, useCallback } from 'react';
import { Question, getQuestionsByTopicId } from "@/services/questionService";

export function useQuestionManagement(userId?: string, topicId?: string) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [seenQuestionIds, setSeenQuestionIds] = useState<string[]>([]);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState<Error | null>(null);
  const [questionDetails, setQuestionDetails] = useState<{
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[]>([]);

  // Fetch previously seen questions from localStorage
  useEffect(() => {
    if (userId && topicId) {
      const key = `${userId}_${topicId}_seen_questions`;
      const storedSeenQuestions = localStorage.getItem(key);
      
      if (storedSeenQuestions) {
        try {
          setSeenQuestionIds(JSON.parse(storedSeenQuestions));
        } catch (e) {
          console.error('Error parsing stored seen questions:', e);
          setSeenQuestionIds([]);
        }
      }
    }
  }, [userId, topicId]);

  // Fetch questions for the topic
  useEffect(() => {
    if (topicId) {
      setIsQuestionsLoading(true);
      setQuestionsError(null);
      
      getQuestionsByTopicId(topicId, seenQuestionIds)
        .then(fetchedQuestions => {
          setQuestions(fetchedQuestions);
          setCurrentQuestionIndex(0);
          setSelectedAnswer(null);
          setCorrectAnswers(0);
          setQuestionDetails([]);
          setIsQuestionsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching questions:', error);
          setQuestionsError(error instanceof Error ? error : new Error(String(error)));
          setIsQuestionsLoading(false);
        });
    }
  }, [topicId, seenQuestionIds]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    const isCorrect = currentQuestion.options[answerIndex] === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
  };

  const goToNextQuestion = useCallback(() => {
    setSelectedAnswer(null);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      return false;
    } else {
      return true;
    }
  }, [currentQuestionIndex, questions.length]);

  const resetQuestionState = useCallback(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setCorrectAnswers(0);
    setQuestionDetails([]);
  }, []);

  const updateSeenQuestions = useCallback(() => {
    if (userId && topicId) {
      const newSeenQuestionIds = [
        ...seenQuestionIds,
        ...questions.map(question => question.id)
      ];
      
      // Remove duplicates
      const uniqueSeenQuestionIds = [...new Set(newSeenQuestionIds)];
      
      // Store in localStorage
      const key = `${userId}_${topicId}_seen_questions`;
      localStorage.setItem(key, JSON.stringify(uniqueSeenQuestionIds));
      
      setSeenQuestionIds(uniqueSeenQuestionIds);
    }
  }, [userId, topicId, questions, seenQuestionIds]);

  return {
    questions,
    currentQuestionIndex,
    selectedAnswer,
    correctAnswers,
    isQuestionsLoading,
    questionsError,
    currentQuestion,
    seenQuestionIds,
    questionDetails,
    setQuestionDetails,
    handleAnswerSelect,
    goToNextQuestion,
    resetQuestionState,
    updateSeenQuestions,
    setQuestions
  };
}
