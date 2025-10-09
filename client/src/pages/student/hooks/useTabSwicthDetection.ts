import { useEffect, useRef, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';

export const useTabSwitchDetection = (
  onMaxSwitches: () => void,
  maxSwitches: number = 1
) => {
  const toast = useToast();
  const tabSwitchCountRef = useRef(0);

  const onMaxSwitchesRef = useRef(onMaxSwitches);
  onMaxSwitchesRef.current = onMaxSwitches;

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      tabSwitchCountRef.current++;
      const newCount = tabSwitchCountRef.current;
      toast({
        title: 'Security Warning',
        description: `Tab switch detected. Violation count: ${newCount} of ${maxSwitches}.`,
        status: 'warning',
        position: 'top',
        duration: 5000,
        isClosable: true,
      });

      if (newCount >= maxSwitches) {
        onMaxSwitchesRef.current();
      }
    }
  }, [maxSwitches, toast]);

  useEffect(() => {
    tabSwitchCountRef.current = 0;

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange]);
};
