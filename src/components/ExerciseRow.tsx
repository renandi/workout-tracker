import { useState } from 'react';
import { MuscleGroupBadge } from './MuscleGroupBadge';
import { RestTimer } from './RestTimer';
import { EditExerciseModal } from './EditExerciseModal';
import { useRestTimer } from '../hooks/useRestTimer';
import { usePreferences } from '../hooks/usePreferences';
import { notifyRestComplete } from '../utils/notify';
import { formatTime, calcExerciseTotalTime } from '../utils/workout';
import type { Exercise } from '../types/workout';

interface ExerciseRowProps {
  exercise: Exercise;
  index: number;
  onUpdate: (fields: Partial<Exercise>) => void;
}

export function ExerciseRow({ exercise, index, onUpdate }: ExerciseRowProps) {
  const [active, setActive] = useState(false);
  const [completedSets, setCompletedSets] = useState(0);
  const [editing, setEditing] = useState(false);
  const { preferences } = usePreferences();
  const { secondsLeft, running, start, stop } = useRestTimer(() => notifyRestComplete(preferences));

  const totalSeconds = calcExerciseTotalTime(exercise);

  function handleFinishSet() {
    const next = completedSets + 1;
    setCompletedSets(next);
    if (next < exercise.sets) {
      start(exercise.rest);
    }
  }

  function resetProgress() {
    setCompletedSets(0);
    stop();
  }

  return (
    <div className="px-5 py-3 flex flex-col gap-2">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {index + 1}. {exercise.name}
            </span>
            <MuscleGroupBadge group={exercise.muscleGroup} />
          </div>
          <div className="flex gap-3 flex-wrap mt-1">
            <ExercisePill label="Sets" value={String(exercise.sets)} />
            <ExercisePill
              label={exercise.type === 'tempo' ? 'Tempo' : 'Reps'}
              value={exercise.type === 'tempo' ? formatTime(Number(exercise.reps)) : exercise.reps}
            />
            <ExercisePill label="Descanso" value={formatTime(exercise.rest)} />
            {exercise.load && <ExercisePill label="Carga" value={`${exercise.load}kg`} />}
            {exercise.details && <ExercisePill label="Obs" value={exercise.details} />}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Estimativa total: {formatTime(totalSeconds)}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Botão discreto de editar */}
          <button
            onClick={() => setEditing(true)}
            className="text-gray-300 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            aria-label="Editar exercício"
          >
            <PencilIcon />
          </button>

          <button
            onClick={() => { setActive(p => !p); if (active) resetProgress(); }}
            className={`text-xs font-medium transition-colors flex items-center gap-1 ${
              active
                ? 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
            }`}
          >
            {active ? 'Fechar' : <><PlayIcon /> Iniciar</>}
          </button>
        </div>
      </div>

      {active && (
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Set {Math.min(completedSets + 1, exercise.sets)} de {exercise.sets}
            </span>
            {!running && completedSets < exercise.sets && (
              <button
                onClick={handleFinishSet}
                className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-green-700 active:scale-95 transition-all"
              >
                Terminei o set
              </button>
            )}
            {completedSets >= exercise.sets && (
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                Exercício concluído ✓
              </span>
            )}
          </div>

          {running && (
            <RestTimer secondsLeft={secondsLeft} totalSeconds={exercise.rest} onSkip={stop} />
          )}
        </div>
      )}

      <EditExerciseModal
        open={editing}
        exercise={exercise}
        onClose={() => setEditing(false)}
        onSave={fields => { onUpdate(fields); setEditing(false); }}
      />
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

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}