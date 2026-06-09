import type { Workout, Exercise } from '../types/workout';

export const DEFAULT_REST = 60; // segundos

export function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return s > 0 ? `${m}min ${s}s` : `${m}min`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h}h ${rem}min` : `${h}h`;
}

export function calcTotalTime(workout: Workout): number {
  return workout.exercises.reduce((acc, ex) => {
    // só conta tempo se for tipo 'tempo' (isométrico, etc.)
    const exTime = ex.type === 'tempo' ? (Number(ex.reps) || 0) * ex.sets : 0;
    const restTime = ex.rest * ex.sets;
    return acc + exTime + restTime;
  }, 0);
}

export function generateId(): string {
  return crypto.randomUUID();
}

// Converte o JSON externo pro formato interno do app
export function importWorkoutsFromJson(
  raw: Array<{
    id: number;
    order: number;
    letter: string;
    muscle_group: string;
    exercises: Array<{
      exercise_id: number;
      name: string;
      type: string;
      sets: number;
      reps: string;
      rest: number | null;
      load: number | null;
      details: string;
    }>;
  }>
): Workout[] {
  return raw.map(w => ({
    id: generateId(),
    title: `Treino ${w.letter}`,
    type: muscleGroupToType(w.muscle_group),
    letter: w.letter,
    muscle_group: w.muscle_group,
    exercises: w.exercises.map(ex => ({
      id: generateId(),
      name: ex.name,
      type: ex.type === 'tempo' ? 'tempo' : 'reps',
      sets: ex.sets,
      reps: ex.reps ?? 'X',
      rest: ex.rest ?? DEFAULT_REST,
      load: ex.load,
      details: ex.details || undefined,
    })),
  }));
}

function muscleGroupToType(group: string): Workout['type'] {
  if (group.includes('legs')) return 'Força';
  if (group.includes('chest') || group.includes('back')) return 'Força';
  if (group.includes('shoulders')) return 'Força';
  return 'Força'; // padrão — ajusta se quiser mapeamento diferente
}