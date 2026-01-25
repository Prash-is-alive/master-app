export interface Set {
  id: string;
  weight: number;
  reps: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  notes?: string;
}

export interface WorkoutLog {
  id: string;
  date: string;
  day: string;
  exercises: Exercise[];
}

