import { useState, useEffect, useRef } from 'react';

export const useExamTimer = (
  duration: number,
  onTimeUp: () => void,
  isActive: boolean
) => {
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);
  const timerRef = useRef<number | null>(null);

  // Update time remaining when duration changes
  useEffect(() => {
    if (duration) {
      setTimeRemaining(duration * 60);
    }
  }, [duration]);

  // Start timer
  useEffect(() => {
    if (!isActive) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, onTimeUp]);

  return timeRemaining;
};
