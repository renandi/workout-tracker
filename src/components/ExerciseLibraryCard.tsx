import { formatTime } from '../utils/workout';
import type { LibraryExercise } from '../services/api';

interface ExerciseLibraryCardProps {
  exercise: LibraryExercise;
  selected: boolean;
  onToggle: () => void;
}

export function ExerciseLibraryCard({ exercise, selected, onToggle }: ExerciseLibraryCardProps) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex justify-between items-center p-3 rounded-xl border transition-colors text-left ${
        selected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900'
      }`}
    >
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{exercise.name}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          {exercise.muscleGroup} · {exercise.sets}x {exercise.reps}
          {exercise.type === 'tempo' ? ` (${formatTime(Number(exercise.reps))})` : ''}
        </p>
      </div>
      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
        selected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-600'
      }`}>
        {selected && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
    </button>
  );
}