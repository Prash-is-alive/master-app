import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/db/services';

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
    response.cookies.set('auth_token', 'valid_token', {
      path: '/',
      maxAge: 86400, // 1 day
      httpOnly: false, // Allow client-side access
      sameSite: 'strict',
    });

    // user_id for identifying the user
    if (result.user._id) {
      response.cookies.set('user_id', result.user._id, {
        path: '/',
        maxAge: 86400, // 1 day
        httpOnly: false, // Allow client-side access
        sameSite: 'strict',
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

