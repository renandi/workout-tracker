import { useState } from 'react';
import { WorkoutCard } from '../components/WorkoutCard';
import { CreateWorkoutModal } from '../components/CreateWorkoutModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { UserMenu } from '../components/UserMenu';
import { useUserWorkouts } from '../hooks/useUserWorkouts';
import { useTheme } from '../hooks/useTheme';
import { calcTotalTime, importWorkoutsFromJson } from '../utils/workout';
import type { Workout } from '../types/workout';
import rawWorkouts from '../data/workouts.json';

export function MyWorkouts() {
  const { theme, toggleTheme } = useTheme();
  const { workouts, loading, loggedIn, addWorkout, updateWorkout, removeWorkout, updateExercise, reorderWorkouts } = useUserWorkouts();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Workout | null>(null);
  const [creating, setCreating] = useState(false);
  const [showImportConfirm, setShowImportConfirm] = useState(false);

  function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId) return;
    const fromIndex = workouts.findIndex(w => w.id === draggedId);
    const toIndex = workouts.findIndex(w => w.id === targetId);
    const reordered = [...workouts];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    reorderWorkouts(reordered);
    setDraggedId(null);
  }

  async function handleSave(workout: Workout) {
    if (editing) {
      await updateWorkout(workout.id, { title: workout.title, type: workout.type, exercises: workout.exercises });
    } else {
      await addWorkout({ title: workout.title, type: workout.type, exercises: workout.exercises });
    }
    setEditing(null);
    setCreating(false);
  }

  async function handleImport() {
    const imported = importWorkoutsFromJson(rawWorkouts as any);
    for (const w of imported) {
      await addWorkout({ title: w.title, type: w.type, exercises: w.exercises });
    }
    setShowImportConfirm(false);
  }

  return (
    <main className="p-4 max-w-lg mx-auto pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Meus treinos</h1>
        <div className="flex items-center gap-2">
          <UserMenu />
          <button onClick={toggleTheme} className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Alternar tema">
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            onClick={() => workouts.length > 0 ? setShowImportConfirm(true) : handleImport()}
            className="text-xs px-3 h-10 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Importar
          </button>
          <button onClick={() => setCreating(true)} className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all text-xl leading-none" aria-label="Criar novo treino">
            +
          </button>
        </div>
      </div>

      {!loggedIn && (
        <p className="text-center text-amber-600 dark:text-amber-400 text-xs bg-amber-50 dark:bg-amber-950/30 rounded-lg p-2 mb-4">
          Você não está logado — seus treinos ficam salvos só neste navegador. Entre para sincronizar entre dispositivos.
        </p>
      )}

      {loading && <p className="text-center text-gray-400 dark:text-gray-500 text-sm mt-16">Carregando...</p>}

      {!loading && workouts.length === 0 && (
        <p className="text-center text-gray-400 dark:text-gray-500 text-sm mt-16">
          Nenhum treino ainda. Toque em + para criar.
        </p>
      )}

      {!loading && workouts.map(w => (
        <div
          key={w.id}
          draggable
          onDragStart={() => setDraggedId(w.id)}
          onDragOver={e => e.preventDefault()}
          onDrop={() => handleDrop(w.id)}
          className={draggedId === w.id ? 'opacity-40' : ''}
        >
          <WorkoutCard
            workout={w}
            totalSeconds={calcTotalTime(w)}
            onEdit={() => setEditing(w)}
            onDelete={() => removeWorkout(w.id)}
            onUpdateExercise={(exId, fields) => updateExercise(w.id, exId, fields)}
          />
        </div>
      ))}

      <CreateWorkoutModal
        key={editing?.id ?? 'new'}
        open={!!editing || creating}
        onClose={() => { setEditing(null); setCreating(false); }}
        onSave={handleSave}
        initialData={editing ?? undefined}
      />

      <ConfirmModal
        open={showImportConfirm}
        title="Substituir treinos?"
        description="Isso irá adicionar os treinos importados à sua lista atual. Treinos com o mesmo nome podem duplicar."
        confirmLabel="Sim, importar"
        cancelLabel="Cancelar"
        variant="warning"
        onConfirm={handleImport}
        onCancel={() => setShowImportConfirm(false)}
      />
    </main>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}