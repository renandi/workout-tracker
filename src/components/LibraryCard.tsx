import { useState } from 'react';
import { TypeBadge } from './WorkoutCard';
import { formatTime } from '../utils/workout';
import type { LibraryWorkout } from '../services/api';

interface LibraryCardProps {
  workout: LibraryWorkout;
  totalSeconds: number;
  onAdd: () => void;
}

export function LibraryCard({ workout, totalSeconds, onAdd }: LibraryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    onAdd();
    setAdded(true);
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0 mr-2">
            <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 truncate">
              {workout.title}
            </h3>
            {workout.description && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {workout.description}
              </p>
            )}
            {workout.author && (
              <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">
                por {workout.author}
              </p>
            )}
          </div>
          <TypeBadge type={workout.type} />
        </div>

        <div className="flex gap-4 text-xs text-gray-400 dark:text-gray-500 mb-3">
          <span>{workout.exercises.length} exercícios</span>
          <span>{formatTime(totalSeconds)}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setExpanded(p => !p)}
            className="flex-1 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {expanded ? 'Ocultar' : 'Ver exercícios'}
          </button>
          <button
            onClick={handleAdd}
            disabled={added}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 ${
              added
                ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 cursor-default'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {added ? '✓ Adicionado' : '+ Minha lista'}
          </button>
        </div>
      </div>

      {/* Exercícios expandidos */}
      <div className={`transition-all duration-300 ${expanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
          {workout.exercises.map((ex, i) => (
            <div key={ex.id} className="px-4 py-2.5 flex justify-between items-center">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {i + 1}. {ex.name}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 ml-2">
                {ex.sets}x {ex.reps}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}