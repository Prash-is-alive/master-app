/**
 * Gym Log module database schema
 * Database: gym-log
 * Collections: workout_logs
 */

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
  _id?: string;
  id: string;
  userId: string;
  date: string;
  day: string;
  exercises: Exercise[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Indexes to create for workout_logs collection:
 * - id: unique index
 * - date: descending index for sorting
 * - createdAt: descending index
 */

