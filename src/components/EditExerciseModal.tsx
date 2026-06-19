import { useState } from 'react';
import { ExerciseCalibration } from './ExerciseCalibration';
import { MuscleGroupBadge } from './MuscleGroupBadge';
import { MUSCLE_GROUPS } from '../types/workout';
import type { Exercise } from '../types/workout';

interface EditExerciseModalProps {
  open: boolean;
  exercise: Exercise;
  onClose: () => void;
  onSave: (fields: Partial<Exercise>) => void;
}

export function EditExerciseModal({ open, exercise, onClose, onSave }: EditExerciseModalProps) {
  const [draft, setDraft] = useState<Exercise>(exercise);

  if (!open) return null;

  function update(fields: Partial<Exercise>) {
    setDraft(prev => ({ ...prev, ...fields }));
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-white dark:bg-gray-900 rounded-t-2xl flex flex-col max-h-[92dvh] animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-5 pt-4 pb-3 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div className="w-9 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Editar exercício</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          <LabeledInput label="Nome" type="text" value={draft.name} onChange={v => update({ name: v })} />

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-400 dark:text-gray-500">Grupo muscular</label>
              <MuscleGroupBadge group={draft.muscleGroup} />
            </div>
            <select
              value={draft.muscleGroup}
              onChange={e => update({ muscleGroup: e.target.value as Exercise['muscleGroup'] })}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            >
              {MUSCLE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div className="flex gap-2">
            <LabeledInput label="Sets" type="number" min={1} value={draft.sets} onChange={v => update({ sets: Number(v) })} />
            <LabeledInput
              label={draft.type === 'tempo' ? 'Duração (seg)' : 'Reps'}
              type={draft.type === 'tempo' ? 'number' : 'text'}
              value={draft.reps}
              onChange={v => update({ reps: v })}
            />
          </div>

          <div className="flex gap-2">
            <LabeledInput label="Descanso (seg)" type="number" min={0} value={draft.rest} onChange={v => update({ rest: Number(v) })} />
            <LabeledInput label="Carga (kg)" type="number" min={0} value={draft.load ?? ''} onChange={v => update({ load: v === '' ? null : Number(v) })} />
          </div>

          <LabeledInput label="Observações" type="text" value={draft.details ?? ''} onChange={v => update({ details: v || undefined })} />

          {/* Calibração e tempo manual — só aparecem aqui no modal de edição */}
          <ExerciseCalibration exercise={draft} onUpdate={update} />
        </div>

        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-2 flex-shrink-0">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            Cancelar
          </button>
          <button
            onClick={() => onSave(draft)}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 active:scale-95 transition-all"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

function LabeledInput({
  label, value, onChange, ...rest
}: {
  label: string;
  value: number | string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>) {
  return (
    <div className="flex flex-col gap-1 flex-1">
      <label className="text-xs text-gray-400 dark:text-gray-500">{label}</label>
      <input
        {...rest}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}