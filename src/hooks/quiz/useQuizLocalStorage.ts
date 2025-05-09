
import { useEffect, useRef } from 'react';
import { toast } from "@/components/ui/use-toast";

export interface QuizLocalStorageData {
  topicId: string | undefined;
  questions: any[];
  currentQuestionIndex: number;
  correctAnswers: number;
  userAnswers: (number | null)[];
  elapsedTime: number;
  questionDetails: {
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
}

export function useQuizLocalStorage(
  topicId: string | undefined,
  quizStarted: boolean,
  quizCompleted: boolean,
  startQuiz: () => void
) {
  const hasCheckedStorage = useRef(false);

  // Check if there's a saved quiz in localStorage to restore
  useEffect(() => {
    // Prevent multiple checks/toasts during re-renders
    if (hasCheckedStorage.current) return;
    hasCheckedStorage.current = true;

    const savedResults = localStorage.getItem('lastQuizResults');
    if (savedResults && quizCompleted) {
      try {
        // There are saved results that weren't submitted
        toast({
          title: "Unsubmitted Quiz Results",
          description: "You have quiz results that weren't submitted. You can find them in your dashboard.",
          variant: "default",
        });
      } catch (error) {
        console.error('Error parsing saved results:', error);
      }
    }
    
    // Check for any in-progress quiz when component mounts
    const inProgressQuiz = localStorage.getItem('inProgressQuiz');
    if (inProgressQuiz && !quizStarted && !quizCompleted) {
      try {
        const quizData = JSON.parse(inProgressQuiz);
        if (quizData.topicId === topicId) {
          // Show toast only once
          toast({
            title: "Quiz in Progress",
            description: "Continuing your in-progress quiz.",
            variant: "default",
          });
          
          // Automatically start the quiz after a short delay
          setTimeout(() => startQuiz(), 500);
        } else {
          // Clear if topic doesn't match
          localStorage.removeItem('inProgressQuiz');
        }
      } catch (error) {
        console.error('Error parsing in-progress quiz:', error);
        localStorage.removeItem('inProgressQuiz');
      }
    }
  }, [quizStarted, quizCompleted, topicId, startQuiz]);

  const saveQuizProgress = (data: QuizLocalStorageData) => {
    localStorage.setItem('inProgressQuiz', JSON.stringify(data));
  };

  const clearQuizProgress = () => {
    localStorage.removeItem('inProgressQuiz');
    localStorage.removeItem('lastQuizResults');
  };

  const saveQuizResults = (data: any) => {
    localStorage.setItem('lastQuizResults', JSON.stringify({
      ...data,
      timestamp: new Date().toISOString()
    }));
  };

  const saveSubmittedQuizStatus = (topicId: string | undefined) => {
    localStorage.removeItem('lastQuizResults');
    localStorage.removeItem('inProgressQuiz');
    localStorage.setItem('lastSubmittedQuiz', JSON.stringify({
      topicId,
      timestamp: new Date().toISOString()
    }));
  };

  return {
    saveQuizProgress,
    clearQuizProgress,
    saveQuizResults,
    saveSubmittedQuizStatus
  };
}
