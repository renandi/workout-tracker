import type { Workout, Exercise } from '../types/workout';

export const DEFAULT_REST = 60;

export function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return s > 0 ? `${m}min ${s}s` : `${m}min`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h}h ${rem}min` : `${h}h`;
}

export function getCalibratedAverage(exercise: Exercise): number | null {
  const times = exercise.calibratedSetTimes;
  if (!times || times.length === 0) return null;
  return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
}

export function calcExerciseTotalTime(exercise: Exercise): number {
  const setDuration = estimateSetDuration(exercise); // já existe, mas hoje é privada — torna exportável
  const totalSetsTime = setDuration * exercise.sets;
  const totalRestTime = exercise.rest * exercise.sets;
  return totalSetsTime + totalRestTime;
}

// torna exportada (antes era função privada do módulo)
export function estimateSetDuration(exercise: Exercise): number {
  const calibrated = getCalibratedAverage(exercise);
  if (calibrated !== null) return calibrated;

  if (exercise.manualSetSeconds !== undefined && exercise.manualSetSeconds > 0) {
    return exercise.manualSetSeconds;
  }

  if (exercise.type === 'tempo') {
    return Number(exercise.reps) || 0;
  }
  const repsNumber = parseInt(exercise.reps, 10) || 10;
  return Math.round(repsNumber * 2.5);
}

export function calcTotalTime(workout: Workout): number {
  return workout.exercises.reduce((acc, ex) => acc + calcExerciseTotalTime(ex), 0);
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function importWorkoutsFromJson(
  raw: Array<{
    id: number; order: number; letter: string; muscle_group: string;
    exercises: Array<{
      exercise_id: number; name: string; type: string; target_muscle: string;
      sets: number; reps: string; rest: number | null; load: number | null; details: string;
    }>;
  }>
): Workout[] {
  return raw.map(w => ({
    id: generateId(),
    title: `Treino ${w.letter}`,
    type: 'Força' as const,
    letter: w.letter,
    muscle_group: w.muscle_group,
    exercises: w.exercises.map(ex => ({
      id: generateId(),
      name: ex.name,
      type: ex.type === 'tempo' ? 'tempo' as const : 'reps' as const,
      muscleGroup: ex.target_muscle as import('../types/workout').MuscleGroup, // ← vem direto do JSON agora
      sets: ex.sets,
      reps: ex.reps ?? 'X',
      rest: ex.rest ?? DEFAULT_REST,
      load: ex.load,
      details: ex.details || undefined,
    })),
  }));
}
