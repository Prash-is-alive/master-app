import { BaseService } from './base.service';
import type { User } from '../schemas/users';
import bcrypt from 'bcryptjs';

/**
 * User service for authentication and user management
 * Extends BaseService with user-specific operations
 */
export class UserService extends BaseService<User> {
  constructor() {
    const usersDbName = process.env.USERS_DB_NAME || '';
    const usersCollectionName = process.env.USERS_COLLECTION_NAME || '';
    
    super(usersDbName, usersCollectionName);
  }

  /**
   * Find user by username
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.findOne({ username } as any);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email } as any);
  }

  /**
   * Create a new user with hashed password
   */
  async createUser(userData: {
    username: string;
    email?: string;
    password: string;
  }): Promise<User> {
    // Check if user already exists
    const existingUser = await this.findByUsername(userData.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Check email if provided
    if (userData.email) {
      const existingEmail = await this.findByEmail(userData.email);
      if (existingEmail) {
        throw new Error('Email already exists');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user: Omit<User, '_id'> = {
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.create(user);
  }

  /**
   * Verify user credentials (login)
   */
  async verifyCredentials(
    username: string,
    password: string
  ): Promise<{ user: Omit<User, 'password'> | null; error?: string }> {
    try {
      // Find user
      const user = await this.findByUsername(username);

      if (!user) {
        return { user: null, error: 'Invalid username or password' };
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return { user: null, error: 'Invalid username or password' };
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return { user: userWithoutPassword };
    } catch (error) {
      console.error('Error verifying credentials:', error);
      return { user: null, error: 'Failed to verify credentials' };
    }
  }

  /**
   * Update user password
   */
  async updatePassword(userId: string, newPassword: string): Promise<boolean> {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const result = await this.updateById(userId, {
        password: hashedPassword,
      } as any);

      return result !== null;
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    }
  }

  /**
   * Get user without password
   */
  getUserWithoutPassword(user: User): Omit<User, 'password'> {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

// Export singleton instance
export const userService = new UserService();

