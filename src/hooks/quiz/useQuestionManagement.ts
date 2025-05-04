
import { useState, useEffect, useCallback } from 'react';
import { Question, getQuestionsByTopicId } from "@/services/questionService";

export interface InProgressQuiz {
  topicId: string;
  currentQuestionIndex: number;
  userAnswers: (number | null)[];
  startTime: number;
  questionIds: string[];
}

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
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);

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

  // Fetch questions for the topic
  useEffect(() => {
    if (topicId) {
      setIsQuestionsLoading(true);
      setQuestionsError(null);
      
      getQuestionsByTopicId(topicId, seenQuestionIds)
        .then(fetchedQuestions => {
          setQuestions(fetchedQuestions);
          
          // Initialize userAnswers array with nulls for each question
          const initialUserAnswers = new Array(fetchedQuestions.length).fill(null);
          setUserAnswers(initialUserAnswers);
          
          setCurrentQuestionIndex(0);
          setSelectedAnswer(null);
          setCorrectAnswers(0);
          setQuestionDetails([]);
          setIsQuestionsLoading(false);
          
          // Save initial quiz state
          if (userId) {
            const quizData: InProgressQuiz = {
              topicId,
              currentQuestionIndex: 0,
              userAnswers: initialUserAnswers,
              startTime: Date.now(),
              questionIds: fetchedQuestions.map(q => q.id)
            };
            localStorage.setItem('inProgressQuiz', JSON.stringify(quizData));
          }
        })
        .catch(error => {
          console.error('Error fetching questions:', error);
          setQuestionsError(error instanceof Error ? error : new Error(String(error)));
          setIsQuestionsLoading(false);
        });
    }
  }, [topicId, seenQuestionIds]);

  const currentQuestion = questions[currentQuestionIndex];

  // When component mounts, restore selected answer for current question if available
  useEffect(() => {
    if (userAnswers[currentQuestionIndex] !== undefined) {
      setSelectedAnswer(userAnswers[currentQuestionIndex]);
    } else {
      setSelectedAnswer(null);
    }
  }, [currentQuestionIndex, userAnswers]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    // Update userAnswers array
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(updatedUserAnswers);
    
    // Save progress to localStorage
    if (userId && topicId) {
      const quizData: InProgressQuiz = {
        topicId,
        currentQuestionIndex,
        userAnswers: updatedUserAnswers,
        startTime: Date.now() - 1000, // Approximate start time
        questionIds: questions.map(q => q.id)
      };
      localStorage.setItem('inProgressQuiz', JSON.stringify(quizData));
    }
    
    const isCorrect = currentQuestion.options[answerIndex] === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
  };

  const goToNextQuestion = useCallback(() => {
    if (!currentQuestion) return false;
    
    // Track question detail regardless of whether answer was selected
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
      
      // Quiz is complete, remove in-progress data
      localStorage.removeItem('inProgressQuiz');
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
    userAnswers,
    setQuestionDetails,
    handleAnswerSelect,
    goToNextQuestion,
    resetQuestionState,
    updateSeenQuestions,
    setQuestions
  };
}
