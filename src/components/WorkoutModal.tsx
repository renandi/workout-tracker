import { useEffect } from 'react';
import { calcTotalTime, formatTime } from '../utils/workout';
import { TypeBadge } from './WorkoutCard';
import type { Workout } from '../types/workout';

interface WorkoutModalProps {
  workout: Workout | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function WorkoutModal({ workout, onClose, onConfirm }: WorkoutModalProps) {
  useEffect(() => {
    if (workout) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [workout]);

  if (!workout) return null;

  const totalSeconds = calcTotalTime(workout);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full bg-white dark:bg-gray-900 rounded-t-2xl p-6 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-9 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-5" />

        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{workout.title}</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Último: {workout.lastDone ?? 'Nunca'}
            </p>
          </div>
          <TypeBadge type={workout.type} />
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          <StatRow label="Exercícios" value={`${workout.exercises.length} itens`} />
          <StatRow label="Tempo estimado" value={formatTime(totalSeconds)} />
        </div>

        <button
          className="w-full mt-5 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 active:scale-95 transition-all"
          onClick={onConfirm}
        >
          Começar agora
        </button>
        <button
          className="w-full mt-2 py-3 text-gray-500 dark:text-gray-400 text-sm"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-3">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{value}</span>
    </div>
  );
}
