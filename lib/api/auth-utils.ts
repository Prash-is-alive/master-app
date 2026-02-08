import { NextRequest } from 'next/server';
import { userService } from '@/lib/db/services';
import type { User } from '@/lib/db/schemas/users';
import { AUTH_COOKIES, AUTH_TOKENS } from '@/lib/constants';

/**
 * Get the current authenticated user from the request
 * Returns null if user is not authenticated
 */
export async function getCurrentUser(request: NextRequest): Promise<Omit<User, 'password'> | null> {
  try {
    // Get auth token from cookie
    const authToken = request.cookies.get(AUTH_COOKIES.USER_TOKEN)?.value;
    
    if (!authToken || authToken !== AUTH_TOKENS.USER_VALID) {
      return null;
    }

    // Get userId from user_id cookie (set during login)
    const userId = request.cookies.get(AUTH_COOKIES.USER_ID)?.value;
    
    if (!userId) {
      return null;
    }

    // Fetch user from database
    const user = await userService.findById(userId);
    
    if (!user) {
      return null;
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(request: NextRequest): boolean {
  const authToken = request.cookies.get(AUTH_COOKIES.USER_TOKEN)?.value;
  const userId = request.cookies.get(AUTH_COOKIES.USER_ID)?.value;
  return authToken === AUTH_TOKENS.USER_VALID && !!userId;
}

