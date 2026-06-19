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

export interface ExerciseCatalogItem {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  type: ExerciseType;
  executionTip?: string;
}

export interface Exercise extends ExerciseCatalogItem {
  // dados específicos da execução nesse treino
  sets: number;
  reps: string;
  rest: number;
  load: number | null;
  details?: string;
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