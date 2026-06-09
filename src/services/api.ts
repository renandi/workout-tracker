import type { Workout } from '../types/workout';

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export interface LibraryWorkout extends Workout {
  author?: string;
  description?: string;
  likes?: number;
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
  // Biblioteca de treinos
  getWorkouts: () =>
    request<LibraryWorkout[]>('/workouts'),

  getWorkout: (id: string) =>
    request<LibraryWorkout>(`/workouts/${id}`),

  createWorkout: (workout: Omit<LibraryWorkout, 'id'>) =>
    request<LibraryWorkout>('/workouts', {
      method: 'POST',
      body: JSON.stringify(workout),
    }),

  // Rotinas
  getRoutines: () =>
    request<Routine[]>('/routines'),

  createRoutine: (routine: Omit<Routine, 'id'>) =>
    request<Routine>('/routines', {
      method: 'POST',
      body: JSON.stringify(routine),
    }),
};