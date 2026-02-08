import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/db/services';
import { AUTH_COOKIES, AUTH_TOKENS, COOKIE_CONFIG } from '@/lib/constants';

// POST - Login user
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Use user service to verify credentials
    const result = await userService.verifyCredentials(username, password);

    if (!result.user) {
      return NextResponse.json(
        { error: result.error || 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Create response with user data
    const response = NextResponse.json({
      user: result.user,
      message: 'Login successful',
    });

    // Set authentication cookies
    // auth_token for middleware check
    response.cookies.set(AUTH_COOKIES.USER_TOKEN, AUTH_TOKENS.USER_VALID, {
      path: COOKIE_CONFIG.PATH,
      maxAge: COOKIE_CONFIG.EXPIRATION.USER,
      httpOnly: COOKIE_CONFIG.HTTP_ONLY,
      sameSite: COOKIE_CONFIG.SAME_SITE,
    });

    // user_id for identifying the user
    if (result.user._id) {
      response.cookies.set(AUTH_COOKIES.USER_ID, result.user._id, {
        path: COOKIE_CONFIG.PATH,
        maxAge: COOKIE_CONFIG.EXPIRATION.USER,
        httpOnly: COOKIE_CONFIG.HTTP_ONLY,
        sameSite: COOKIE_CONFIG.SAME_SITE,
      });
    }

    return response;
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}

