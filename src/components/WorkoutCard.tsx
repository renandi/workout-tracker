import { formatTime } from '../utils/workout';
import type { Workout } from '../types/workout';
import { useState } from 'react';

const TYPE_STYLES: Record<Workout['type'], { bg: string; text: string }> = {
  Força:  { bg: 'bg-red-100 dark:bg-red-900/30',    text: 'text-red-800 dark:text-red-400'    },
  HIIT:   { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-800 dark:text-orange-400' },
  Cardio: { bg: 'bg-blue-100 dark:bg-blue-900/30',   text: 'text-blue-800 dark:text-blue-400'   },
  Yoga:   { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-800 dark:text-purple-400' },
};

export function TypeBadge({ type }: { type: Workout['type'] }) {
  const styles = TYPE_STYLES[type];
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles.bg} ${styles.text}`}>
      {type}
    </span>
  );
}


interface WorkoutCardProps {
  workout: Workout;
  totalSeconds: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function WorkoutCard({ workout, totalSeconds, onEdit, onDelete }: WorkoutCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow mb-3 overflow-hidden">
      {/* Cabeçalho — sempre visível */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{workout.title}</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Último: {workout.lastDone ?? 'Nunca'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TypeBadge type={workout.type} />
            <button
              onClick={onEdit}
              className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              aria-label="Editar treino"
            >
              <PencilIcon />
            </button>
            <button
              onClick={onDelete}
              className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              aria-label="Excluir treino"
            >
              <TrashIcon />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-5">
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
              <ListIcon />
              Exercícios
            </span>
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {workout.exercises.length} itens
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
              <ClockIcon />
              Tempo estimado
            </span>
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {formatTime(totalSeconds)}
            </span>
          </div>
        </div>

        <button
          className="w-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 py-2 rounded-lg font-medium hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors active:scale-95 flex items-center justify-center gap-2"
          onClick={() => setExpanded(prev => !prev)}
          aria-expanded={expanded}
        >
          {expanded ? 'Ocultar treino' : 'Mostrar treino'}
          <ChevronIcon expanded={expanded} />
        </button>
      </div>

      {/* Lista de exercícios — expande/colapsa */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          expanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
          {workout.exercises.map((ex, i) => (
            <div key={ex.id} className="px-5 py-3 flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {i + 1}. {ex.name}
                </span>
                {ex.details && (
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full ml-2 shrink-0">
                    {ex.details}
                  </span>
                )}
              </div>
              <div className="flex gap-3 flex-wrap">
                <ExercisePill label="Sets" value={String(ex.sets)} />
                <ExercisePill
                  label={ex.type === 'tempo' ? 'Tempo' : 'Reps'}
                  value={ex.type === 'tempo' ? formatTime(Number(ex.reps)) : ex.reps}
                />
                <ExercisePill label="Descanso" value={formatTime(ex.rest)} />
                {ex.load && <ExercisePill label="Carga" value={`${ex.load}kg`} />}
              </div>
            </div>
          ))}
        </div>
      </div>
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

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}
