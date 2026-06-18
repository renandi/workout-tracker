import { MUSCLE_GROUPS } from '../types/workout';
import type { MuscleGroup } from '../types/workout';

interface MuscleGroupFilterProps {
  value: MuscleGroup | 'Todos';
  onChange: (value: MuscleGroup | 'Todos') => void;
}

export function MuscleGroupFilter({ value, onChange }: MuscleGroupFilterProps) {
  const options: (MuscleGroup | 'Todos')[] = ['Todos', ...MUSCLE_GROUPS];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            value === opt
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}