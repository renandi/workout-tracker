export type ExerciseType = 'reps' | 'tempo';

export type MuscleGroup =
  | 'Peito' | 'Costas' | 'Ombro' | 'Bíceps' | 'Tríceps'
  | 'Antebraço' | 'Perna' | 'Glúteo' | 'Panturrilha'
  | 'Abdômen' | 'Cardio' | 'Corpo todo';

export const MUSCLE_GROUPS: MuscleGroup[] = [
  'Peito', 'Costas', 'Ombro', 'Bíceps', 'Tríceps',
  'Antebraço', 'Perna', 'Glúteo', 'Panturrilha',
  'Abdômen', 'Cardio', 'Corpo todo',
];

export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  muscleGroup: MuscleGroup;
  sets: number;
  reps: string;
  rest: number;
  load: number | null;
  details?: string;
  // Tempo médio por set, em segundos — pode vir de calibração (cronômetro) OU manual
  manualSetSeconds?: number;
  calibratedSetTimes?: number[];
}

export interface Workout {
  id: string;
  title: string;
  type: 'Força' | 'HIIT' | 'Cardio' | 'Yoga';
  letter?: string;
  muscle_group?: string;
  exercises: Exercise[];
  lastDone?: string;
}