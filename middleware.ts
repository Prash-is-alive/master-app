import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Check for the authentication cookie
  const authToken = request.cookies.get('auth_token')?.value;

  // 2. Define the paths that are protected vs public
  const isLoginPage = request.nextUrl.pathname === '/login';
  
  // 3. Logic: If NO token and NOT on login page -> Redirect to Login
  if (!authToken && !isLoginPage) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Logic: If token EXISTS and User is on login page -> Redirect to Dashboard
  if (authToken && isLoginPage) {
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