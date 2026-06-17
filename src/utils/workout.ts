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

// Tempo médio calibrado por set, ou null se nunca foi calibrado
export function getCalibratedAverage(exercise: Exercise): number | null {
  const times = exercise.calibratedSetTimes;
  if (!times || times.length === 0) return null;
  return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
}

// Estimativa de duração de UM set, em segundos
function estimateSetDuration(exercise: Exercise): number {
  const calibrated = getCalibratedAverage(exercise);
  if (calibrated !== null) return calibrated;

  if (exercise.type === 'tempo') {
    return Number(exercise.reps) || 0;
  }

  // Sem calibração e por reps: estimativa genérica de 2.5s por rep
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
      exercise_id: number; name: string; type: string; sets: number;
      reps: string; rest: number | null; load: number | null; details: string;
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
      muscleGroup: guessMuscleGroup(w.muscle_group),
      sets: ex.sets,
      reps: ex.reps ?? 'X',
      rest: ex.rest ?? DEFAULT_REST,
      load: ex.load,
      details: ex.details || undefined,
    })),
  }));
}

function guessMuscleGroup(group: string): import('../types/workout').MuscleGroup {
  if (group.includes('legs')) return 'Perna';
  if (group.includes('chest')) return 'Peito';
  if (group.includes('back')) return 'Costas';
  if (group.includes('shoulders')) return 'Ombro';
  return 'Corpo todo';
}