import { useState } from 'react';
import { ExerciseCalibration } from './ExerciseCalibration';
import { MuscleGroupBadge } from './MuscleGroupBadge';
import { MUSCLE_GROUPS } from '../types/workout';
import type { Exercise } from '../types/workout';

interface ExerciseFormProps {
  exercise: Exercise;
  index: number;
  onChange: (updated: Exercise) => void;
  onRemove: () => void;
}

export function ExerciseForm({ exercise, index, onChange, onRemove }: ExerciseFormProps) {
  function update(fields: Partial<Exercise>) {
    onChange({ ...exercise, ...fields });
  }

  return (
    <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
          Exercício {index + 1}
        </span>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Remover exercício"
        >
          <TrashIcon />
        </button>
      </div>

      <LabeledInput
        label="Nome"
        type="text"
        placeholder="Nome do exercício"
        value={exercise.name}
        onChange={v => update({ name: v })}
      />

      {/* Tag de grupo muscular — select + preview do badge */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-400 dark:text-gray-500">Grupo muscular</label>
          <MuscleGroupBadge group={exercise.muscleGroup} />
        </div>
        <select
          value={exercise.muscleGroup}
          onChange={e => update({ muscleGroup: e.target.value as Exercise['muscleGroup'] })}
          className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        >
          {MUSCLE_GROUPS.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        {(['reps', 'tempo'] as const).map(t => (
          <button
            key={t}
            onClick={() => update({ type: t })}
            className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${exercise.type === t
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-blue-300'
              }`}
          >
            {t === 'reps' ? 'Por reps' : 'Por tempo'}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <LabeledInput
          label="Sets"
          type="number"
          min={1}
          value={exercise.sets}
          onChange={v => update({ sets: Number(v) })}
        />
        <LabeledInput
          label={exercise.type === 'tempo' ? 'Duração (seg)' : 'Reps'}
          type={exercise.type === 'tempo' ? 'number' : 'text'}
          placeholder={exercise.type === 'reps' ? 'ex: 6-9 ou X' : ''}
          min={exercise.type === 'tempo' ? 1 : undefined}
          value={exercise.reps}
          onChange={v => update({ reps: v })}
        />
      </div>

      <div className="flex gap-2">
        <LabeledInput
          label="Descanso (seg)"
          type="number"
          min={0}
          value={exercise.rest}
          onChange={v => update({ rest: Number(v) })}
        />
        <LabeledInput
          label="Carga (kg)"
          type="number"
          min={0}
          placeholder="—"
          value={exercise.load ?? ''}
          onChange={v => update({ load: v === '' ? null : Number(v) })}
        />
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          Tempo estimado por set será usado no cálculo da duração total
        </span>
        <InfoTooltip text="Você pode calibrar o tempo real cronometrando um set, ou deixar o app estimar automaticamente com base nas reps." />
      </div>

      <LabeledInput
        label="Observações (opcional)"
        type="text"
        placeholder="ex: REST PAUSE, DROP SET..."
        value={exercise.details ?? ''}
        onChange={v => update({ details: v || undefined })}
      />

      <ExerciseCalibration
        exercise={exercise}
        onUpdate={fields => update(fields)}
      />
    </div>
  );
}

function InfoTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setShow(p => !p)}
        onBlur={() => setShow(false)}
        className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[10px] font-bold flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        aria-label="Mais informações"
      >
        ?
      </button>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded-lg p-2 shadow-lg z-10">
          {text}
        </span>
      )}
    </span>
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
        className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-600"
      />
    </div>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}