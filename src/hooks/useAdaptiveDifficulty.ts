import { useState, useCallback } from 'react';

type Difficulty = 'beginner' | 'intermediate' | 'advanced';

interface PerformanceTracker {
  correct: number;
  total: number;
  recentAnswers: boolean[];
}

export const useAdaptiveDifficulty = (initialDifficulty: Difficulty = 'beginner') => {
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>(initialDifficulty);
  const [performance, setPerformance] = useState<PerformanceTracker>({
    correct: 0,
    total: 0,
    recentAnswers: [],
  });

  const trackAnswer = useCallback((isCorrect: boolean) => {
    setPerformance(prev => {
      const recentAnswers = [...prev.recentAnswers, isCorrect].slice(-5);
      const correct = prev.correct + (isCorrect ? 1 : 0);
      const total = prev.total + 1;

      // Adjust difficulty based on recent performance
      if (total >= 3) {
        const recentCorrect = recentAnswers.filter(a => a).length;
        const recentTotal = recentAnswers.length;
        const recentAccuracy = recentCorrect / recentTotal;

        if (recentAccuracy >= 0.8 && currentDifficulty !== 'advanced') {
          // User is doing well, increase difficulty
          if (currentDifficulty === 'beginner') {
            setCurrentDifficulty('intermediate');
          } else {
            setCurrentDifficulty('advanced');
          }
        } else if (recentAccuracy <= 0.4 && currentDifficulty !== 'beginner') {
          // User is struggling, decrease difficulty
          if (currentDifficulty === 'advanced') {
            setCurrentDifficulty('intermediate');
          } else {
            setCurrentDifficulty('beginner');
          }
        }
      }

      return {
        correct,
        total,
        recentAnswers,
      };
    });
  }, [currentDifficulty]);

  const reset = useCallback(() => {
    setCurrentDifficulty(initialDifficulty);
    setPerformance({
      correct: 0,
      total: 0,
      recentAnswers: [],
    });
  }, [initialDifficulty]);

  return {
    currentDifficulty,
    trackAnswer,
    reset,
    accuracy: performance.total > 0 ? (performance.correct / performance.total) * 100 : 0,
  };
};
