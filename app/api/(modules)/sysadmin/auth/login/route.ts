import { NextRequest, NextResponse } from 'next/server';
import { sysadminService } from '@/lib/db/services/sysadmin.service';
import { COOKIE_NAME, COOKIE_ID, TOKEN_VALUE } from '@/lib/api/sysadmin-auth';

/**
 * POST /api/sysadmin/auth/login
 * Authenticate as a sysadmin (root) user
 */
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const result = await sysadminService.verifyCredentials(username, password);

    if (!result.admin) {
      return NextResponse.json(
        { error: result.error || 'Invalid credentials' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      admin: result.admin,
      message: 'Sysadmin login successful',
    });

    // Set sysadmin-specific cookies (separate from regular auth)
    response.cookies.set(COOKIE_NAME, TOKEN_VALUE, {
      path: '/',
      maxAge: 3600, // 1 hour – short-lived for security
      httpOnly: false,
      sameSite: 'strict',
    });

    if (result.admin._id) {
      response.cookies.set(COOKIE_ID, String(result.admin._id), {
        path: '/',
        maxAge: 3600,
        httpOnly: false,
        sameSite: 'strict',
      });
    }

    return response;
  } catch (error) {
    console.error('Sysadmin login error:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate' },
      { status: 500 }
    );
  }
}

