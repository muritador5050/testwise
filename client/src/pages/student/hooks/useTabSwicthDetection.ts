import { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

export const useTabSwitchDetection = (
  onMaxSwitches: () => void,
  maxSwitches: number = 3
) => {
  const toast = useToast();

  useEffect(() => {
    let tabSwitchCount = 0;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchCount++;
        toast({
          title: 'Warning',
          description: `Tab switch detected (${tabSwitchCount})`,
          status: 'warning',
          position: 'top',
          duration: 3000,
        });

        if (tabSwitchCount >= maxSwitches) {
          onMaxSwitches();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [onMaxSwitches, maxSwitches, toast]);
};
