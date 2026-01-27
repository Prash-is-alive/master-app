/**
 * Database Services
 * 
 * This module exports all database services for use across the application.
 * Each module can import the services they need without directly handling database operations.
 */

export { BaseService } from './base.service';
export { UserService, userService } from './user.service';

// Export types
export type { User } from '../schemas/users';
export type { WorkoutLog, Exercise, Set } from '../schemas/gym-log';

