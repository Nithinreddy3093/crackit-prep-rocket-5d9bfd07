
import { useState, useEffect, useCallback } from 'react';
import { Question } from "@/services/questionService";
import { QuestionDetail } from './useQuestionNavigation';

export interface QuizLocalStorageData {
  topicId: string;
  questions: Question[];
  currentQuestionIndex: number;
  correctAnswers: number;
  userAnswers: Record<string, number>; // Updated to match new format
  elapsedTime: number;
  questionDetails: QuestionDetail[];
}

export function useQuizLocalStorage(
  topicId: string | undefined,
  quizStarted: boolean,
  quizCompleted: boolean,
  startQuiz: () => void
) {
  const [hasShownContinuePrompt, setHasShownContinuePrompt] = useState(false);

  // Save quiz progress to localStorage
  const saveQuizProgress = useCallback((quizData: QuizLocalStorageData) => {
    if (topicId) {
      const key = `quiz_progress_${topicId}`;
      localStorage.setItem(key, JSON.stringify(quizData));
      
      // Also save a general flag that there's an in-progress quiz
      localStorage.setItem('inProgressQuiz', JSON.stringify({
        topicId: quizData.topicId,
        currentQuestionIndex: quizData.currentQuestionIndex,
        userAnswers: quizData.userAnswers,
        startTime: Date.now() - quizData.elapsedTime,
        questionIds: quizData.questions.map(q => q.id)
      }));
    }
  }, [topicId]);

  // Clear quiz progress from localStorage
  const clearQuizProgress = useCallback(() => {
    if (topicId) {
      const key = `quiz_progress_${topicId}`;
      localStorage.removeItem(key);
      localStorage.removeItem('inProgressQuiz');
    }
  }, [topicId]);

  // Save quiz results to localStorage (for offline storage)
  const saveQuizResults = useCallback((results: any) => {
    localStorage.setItem('lastQuizResults', JSON.stringify(results));
  }, []);

  // Save submitted quiz status to prevent resubmission
  const saveSubmittedQuizStatus = useCallback((topicId: string | undefined) => {
    if (topicId) {
      const submittedQuizzes = JSON.parse(localStorage.getItem('submittedQuizzes') || '[]');
      submittedQuizzes.push({
        topicId,
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem('submittedQuizzes', JSON.stringify(submittedQuizzes));
    }
  }, []);

  // Check if user has an in-progress quiz and prompt to continue
  useEffect(() => {
    if (topicId && !quizStarted && !hasShownContinuePrompt) {
      const key = `quiz_progress_${topicId}`;
      const savedProgress = localStorage.getItem(key);
      
      if (savedProgress) {
        try {
          const progressData: QuizLocalStorageData = JSON.parse(savedProgress);
          if (progressData.currentQuestionIndex > 0) {
            const shouldContinue = window.confirm(
              `You have an incomplete quiz for this topic. Would you like to continue where you left off?`
            );
            
            if (shouldContinue) {
              startQuiz();
            } else {
              clearQuizProgress();
            }
          }
        } catch (e) {
          console.error('Error parsing saved quiz progress:', e);
          clearQuizProgress();
        }
      }
      setHasShownContinuePrompt(true);
    }
  }, [topicId, quizStarted, hasShownContinuePrompt, startQuiz, clearQuizProgress]);

  // Clear progress when quiz is completed
  useEffect(() => {
    if (quizCompleted && topicId) {
      clearQuizProgress();
    }
  }, [quizCompleted, topicId, clearQuizProgress]);

  return {
    saveQuizProgress,
    clearQuizProgress,
    saveQuizResults,
    saveSubmittedQuizStatus
  };
}
