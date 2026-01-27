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
  userId?: string; // User ID - workouts are user-specific
  date: string;
  day: string;
  exercises: Exercise[];
}

