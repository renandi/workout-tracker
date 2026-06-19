import { useState, useRef, useCallback, useEffect } from 'react';

export function useRestTimer(onComplete?: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  function start(seconds: number) {
    clear();
    setSecondsLeft(seconds);
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clear();
          setRunning(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function stop() {
    clear();
    setRunning(false);
    setSecondsLeft(0);
  }

  useEffect(() => clear, [clear]);

  return { secondsLeft, running, start, stop };
}