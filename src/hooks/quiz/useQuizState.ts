
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { generateUniqueQuestionsForSession } from "@/services/questionService";
import { toast } from "@/components/ui/use-toast";

export function useQuizState() {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const completeQuiz = () => {
    setQuizCompleted(true);
  };

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
