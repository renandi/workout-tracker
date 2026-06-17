import { useState } from 'react';
import { useStopwatch } from '../hooks/useStopwatch';
import { getCalibratedAverage, formatTime } from '../utils/workout';
import type { Exercise } from '../types/workout';

interface ExerciseCalibrationProps {
  exercise: Exercise;
  onUpdate: (calibratedSetTimes: number[]) => void;
}

export function ExerciseCalibration({ exercise, onUpdate }: ExerciseCalibrationProps) {
  const [open, setOpen] = useState(false);
  const { elapsed, running, start, stop, reset } = useStopwatch();
  const times = exercise.calibratedSetTimes ?? [];
  const average = getCalibratedAverage(exercise);

  function handleStop() {
    const seconds = stop();
    if (seconds > 0) {
      onUpdate([...times, seconds]);
    }
    reset();
  }

  function clearCalibration() {
    onUpdate([]);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
      >
        <TimerIcon />
        {average !== null ? `Calibrado: ${formatTime(average)}/set` : 'Calibrar tempo'}
      </button>
    );
  }

  return (
    <div className="border border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl p-3 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
          Calibração de tempo
        </span>
        <button
          onClick={() => setOpen(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <CloseIcon />
        </button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Inicie o cronômetro junto com o set e pare ao terminar. Repita por alguns sets para uma média mais precisa.
      </p>

      <div className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-lg px-3 py-2">
        <span className="text-lg font-mono text-gray-800 dark:text-gray-200">
          {elapsed.toFixed(1)}s
        </span>
        {!running ? (
          <button
            onClick={start}
            className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-blue-700 active:scale-95 transition-all"
          >
            Iniciar set
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-red-600 active:scale-95 transition-all"
          >
            Parar
          </button>
        )}
      </div>

      {times.length > 0 && (
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>
            {times.length} set{times.length > 1 ? 's' : ''} calibrado{times.length > 1 ? 's' : ''} ·
            média {average}s
          </span>
          <button
            onClick={clearCalibration}
            className="text-red-400 hover:text-red-500 transition-colors"
          >
            Limpar
          </button>
        </div>
      )}
    </div>
  );
}

function TimerIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2 2M9 1h6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}