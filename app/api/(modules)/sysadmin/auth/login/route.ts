import { NextRequest, NextResponse } from 'next/server';
import { sysadminService } from '@/lib/db/services/sysadmin.service';
import { AUTH_COOKIES, AUTH_TOKENS, COOKIE_CONFIG } from '@/lib/constants';

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
    response.cookies.set(AUTH_COOKIES.SYSADMIN_TOKEN, AUTH_TOKENS.SYSADMIN_VALID, {
      path: COOKIE_CONFIG.PATH,
      maxAge: COOKIE_CONFIG.EXPIRATION.SYSADMIN,
      httpOnly: COOKIE_CONFIG.HTTP_ONLY,
      sameSite: COOKIE_CONFIG.SAME_SITE,
    });

    if (result.admin._id) {
      response.cookies.set(AUTH_COOKIES.SYSADMIN_ID, String(result.admin._id), {
        path: COOKIE_CONFIG.PATH,
        maxAge: COOKIE_CONFIG.EXPIRATION.SYSADMIN,
        httpOnly: COOKIE_CONFIG.HTTP_ONLY,
        sameSite: COOKIE_CONFIG.SAME_SITE,
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

