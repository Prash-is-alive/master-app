import type { WorkoutLog } from '../types';

/**
 * Storage service interface for workout logs
 * Now uses MongoDB database via API routes
 */
export interface WorkoutStorage {
  getAll(): Promise<WorkoutLog[]>;
  getById(id: string): Promise<WorkoutLog | null>;
  create(workout: WorkoutLog): Promise<WorkoutLog>;
  update(workout: WorkoutLog): Promise<WorkoutLog>;
  delete(id: string): Promise<void>;
}

/**
 * Database service implementation
 * Uses API routes to interact with MongoDB
 */
class DatabaseService implements WorkoutStorage {
  private readonly baseUrl = '/api/gym-log/workouts';

  async getAll(): Promise<WorkoutLog[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) throw new Error('Failed to fetch workouts');
      return await response.json();
    } catch (error) {
      console.error('Error loading workouts:', error);
      return [];
    }
  }

  async getById(id: string): Promise<WorkoutLog | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch workout');
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading workout:', error);
      return null;
    }
  }

  async create(workout: WorkoutLog): Promise<WorkoutLog> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workout),
      });
      if (!response.ok) throw new Error('Failed to create workout');
      return await response.json();
    } catch (error) {
      console.error('Error creating workout:', error);
      throw error;
    }
  }

  async update(workout: WorkoutLog): Promise<WorkoutLog> {
    try {
      const response = await fetch(`${this.baseUrl}/${workout.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workout),
      });
      if (!response.ok) throw new Error('Failed to update workout');
      return await response.json();
    } catch (error) {
      console.error('Error updating workout:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete workout');
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const workoutStorage: WorkoutStorage = new DatabaseService();

