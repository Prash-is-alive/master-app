import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSysadmin } from '@/lib/api/sysadmin-auth';

/**
 * GET /api/sysadmin/auth/me
 * Returns the currently authenticated sysadmin, or 401
 */
export async function GET(request: NextRequest) {
  try {
    const admin = await getCurrentSysadmin(request);

    if (!admin) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({ admin });
  } catch (error) {
    console.error('Error fetching sysadmin:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sysadmin' },
      { status: 500 }
    );
  }
}

