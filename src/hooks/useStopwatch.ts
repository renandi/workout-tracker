import { useState, useRef, useCallback } from 'react';

export function useStopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const startRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    if (startRef.current === null) return;
    setElapsed((Date.now() - startRef.current) / 1000);
    frameRef.current = requestAnimationFrame(tick);
  }, []);

  function start() {
    startRef.current = Date.now() - elapsed * 1000;
    setRunning(true);
    frameRef.current = requestAnimationFrame(tick);
  }

  function stop(): number {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    setRunning(false);
    const finalValue = startRef.current ? (Date.now() - startRef.current) / 1000 : elapsed;
    setElapsed(finalValue);
    return Math.round(finalValue);
  }

  function reset() {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    setElapsed(0);
    setRunning(false);
    startRef.current = null;
  }

  return { elapsed, running, start, stop, reset };
}