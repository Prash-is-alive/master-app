"use client"

import { useState, useEffect } from 'react';
import type { WorkoutLog } from '../types';
import { workoutStorage } from '../services/storage';

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      setIsLoading(true);
      const data = await workoutStorage.getAll();
      setWorkouts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load workouts'));
    } finally {
      setIsLoading(false);
    }
  };

  const addWorkout = async (workout: WorkoutLog) => {
    try {
      const newWorkout = await workoutStorage.create(workout);
      setWorkouts(prev => [newWorkout, ...prev]);
      return newWorkout;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add workout'));
      throw err;
    }
  };

  const updateWorkout = async (workout: WorkoutLog) => {
    try {
      const updated = await workoutStorage.update(workout);
      setWorkouts(prev => prev.map(w => w.id === updated.id ? updated : w));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update workout'));
      throw err;
    }
  };

  const deleteWorkout = async (id: string) => {
    try {
      await workoutStorage.delete(id);
      setWorkouts(prev => prev.filter(w => w.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete workout'));
      throw err;
    }
  };

  return {
    workouts,
    isLoading,
    error,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    refresh: loadWorkouts
  };
}

