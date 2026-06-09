import { useState, useEffect } from 'react';
import { api, type LibraryWorkout, type Routine } from '../services/api';
import { LibraryCard } from '../components/LibraryCard';
import { RoutineModal } from '../components/RoutineModal';
import { calcTotalTime } from '../utils/workout';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Workout } from '../types/workout';

type Tab = 'treinos' | 'rotinas';

export function Library() {
  const [tab, setTab] = useState<Tab>('treinos');
  const [workouts, setWorkouts] = useState<LibraryWorkout[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingRoutine, setCreatingRoutine] = useState(false);
  const [, setMyWorkouts] = useLocalStorage<Workout[]>('workouts', []);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [ws, rs] = await Promise.all([api.getWorkouts(), api.getRoutines()]);
        setWorkouts(ws);
        setRoutines(rs);
      } catch {
        setError('Não foi possível carregar a biblioteca.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleAddToCollection(workout: LibraryWorkout) {
    setMyWorkouts(prev => {
      const already = prev.some(w => w.id === workout.id);
      if (already) return prev;
      return [...prev, workout];
    });
  }

  return (
    <main className="p-4 max-w-lg mx-auto pb-24">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Biblioteca</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        {(['treinos', 'rotinas'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              tab === t
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading && (
        <p className="text-center text-gray-400 dark:text-gray-500 text-sm mt-16">
          Carregando...
        </p>
      )}

      {error && (
        <p className="text-center text-red-400 text-sm mt-16">{error}</p>
      )}

      {!loading && !error && tab === 'treinos' && (
        <div className="flex flex-col gap-3">
          {workouts.length === 0 && (
            <p className="text-center text-gray-400 dark:text-gray-500 text-sm mt-16">
              Nenhum treino na biblioteca ainda.
            </p>
          )}
          {workouts.map(w => (
            <LibraryCard
              key={w.id}
              workout={w}
              totalSeconds={calcTotalTime(w)}
              onAdd={() => handleAddToCollection(w)}
            />
          ))}
        </div>
      )}

      {!loading && !error && tab === 'rotinas' && (
        <div className="flex flex-col gap-3">
          {routines.length === 0 && (
            <p className="text-center text-gray-400 dark:text-gray-500 text-sm mt-16">
              Nenhuma rotina ainda.
            </p>
          )}
          {routines.map(r => (
            <div
              key={r.id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4"
            >
              <h3 className="font-medium text-gray-900 dark:text-gray-100">{r.name}</h3>
              {r.description && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{r.description}</p>
              )}
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                {r.workoutIds.length} treinos
              </p>
            </div>
          ))}
          <button
            onClick={() => setCreatingRoutine(true)}
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-sm text-gray-400 dark:text-gray-500 hover:border-blue-300 hover:text-blue-500 transition-colors"
          >
            + Criar rotina
          </button>
        </div>
      )}

      <RoutineModal
        open={creatingRoutine}
        workouts={workouts}
        onClose={() => setCreatingRoutine(false)}
        onSave={async (routine) => {
          await api.createRoutine(routine);
          const updated = await api.getRoutines();
          setRoutines(updated);
          setCreatingRoutine(false);
        }}
      />
    </main>
  );
}