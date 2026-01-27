import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Check for the authentication cookie and user ID
  const authToken = request.cookies.get('auth_token')?.value;
  const userId = request.cookies.get('user_id')?.value;

  // 2. Define the paths that are protected vs public
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  
  // 3. Logic: If NO token/userId and NOT on login page -> Redirect to Login
  // Skip API routes - they handle their own authentication
  if ((!authToken || !userId) && !isLoginPage && !isApiRoute) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Logic: If token EXISTS and User is on login page -> Redirect to Dashboard
  if (authToken && userId && isLoginPage) {
    const dashboardUrl = new URL('/', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // 5. Allow the request to proceed if no conditions met
  return NextResponse.next();
}

// 6. Config: Matcher ensures middleware runs on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};