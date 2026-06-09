import { useState } from 'react';
import { ExerciseForm } from './ExerciseForm';
import { generateId } from '../utils/workout';
import type { Workout, Exercise } from '../types/workout';

const WORKOUT_TYPES = ['Força', 'HIIT', 'Cardio', 'Yoga'] as const;
const DEFAULT_REST = 60; // segundos

function makeExercise(): Exercise {
  return {
    id: generateId(),
    name: '',
    type: 'reps',
    sets: 3,
    reps: '8-12',
    rest: DEFAULT_REST,
    load: null,
  };
}

interface CreateWorkoutModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (workout: Workout) => void;
  initialData?: Workout;
}

export function CreateWorkoutModal({ open, onClose, onSave, initialData }: CreateWorkoutModalProps) {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [type, setType] = useState<Workout['type']>(initialData?.type ?? 'Força');
  const [exercises, setExercises] = useState<Exercise[]>(initialData?.exercises ?? [makeExercise()]);

  const isEditing = !!initialData;

  function handleSave() {
    if (!title.trim() || exercises.length === 0) return;
    onSave({
      id: initialData?.id ?? generateId(),
      title: title.trim(),
      type,
      exercises,
      lastDone: initialData?.lastDone,
    });
    onClose();
  }

  function updateExercise(index: number, updated: Exercise) {
    setExercises(prev => prev.map((ex, i) => (i === index ? updated : ex)));
  }

  function removeExercise(index: number) {
    setExercises(prev => prev.filter((_, i) => i !== index));
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-end"
      onClick={onClose}
    >
      <div
        className="w-full bg-white dark:bg-gray-900 rounded-t-2xl flex flex-col max-h-[92dvh] animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header fixo */}
        <div className="px-5 pt-4 pb-3 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div className="w-9 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4" />
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {isEditing ? 'Editar treino' : 'Novo treino'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nome do treino"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />

          <div className="flex gap-2 flex-wrap">
            {WORKOUT_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  type === t
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {exercises.map((ex, i) => (
              <ExerciseForm
                key={ex.id}
                exercise={ex}
                index={i}
                onChange={updated => updateExercise(i, updated)}
                onRemove={() => removeExercise(i)}
              />
            ))}
          </div>

          <button
            onClick={() => setExercises(prev => [...prev, makeExercise()])}
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-sm text-gray-400 dark:text-gray-500 hover:border-blue-300 hover:text-blue-500 transition-colors"
          >
            + Adicionar exercício
          </button>
        </div>

        {/* Footer fixo */}
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
          <button
            onClick={handleSave}
            disabled={!title.trim() || exercises.length === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            {isEditing ? 'Salvar alterações' : 'Salvar treino'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
