/**
 * Authentication cookie names
 */
export const AUTH_COOKIES = {
  USER_TOKEN: 'auth_token',
  USER_ID: 'user_id',
  SYSADMIN_TOKEN: 'sysadmin_token',
  SYSADMIN_ID: 'sysadmin_id',
} as const;

/**
 * Authentication token values
 */
export const AUTH_TOKENS = {
  USER_VALID: 'valid_token',
  SYSADMIN_VALID: 'sysadmin_valid',
} as const;

/**
 * Application routes
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SYSADMIN: '/sysadmin',
  UNAUTHORIZED: '/unauthorized',
  GYM_LOG: '/gym-log',
  API: '/api',
} as const;

/**
 * API endpoint paths
 */
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    ME: '/api/auth/me',
    CHANGE_PASSWORD: '/api/auth/change-password',
  },
  // User endpoints
  USERS: '/api/users',
  // Sysadmin endpoints
  SYSADMIN: {
    AUTH: {
      LOGIN: '/api/sysadmin/auth/login',
      ME: '/api/sysadmin/auth/me',
    },
    USERS: '/api/sysadmin/users',
  },
  // Gym log endpoints
  GYM_LOG: {
    WORKOUTS: '/api/gym-log/workouts',
  },
} as const;

/**
 * Cookie configuration
 */
export const COOKIE_CONFIG = {
  PATH: '/',
  SAME_SITE: 'strict' as const,
  HTTP_ONLY: false,
  // Cookie expiration times (in seconds)
  EXPIRATION: {
    USER: 86400, // 1 day
    SYSADMIN: 3600, // 1 hour
  },
} as const;

/**
 * Cookie deletion value (for clearing cookies)
 */
export const COOKIE_DELETE_VALUE = '; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';

