
import { useState, useEffect } from 'react';

export function useQuizTimer(isActive: boolean) {
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Start the timer when quiz becomes active
  useEffect(() => {
    if (isActive) {
      setStartTime(Date.now());
    }
  }, [isActive]);

  // Update elapsed time
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (startTime > 0 && isActive) {
      intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [startTime, isActive]);

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
  };

  return {
    elapsedTime,
    formatTime,
    resetTimer
  };
}
