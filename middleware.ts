import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIES = {
  USER_TOKEN: 'auth_token',
  USER_ID: 'user_id',
  SYSADMIN_TOKEN: 'sysadmin_token',
  SYSADMIN_ID: 'sysadmin_id',
} as const;

const ROUTES = {
  LOGIN: '/login',
  HOME: '/',
  SYSADMIN: '/sysadmin',
  UNAUTHORIZED: '/unauthorized',
  API: '/api',
} as const;

interface AuthCookies {
  authToken?: string;
  userId?: string;
  sysadminToken?: string;
  sysadminId?: string;
}

interface RouteChecks {
  isLoginPage: boolean;
  isApiRoute: boolean;
  isSysadminRoute: boolean;
  isUnauthorizedPage: boolean;
  isHomePage: boolean;
}

function getAuthCookies(request: NextRequest): AuthCookies {
  return {
    authToken: request.cookies.get(AUTH_COOKIES.USER_TOKEN)?.value,
    userId: request.cookies.get(AUTH_COOKIES.USER_ID)?.value,
    sysadminToken: request.cookies.get(AUTH_COOKIES.SYSADMIN_TOKEN)?.value,
    sysadminId: request.cookies.get(AUTH_COOKIES.SYSADMIN_ID)?.value,
  };
}

function getRouteChecks(pathname: string): RouteChecks {
  return {
    isLoginPage: pathname === ROUTES.LOGIN,
    isApiRoute: pathname.startsWith(ROUTES.API),
    isSysadminRoute: pathname.startsWith(ROUTES.SYSADMIN),
    isUnauthorizedPage: pathname === ROUTES.UNAUTHORIZED,
    isHomePage: pathname === ROUTES.HOME,
  };
}

function createRedirect(request: NextRequest, path: string): NextResponse {
  const url = new URL(path, request.url);
  return NextResponse.redirect(url);
}

function hasUserAuth(cookies: AuthCookies): boolean {
  return Boolean(cookies.authToken && cookies.userId);
}

function hasSysadminAuth(cookies: AuthCookies): boolean {
  return Boolean(cookies.sysadminToken && cookies.sysadminId);
}

/**
 * Authentication middleware that enforces role-based access control.
 * 
 * Flow:
 * - API routes and /unauthorized page pass through without checks
 * - Sysadmin routes (/sysadmin/*) block regular users, allow sysadmin users
 * - Regular routes block sysadmin users (except home page which redirects them to /sysadmin)
 * - Unauthenticated regular users redirect to /login
 * - Authenticated regular users on /login redirect to home page
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookies = getAuthCookies(request);
  const routes = getRouteChecks(pathname);

  if (routes.isApiRoute || routes.isUnauthorizedPage) {
    return NextResponse.next();
  }

  if (routes.isSysadminRoute) {
    if (hasUserAuth(cookies)) {
      return createRedirect(
        request,
        ROUTES.UNAUTHORIZED
      );
    }
    return NextResponse.next();
  }

  if (routes.isHomePage && hasSysadminAuth(cookies)) {
    return createRedirect(request, ROUTES.SYSADMIN);
  }

  if (hasSysadminAuth(cookies) && !routes.isHomePage) {
    return createRedirect(
      request,
      ROUTES.UNAUTHORIZED
    );
  }

  if (!hasUserAuth(cookies) && !routes.isLoginPage) {
    return createRedirect(request, ROUTES.LOGIN);
  }

  if (hasUserAuth(cookies) && routes.isLoginPage) {
    return createRedirect(request, ROUTES.HOME);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};