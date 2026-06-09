import { useState } from 'react';
import { WorkoutCard } from './components/WorkoutCard';
import { CreateWorkoutModal } from './components/CreateWorkoutModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { calcTotalTime } from './utils/workout';
import type { Workout } from './types/workout';

import { importWorkoutsFromJson } from './utils/workout';
import rawWorkouts from './data/workouts.json'; // salva o JSON em src/data/workouts.json


export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [workouts, setWorkouts] = useLocalStorage<Workout[]>('workouts', []);
  const [editing, setEditing] = useState<Workout | null>(null);
  const [creating, setCreating] = useState(false);

  function handleImport() {
    const imported = importWorkoutsFromJson(rawWorkouts);
    setWorkouts(imported);
  }

  function handleSave(workout: Workout) {
    setWorkouts(prev => {
      const exists = prev.some(w => w.id === workout.id);
      return exists
        ? prev.map(w => (w.id === workout.id ? workout : w))
        : [...prev, workout];
    });
    setEditing(null);
    setCreating(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors p-4 mx-auto pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Meus treinos</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            onClick={() => setCreating(true)}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all text-xl leading-none"
            aria-label="Criar novo treino"
          >
            +
          </button>
          <button onClick={handleImport} className="text-xs text-gray-400 underline">
            Importar treinos
          </button>
        </div>
      </div>

      {workouts.length === 0 && (
        <p className="text-center text-gray-400 dark:text-gray-500 text-sm mt-16">
          Nenhum treino ainda. Toque em + para criar.
        </p>
      )}

      {workouts.map(w => (
        <WorkoutCard
          key={w.id}
          workout={w}
          totalSeconds={calcTotalTime(w)}
          onEdit={() => setEditing(w)}
          onDelete={() => setWorkouts(prev => prev.filter(x => x.id !== w.id))}
        />
      ))}


      <CreateWorkoutModal
        key={editing?.id ?? 'new'}
        open={!!editing || creating}
        onClose={() => { setEditing(null); setCreating(false); }}
        onSave={handleSave}
        initialData={editing ?? undefined}
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
