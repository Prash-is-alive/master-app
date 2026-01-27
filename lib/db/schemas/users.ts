/**
 * User schema for the shared users database
 * Collection: users
 */

export interface User {
  _id?: string;
  username: string;
  email?: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Indexes to create for users collection:
 * - username: unique index
 * - email: unique index (if email is provided)
 */

