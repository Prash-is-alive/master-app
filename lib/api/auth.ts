/**
 * Authentication API Client
 * 
 * Client-side utility for authentication operations
 * Provides a clean interface for login, logout, and user management
 */

import type {
  LoginCredentials,
  LoginResponse,
  RegisterData,
  RegisterResponse,
} from './types/auth-types';
import { AUTH_COOKIES, AUTH_TOKENS, COOKIE_DELETE_VALUE, ROUTES, API_ENDPOINTS } from '@/lib/constants';

/**
 * Login user
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Login failed',
      };
    }

    // Cookies are set by the server in the response
    // No need to set them manually on client side

    return {
      success: true,
      user: data.user,
      message: data.message || 'Login successful',
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Network error. Please try again.',
    };
  }
}

/**
 * Register new user
 */
export async function register(data: RegisterData): Promise<RegisterResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.USERS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Registration failed',
      };
    }

    return {
      success: true,
      user: result,
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: 'Network error. Please try again.',
    };
  }
}

/**
 * Logout user
 */
export function logout(): void {
  // Clear all auth cookies
  document.cookie = `${AUTH_COOKIES.USER_TOKEN}=${COOKIE_DELETE_VALUE}`;
  document.cookie = `${AUTH_COOKIES.USER_ID}=${COOKIE_DELETE_VALUE}`;
  globalThis.window.location.href = ROUTES.LOGIN;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (globalThis.window === undefined) return false;
  
  const cookies = globalThis.document.cookie.split(';');
  const authCookie = cookies.find(cookie => 
    cookie.trim().startsWith(`${AUTH_COOKIES.USER_TOKEN}=`)
  );
  
  return authCookie?.includes(AUTH_TOKENS.USER_VALID) || false;
}

