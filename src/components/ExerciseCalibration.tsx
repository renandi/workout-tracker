import { useStopwatch } from '../hooks/useStopwatch';
import { getCalibratedAverage } from '../utils/workout';
import type { Exercise } from '../types/workout';

interface ExerciseCalibrationProps {
  exercise: Exercise;
  onUpdate: (calibratedSetTimes: number[]) => void;
}

export function ExerciseCalibration({ exercise, onUpdate }: ExerciseCalibrationProps) {
  const { elapsed, running, start, stop, reset } = useStopwatch();
  const times = exercise.calibratedSetTimes ?? [];
  const average = getCalibratedAverage(exercise);

  function handleStop() {
    const seconds = stop();
    if (seconds > 0) onUpdate([...times, seconds]);
    reset();
  }

  return (
    <div className="border border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl p-3 flex flex-col gap-2">
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
            {times.length} set{times.length > 1 ? 's' : ''} calibrado{times.length > 1 ? 's' : ''} · média {average}s
          </span>
          <button onClick={() => onUpdate([])} className="text-red-400 hover:text-red-500 transition-colors">
            Limpar
          </button>
        </div>
      )}
    </div>
  );
}