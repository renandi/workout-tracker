import { useState } from 'react';
import { ExerciseCalibration } from './ExerciseCalibration';
import { formatTime } from '../utils/workout';
import type { Exercise } from '../types/workout';

interface ExerciseRowProps {
  exercise: Exercise;
  index: number;
  onCalibrate: (times: number[]) => void;
}

export function ExerciseRow({ exercise, index, onCalibrate }: ExerciseRowProps) {
  const [active, setActive] = useState(false);

  return (
    <div className="px-5 py-3 flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {index + 1}. {exercise.name}
          </span>
          <div className="flex gap-3 flex-wrap mt-1">
            <ExercisePill label="Grupo" value={exercise.muscleGroup} />
            <ExercisePill label="Sets" value={String(exercise.sets)} />
            <ExercisePill
              label={exercise.type === 'tempo' ? 'Tempo' : 'Reps'}
              value={exercise.type === 'tempo' ? formatTime(Number(exercise.reps)) : exercise.reps}
            />
            <ExercisePill label="Descanso" value={formatTime(exercise.rest)} />
            {exercise.load && <ExercisePill label="Carga" value={`${exercise.load}kg`} />}
          </div>
        </div>

        {exercise.details && (
          <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full ml-2 shrink-0">
            {exercise.details}
          </span>
        )}
      </div>

      {!active ? (
        <button
          onClick={() => setActive(true)}
          className="self-start text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
        >
          <PlayIcon />
          Iniciar
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <ExerciseCalibration exercise={exercise} onUpdate={onCalibrate} />
          <button
            onClick={() => setActive(false)}
            className="self-start text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
}

function ExercisePill({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-xs text-gray-500 dark:text-gray-400">
      <span className="text-gray-400 dark:text-gray-600">{label}: </span>
      {value}
    </span>
  );
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}