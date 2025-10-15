import { useState, useEffect, useRef } from 'react';
import { useGetRemainingTime } from '../../../api/services/attemptService';

export const useExamTimer = (
  attemptId: number,
  onTimeUp: () => void,
  enabled: boolean
) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const timerRef = useRef<number | null>(null);
  const hasCalledTimeUp = useRef(false);

  // Fetch remaining time from server
  const { data: timeData, isSuccess } = useGetRemainingTime(attemptId);

  // Initialize timer with server time
  useEffect(() => {
    if (isSuccess && timeData?.remainingTime !== undefined) {
      setTimeRemaining(timeData.remainingTime);
    }
  }, [isSuccess, timeData]);

  // Countdown timer
  useEffect(() => {
    if (!enabled || timeRemaining <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (!hasCalledTimeUp.current) {
            hasCalledTimeUp.current = true;
            onTimeUp();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [enabled, timeRemaining, onTimeUp]);

  return timeRemaining;
};
