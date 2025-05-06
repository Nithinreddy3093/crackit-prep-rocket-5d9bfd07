
import { useState } from 'react';

export function useQuizState() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  // Start the quiz
  const startQuiz = () => {
    setQuizStarted(true);
    setQuizCompleted(false);
  };
  
  // Complete the quiz
  const completeQuiz = () => {
    setQuizCompleted(true);
  };
  
  // Reset the quiz state
  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
  };
  
  return {
    quizStarted,
    quizCompleted,
    startQuiz,
    completeQuiz,
    resetQuiz
  };
}
