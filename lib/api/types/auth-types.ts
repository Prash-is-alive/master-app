/**
 * Authentication API Types
 * 
 * Type definitions for authentication-related operations
 */

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: {
    _id: string;
    username: string;
    email?: string;
    createdAt: string;
    updatedAt: string;
  };
  error?: string;
  message?: string;
}

export interface RegisterData {
  username: string;
  email?: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  user?: {
    _id: string;
    username: string;
    email?: string;
  };
  error?: string;
}

