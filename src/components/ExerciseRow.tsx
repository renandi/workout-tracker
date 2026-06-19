// src/components/ExerciseRow.tsx
import { useState } from 'react';
import { ExerciseCalibration } from './ExerciseCalibration';
import { formatTime } from '../utils/workout';
import type { Exercise } from '../types/workout';
import { MuscleGroupBadge } from './MuscleGroupBadge';

interface ExerciseRowProps {
  exercise: Exercise;
  index: number;
  onCalibrate: (fields: Partial<Exercise>) => void;
}

export function ExerciseRow({ exercise, index, onCalibrate }: ExerciseRowProps) {
  const [active, setActive] = useState(false);

  return (
    <div className="px-5 py-3 flex flex-col gap-2">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {index + 1}. {exercise.name}
          </span>
          <div className="flex gap-3 flex-wrap mt-1">
            <MuscleGroupBadge group={exercise.muscleGroup} />
            <ExercisePill label="Sets" value={String(exercise.sets)} />
            <ExercisePill
              label={exercise.type === 'tempo' ? 'Tempo' : 'Reps'}
              value={exercise.type === 'tempo' ? formatTime(Number(exercise.reps)) : exercise.reps}
            />
            <ExercisePill label="Descanso" value={formatTime(exercise.rest)} />
            {exercise.load && <ExercisePill label="Carga" value={`${exercise.load}kg`} />}
            {exercise.details && <ExercisePill label="Obs" value={exercise.details} />}
          </div>
        </div>

        <button
          onClick={() => setActive(p => !p)}
          className={`text-xs font-medium transition-colors flex items-center gap-1 shrink-0 ${active
              ? 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
            }`}
        >
          {active ? 'Fechar' : <><PlayIcon /> Iniciar</>}
        </button>
      </div>

      {active && (
        <ExerciseCalibration exercise={exercise} onUpdate={onCalibrate} />)}
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