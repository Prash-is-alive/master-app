/**
 * Gym Log TOON Service
 * 
 * Module-specific TOON service for gym-log module.
 * Provides methods to convert workout and exercise data to TOON format.
 */

import { ToonService } from '@/lib/services/toon.service';
import type { WorkoutLog } from '../types';

/**
 * Convert workout log data to TOON format
 * Removes all IDs (workout id, userId, exercise ids, set ids) and empty values before encoding
 * @param workout - The workout log to convert
 * @returns TOON formatted string
 */
export function workoutToToon(workout: WorkoutLog): string {
  // Remove all IDs before encoding
  const { id, userId, ...workoutWithoutIds } = workout;
  const exercisesWithoutIds = workout.exercises.map(({ id: exerciseId, ...exercise }) => ({
    ...exercise,
    sets: exercise.sets.map(({ id: setId, ...set }) => set),
  }));

  const cleanedWorkout = {
    ...workoutWithoutIds,
    exercises: exercisesWithoutIds,
  };

  // Remove empty values recursively
  const finalWorkout = removeEmptyValues(cleanedWorkout);

  return ToonService.encode(finalWorkout);
}

/**
 * Convert TOON string back to workout log
 * @param toonString - The TOON formatted string
 * @returns WorkoutLog object
 */
export function toonToWorkout(toonString: string): WorkoutLog {
  return ToonService.decode(toonString) as unknown as WorkoutLog;
}

/**
 * Recursively removes empty values (empty strings, null, undefined, empty arrays) from an object
 */
function removeEmptyValues<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return (obj.trim() === '' ? undefined : obj) as T;
  }

  if (Array.isArray(obj)) {
    const filtered = obj.map(removeEmptyValues).filter((item) => item !== undefined && item !== null);
    return (filtered.length === 0 ? undefined : filtered) as T;
  }

  if (typeof obj === 'object') {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = removeEmptyValues(value);
      if (cleanedValue !== undefined && cleanedValue !== null && cleanedValue !== '') {
        if (Array.isArray(cleanedValue) && cleanedValue.length === 0) {
          continue;
        }
        cleaned[key] = cleanedValue;
      }
    }
    return cleaned as T;
  }

  return obj;
}