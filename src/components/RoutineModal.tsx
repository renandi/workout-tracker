import { useState } from 'react';
// import { generateId } from '../utils/workout';
import type { LibraryWorkout, Routine } from '../services/api';

interface RoutineModalProps {
  open: boolean;
  workouts: LibraryWorkout[];
  onClose: () => void;
  onSave: (routine: Omit<Routine, 'id'>) => Promise<void>;
}

export function RoutineModal({ open, workouts, onClose, onSave }: RoutineModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  function toggleWorkout(id: string) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  async function handleSave() {
    if (!name.trim() || selected.length === 0) return;
    setSaving(true);
    try {
      await onSave({ name: name.trim(), description: description.trim() || undefined, workoutIds: selected });
      setName('');
      setDescription('');
      setSelected([]);
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-white dark:bg-gray-900 rounded-t-2xl flex flex-col max-h-[92dvh] animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-5 pt-4 pb-3 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div className="w-9 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Nova rotina</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nome da rotina"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <input
            type="text"
            placeholder="Descrição (opcional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />

          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
            Selecione os treinos
          </p>

          {workouts.map(w => (
            <button
              key={w.id}
              onClick={() => toggleWorkout(w.id)}
              className={`w-full flex justify-between items-center p-3 rounded-xl border transition-colors text-left ${
                selected.includes(w.id)
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {w.title}
              </span>
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                selected.includes(w.id)
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {selected.includes(w.id) && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                    stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </span>
            </button>
          ))}
        </div>

        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
          <button
            onClick={handleSave}
            disabled={!name.trim() || selected.length === 0 || saving}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            {saving ? 'Salvando...' : `Criar rotina (${selected.length} treinos)`}
          </button>
        </div>
      </div>
    </div>
  );
}