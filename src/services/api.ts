import type { Exercise, MuscleGroup, Workout } from '../types/workout';

// const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';
const BASE_URL = import.meta.env.DEV
  ? 'http://localhost:3001/api'
  : '/api';

export interface LibraryWorkout extends Workout {
  author?: string;
  authorAvatar?: string | null; // novo, opcional
  description?: string;
  likes?: number;
}

export interface LibraryExercise extends Exercise {
  description?: string;
}

export interface Routine {
  id: string;
  name: string;
  description?: string;
  workoutIds: string[];
  author?: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getWorkouts: () => request<LibraryWorkout[]>('/workouts'),
  getWorkout: (id: string) => request<LibraryWorkout>(`/workouts/${id}`),
  createWorkout: (workout: Omit<LibraryWorkout, 'id'>) =>
    request<LibraryWorkout>('/workouts', { method: 'POST', body: JSON.stringify(workout) }),

  getExercises: () => request<LibraryExercise[]>('/exercises'),

  getRoutines: () => request<Routine[]>('/routines'),
  createRoutine: (routine: Omit<Routine, 'id'>) =>
    request<Routine>('/routines', { method: 'POST', body: JSON.stringify(routine) }),
};

export function filterByMuscleGroup<T extends { muscleGroup?: MuscleGroup }>(
  items: T[],
  group: MuscleGroup | 'Todos'
): T[] {
  if (group === 'Todos') return items;
  return items.filter(i => i.muscleGroup === group);
}


/* SUPABASE */
import { supabase } from '../lib/supabase';
// import type { Workout } from '../types/workout';

export async function publishWorkout(workout: Workout, userId: string, description?: string) {
  const { data: libWorkout, error } = await supabase
    .from('library_workouts')
    .insert({
      author_id: userId,
      title: workout.title,
      type: workout.type,
      description,
    })
    .select()
    .single();

  if (error) throw error;

  const exercisesPayload = workout.exercises.map((ex, i) => ({
    workout_id: libWorkout.id,
    name: ex.name,
    type: ex.type,
    muscle_group: ex.muscleGroup,
    sets: ex.sets,
    reps: ex.reps,
    rest: ex.rest,
    load: ex.load,
    details: ex.details,
    position: i,
  }));

  const { error: exError } = await supabase
    .from('library_workout_exercises')
    .insert(exercisesPayload);

  if (exError) throw exError;

  return libWorkout;
}

export async function publishExercise(exercise: Workout['exercises'][number], userId: string) {
  const { data, error } = await supabase
    .from('library_exercises')
    .insert({
      author_id: userId,
      name: exercise.name,
      type: exercise.type,
      muscle_group: exercise.muscleGroup,
      sets: exercise.sets,
      reps: exercise.reps,
      rest: exercise.rest,
      load: exercise.load,
      details: exercise.details,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}