
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
  userAnswers: Record<string, number>; // Changed to object with question_id as key
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
  // Changed to track answers by question ID to prevent duplicates
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});

  const currentQuestion = questions[currentQuestionIndex];

  // Initialize user answers when questions change
  useEffect(() => {
    if (questions.length > 0) {
      setUserAnswers({});
      setCorrectAnswers(0);
      setQuestionDetails([]);
    }
  }, [questions]);

  // When current question changes, restore selected answer if exists
  useEffect(() => {
    if (currentQuestion && userAnswers[currentQuestion.id] !== undefined) {
      setSelectedAnswer(userAnswers[currentQuestion.id]);
    } else {
      setSelectedAnswer(null);
    }
  }, [currentQuestionIndex, userAnswers, currentQuestion]);

  // Restore progress from localStorage
  useEffect(() => {
    if (userId && topicId) {
      const inProgressQuiz = localStorage.getItem('inProgressQuiz');
      if (inProgressQuiz) {
        try {
          const quizData: InProgressQuiz = JSON.parse(inProgressQuiz);
          if (quizData.topicId === topicId) {
            console.log('Restoring in-progress quiz:', quizData);
            setCurrentQuestionIndex(quizData.currentQuestionIndex);
            setUserAnswers(quizData.userAnswers || {});
            
            // Recalculate correct answers from stored data
            let correct = 0;
            questions.forEach(q => {
              if (quizData.userAnswers[q.id] !== undefined) {
                const userAnswerText = q.options[quizData.userAnswers[q.id]];
                if (userAnswerText === q.correctAnswer) {
                  correct++;
                }
              }
            });
            setCorrectAnswers(correct);
          }
        } catch (e) {
          console.error('Error parsing in-progress quiz:', e);
        }
      }
    }
  }, [userId, topicId, questions]);

  const handleAnswerSelect = useCallback((answerIndex: number) => {
    if (!currentQuestion) return;
    
    setSelectedAnswer(answerIndex);
    
    // Update userAnswers with question ID as key
    const previousAnswer = userAnswers[currentQuestion.id];
    const updatedUserAnswers = {
      ...userAnswers,
      [currentQuestion.id]: answerIndex
    };
    setUserAnswers(updatedUserAnswers);
    
    // Calculate correct answers accurately
    const isCorrect = currentQuestion.options[answerIndex] === currentQuestion.correctAnswer;
    const wasCorrectBefore = previousAnswer !== undefined && 
      currentQuestion.options[previousAnswer] === currentQuestion.correctAnswer;
    
    let newCorrectCount = correctAnswers;
    if (isCorrect && !wasCorrectBefore) {
      newCorrectCount = correctAnswers + 1;
    } else if (!isCorrect && wasCorrectBefore) {
      newCorrectCount = correctAnswers - 1;
    }
    setCorrectAnswers(newCorrectCount);
    
    // Save progress to localStorage
    if (userId && topicId) {
      const quizData: InProgressQuiz = {
        topicId,
        currentQuestionIndex,
        userAnswers: updatedUserAnswers,
        startTime: Date.now() - 1000,
        questionIds: questions.map(q => q.id)
      };
      localStorage.setItem('inProgressQuiz', JSON.stringify(quizData));
    }
    
    console.log('Answer selected:', {
      questionId: currentQuestion.id,
      answerIndex,
      isCorrect,
      totalCorrect: newCorrectCount,
      userAnswers: updatedUserAnswers
    });
  }, [currentQuestion, currentQuestionIndex, questions, topicId, userId, userAnswers, correctAnswers]);

  const goToNextQuestion = useCallback(() => {
    if (!currentQuestion) return false;
    
    // Only track question detail if not already tracked
    const existingDetailIndex = questionDetails.findIndex(d => d.questionId === currentQuestion.id);
    const userAnswerText = selectedAnswer !== null ? currentQuestion.options[selectedAnswer] : '';
    const isCorrect = selectedAnswer !== null && currentQuestion.options[selectedAnswer] === currentQuestion.correctAnswer;
    
    const detail: QuestionDetail = {
      questionId: currentQuestion.id,
      question: currentQuestion.text,
      userAnswer: userAnswerText,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect
    };
    
    // Update or add question detail
    let updatedDetails;
    if (existingDetailIndex >= 0) {
      updatedDetails = [...questionDetails];
      updatedDetails[existingDetailIndex] = detail;
    } else {
      updatedDetails = [...questionDetails, detail];
    }
    setQuestionDetails(updatedDetails);
    
    console.log('Question completed:', {
      questionId: currentQuestion.id,
      userAnswer: userAnswerText,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      totalQuestionDetails: updatedDetails.length
    });
    
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
          startTime: Date.now() - ((nextIndex + 1) * 30 * 1000),
          questionIds: questions.map(q => q.id)
        };
        localStorage.setItem('inProgressQuiz', JSON.stringify(quizData));
      }
      
      return false;
    } else {
      return true;
    }
  }, [currentQuestionIndex, questions.length, selectedAnswer, currentQuestion, userAnswers, userId, topicId, questionDetails]);

  const resetQuestionState = useCallback(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setCorrectAnswers(0);
    setQuestionDetails([]);
    setUserAnswers({});
    localStorage.removeItem('inProgressQuiz');
    
    console.log('Quiz state reset');
  }, []);

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
