import { useState, useEffect } from 'react';

interface QuizProgress {
  topicId: string;
  currentQuestionIndex: number;
  answers: Record<number, string>;
  startTime: number;
  mode: 'practice' | 'exam';
}

export const useQuizProgress = (topicId: string) => {
  const STORAGE_KEY = `quiz_progress_${topicId}`;

  const loadProgress = (): QuizProgress | null => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    
    try {
      const progress = JSON.parse(saved) as QuizProgress;
      // Check if progress is less than 24 hours old
      const age = Date.now() - progress.startTime;
      if (age > 24 * 60 * 60 * 1000) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return progress;
    } catch {
      return null;
    }
  };

  const saveProgress = (progress: Partial<QuizProgress>) => {
    const current = loadProgress() || {
      topicId,
      currentQuestionIndex: 0,
      answers: {},
      startTime: Date.now(),
      mode: 'practice' as const,
    };
    
    const updated = { ...current, ...progress };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const clearProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    loadProgress,
    saveProgress,
    clearProgress,
  };
};
