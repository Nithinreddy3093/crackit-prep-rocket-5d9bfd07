
import { useEffect, useState, useCallback, useRef } from 'react';

export function useQuizTimer(isRunning: boolean) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  // Format milliseconds to mm:ss format
  const formatTime = useCallback((milliseconds: number): string => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
    
    return [
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  }, []);

  // Animation frame callback
  const animate = useCallback((time: number) => {
    if (previousTimeRef.current === null) {
      previousTimeRef.current = time;
      startTimeRef.current = time;
    }
    
    const deltaTime = time - previousTimeRef.current;
    previousTimeRef.current = time;
    
    if (!isPaused) {
      setElapsedTime(prevTime => prevTime + deltaTime);
    }
    
    requestRef.current = requestAnimationFrame(animate);
  }, [isPaused]);

  // Start/stop timer based on isRunning prop
  useEffect(() => {
    if (isRunning && !isPaused) {
      requestRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isRunning, animate, isPaused]);

  // Reset timer state
  const resetTimer = useCallback(() => {
    setElapsedTime(0);
    previousTimeRef.current = null;
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
    setIsPaused(false);
  }, []);

  // Pause timer
  const pauseTimer = useCallback(() => {
    if (!isPaused) {
      pausedTimeRef.current = elapsedTime;
      setIsPaused(true);
      
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    }
  }, [elapsedTime, isPaused]);

  // Resume timer
  const resumeTimer = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      previousTimeRef.current = null;
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [isPaused, animate]);

  return {
    elapsedTime,
    formatTime,
    resetTimer,
    pauseTimer,
    resumeTimer
  };
}
