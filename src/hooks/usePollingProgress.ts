import { useState, useEffect, useRef } from 'react';

export const usePollingProgress = (isActive: boolean, intervalMs = 3000) => {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (isActive) {
      // Initialize progress
      setProgress(10);
      progressRef.current = 10;
      
      // Start progress increment interval
      intervalRef.current = setInterval(() => {
        progressRef.current = Math.min(progressRef.current + 5, 85);
        setProgress(progressRef.current);
      }, intervalMs);
    } else {
      // Reset progress when not active
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setProgress(0);
      progressRef.current = 0;
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, intervalMs]);
  
  return progress;
};