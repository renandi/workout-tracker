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

function estimateSetDuration(exercise: Exercise): number {
  // 1. Prioridade: calibração via cronômetro (mais preciso, é medido)
  const calibrated = getCalibratedAverage(exercise);
  if (calibrated !== null) return calibrated;

  // 2. Segunda opção: valor digitado manualmente pelo usuário
  if (exercise.manualSetSeconds !== undefined && exercise.manualSetSeconds > 0) {
    return exercise.manualSetSeconds;
  }

  // 3. Fallback: estimativa automática
  if (exercise.type === 'tempo') {
    return Number(exercise.reps) || 0;
  }
  const repsNumber = parseInt(exercise.reps, 10) || 10;
  return Math.round(repsNumber * 2.5);
}

export function calcTotalTime(workout: Workout): number {
  return workout.exercises.reduce((acc, ex) => {
    const setDuration = estimateSetDuration(ex);
    const totalSetsTime = setDuration * ex.sets;
    const totalRestTime = ex.rest * ex.sets;
    return acc + totalSetsTime + totalRestTime;
  }, 0);
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
