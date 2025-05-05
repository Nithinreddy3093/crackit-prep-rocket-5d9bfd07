
import { useState, useEffect, useRef } from 'react';

export function useQuizTimer(isActive: boolean) {
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const lastPauseTimeRef = useRef<number>(0);

  // Start the timer when quiz becomes active
  useEffect(() => {
    if (isActive) {
      setStartTime(Date.now());
    }
  }, [isActive]);

  // Update elapsed time
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (startTime > 0 && isActive && !isPaused) {
      intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [startTime, isActive, isPaused]);

  // Format time in minutes:seconds
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const resetTimer = () => {
    setStartTime(Date.now());
    setElapsedTime(0);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    if (!isPaused) {
      lastPauseTimeRef.current = Date.now();
      setIsPaused(true);
    }
  };

  const resumeTimer = () => {
    if (isPaused && lastPauseTimeRef.current > 0) {
      // Adjust startTime to account for the pause duration
      const pauseDuration = Date.now() - lastPauseTimeRef.current;
      setStartTime(prevStartTime => prevStartTime + pauseDuration);
      setIsPaused(false);
    }
  };

  return {
    elapsedTime,
    formatTime,
    resetTimer,
    pauseTimer,
    resumeTimer
  };
}
