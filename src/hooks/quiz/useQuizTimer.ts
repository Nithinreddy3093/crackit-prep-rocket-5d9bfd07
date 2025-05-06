
import { useEffect, useState, useCallback, useRef } from 'react';

export function useQuizTimer(isRunning: boolean) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const elapsedTimeRef = useRef<number>(0);

  // Format milliseconds to mm:ss format - memoized to avoid recreations
  const formatTime = useCallback((milliseconds: number): string => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
    
    return [
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  }, []);

  // Animation frame callback - optimized to use refs for better performance
  const animate = useCallback((time: number) => {
    if (previousTimeRef.current === null) {
      previousTimeRef.current = time;
      startTimeRef.current = time;
    }
    
    const deltaTime = time - previousTimeRef.current;
    previousTimeRef.current = time;
    
    if (!isPaused) {
      elapsedTimeRef.current += deltaTime;
      setElapsedTime(elapsedTimeRef.current);
    }
    
    requestRef.current = requestAnimationFrame(animate);
  }, [isPaused]);

  // Start/stop timer based on isRunning prop - optimized with better cleanup
  useEffect(() => {
    if (isRunning && !isPaused) {
      requestRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (requestRef.current !== null) {
          cancelAnimationFrame(requestRef.current);
          requestRef.current = null;
        }
      };
    }
    
    // Make sure to clean up on unmount even if not running
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };
  }, [isRunning, animate, isPaused]);

  // Reset timer state - optimized to update refs directly
  const resetTimer = useCallback(() => {
    setElapsedTime(0);
    elapsedTimeRef.current = 0;
    previousTimeRef.current = null;
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
    setIsPaused(false);
    
    // Cancel any existing animation frame
    if (requestRef.current !== null) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
  }, []);

  // Pause timer - optimized
  const pauseTimer = useCallback(() => {
    if (!isPaused) {
      pausedTimeRef.current = elapsedTimeRef.current;
      setIsPaused(true);
      
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    }
  }, [isPaused]);

  // Resume timer - optimized
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
