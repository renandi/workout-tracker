
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

      {/* Nome */}
      <LabeledInput
        label="Nome"
        type="text"
        placeholder="Nome do exercício"
        value={exercise.name}
        onChange={v => update({ name: v })}
      />

      {/* Modo: reps ou tempo */}
      <div className="flex gap-2">
        {(['reps', 'tempo'] as const).map(t => (
          <button
            key={t}
            onClick={() => update({ type: t })}
            className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              exercise.type === t
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

      {/* Detalhes — texto livre */}
      <LabeledInput
        label="Observações (opcional)"
        type="text"
        placeholder="ex: REST PAUSE, DROP SET..."
        value={exercise.details ?? ''}
        onChange={v => update({ details: v || undefined })}
      />
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  ...rest
}: {
  label: string;
  value: number | string;
  onChange: (v: string) => void; // ← recebe string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>) {
  // Omit é necessário pra evitar conflito com o onChange nativo do input
  return (
    <div className="flex flex-col gap-1 flex-1">
      <label className="text-xs text-gray-400 dark:text-gray-500">{label}</label>
      <input
        {...rest}
        value={value}
        onChange={e => onChange(e.target.value)} // ← extrai o valor aqui
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