
import { useState, useEffect, useRef } from 'react';

export const usePollingProgress = (isActive: boolean, intervalMs = 3000) => {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (isActive) {
      // Initialize progress to 10%
      setProgress(10);
      progressRef.current = 10;
      
      // Start progress increment interval
      intervalRef.current = setInterval(() => {
        let newProgress = progressRef.current;
        
        // Enhanced increment logic:
        // - Start at 10%
        // - Increment by +10% until 85%
        // - After 85%, increment by +2% until 99%
        if (newProgress < 85) {
          newProgress += 10;
        } else if (newProgress < 99) {
          newProgress += 2;
        }
        
        // Cap at 99% to prevent going over 100% before completion
        newProgress = Math.min(newProgress, 99);
        
        progressRef.current = newProgress;
        setProgress(newProgress);
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
