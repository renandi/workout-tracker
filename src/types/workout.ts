export type ExerciseType = 'reps' | 'tempo';

export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  sets: number;
  reps: string;        // string pra aceitar "6-9", "X", "21", "60"
  rest: number;        // segundos — padrão 60 se vier null
  load: number | null; // kg — null até o usuário preencher
  details?: string;    // texto livre, só exibição
}

export interface Workout {
  id: string;
  title: string;
  type: 'Força' | 'HIIT' | 'Cardio' | 'Yoga';
  letter?: string;        // A, B, C...
  muscle_group?: string;  // legs, chest_and_triceps...
  exercises: Exercise[];
  lastDone?: string;
}