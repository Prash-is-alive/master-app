import type { WorkoutLog } from '../types';

/**
 * Storage service interface for workout logs
 * Currently uses localStorage, but can be easily swapped for a database
 */
export interface WorkoutStorage {
  getAll(): Promise<WorkoutLog[]>;
  getById(id: string): Promise<WorkoutLog | null>;
  create(workout: WorkoutLog): Promise<WorkoutLog>;
  update(workout: WorkoutLog): Promise<WorkoutLog>;
  delete(id: string): Promise<void>;
}

/**
 * LocalStorage implementation
 * In the future, replace this with a database service
 */
class LocalStorageService implements WorkoutStorage {
  private readonly key = 'gym-workouts';

  async getAll(): Promise<WorkoutLog[]> {
    if (typeof window === 'undefined') return [];
    
    try {
      const item = window.localStorage.getItem(this.key);
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error('Error loading workouts from localStorage:', error);
      return [];
    }
  }

  async getById(id: string): Promise<WorkoutLog | null> {
    const workouts = await this.getAll();
    return workouts.find(w => w.id === id) || null;
  }

  async create(workout: WorkoutLog): Promise<WorkoutLog> {
    const workouts = await this.getAll();
    const updated = [workout, ...workouts];
    await this.save(updated);
    return workout;
  }

  async update(workout: WorkoutLog): Promise<WorkoutLog> {
    const workouts = await this.getAll();
    const updated = workouts.map(w => w.id === workout.id ? workout : w);
    await this.save(updated);
    return workout;
  }

  async delete(id: string): Promise<void> {
    const workouts = await this.getAll();
    const updated = workouts.filter(w => w.id !== id);
    await this.save(updated);
  }

  private async save(workouts: WorkoutLog[]): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      window.localStorage.setItem(this.key, JSON.stringify(workouts));
    } catch (error) {
      console.error('Error saving workouts to localStorage:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const workoutStorage: WorkoutStorage = new LocalStorageService();

