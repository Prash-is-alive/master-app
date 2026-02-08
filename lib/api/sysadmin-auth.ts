import { NextRequest, NextResponse } from 'next/server';
import { sysadminService } from '@/lib/db/services/sysadmin.service';
import type { Sysadmin } from '@/lib/db/schemas/sysadmin';

const COOKIE_NAME = 'sysadmin_token';
const COOKIE_ID = 'sysadmin_id';
const TOKEN_VALUE = 'sysadmin_valid';

/**
 * Get the current authenticated sysadmin from the request.
 * Returns null if not authenticated as sysadmin.
 */
export async function getCurrentSysadmin(
  request: NextRequest
): Promise<Omit<Sysadmin, 'password'> | null> {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const adminId = request.cookies.get(COOKIE_ID)?.value;

    if (token !== TOKEN_VALUE || !adminId) {
      return null;
    }

    const admin = await sysadminService.findById(adminId);

    if (!admin) return null;

    const { password: _, ...adminWithoutPassword } = admin;
    return adminWithoutPassword;
  } catch (error) {
    console.error('Error getting current sysadmin:', error);
    return null;
  }
}

/**
 * Guard helper – returns a 401 response if the request
 * is not from an authenticated sysadmin.
 */
export async function requireSysadmin(
  request: NextRequest
): Promise<Omit<Sysadmin, 'password'> | NextResponse> {
  const admin = await getCurrentSysadmin(request);

  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized – sysadmin access required' },
      { status: 401 }
    );
  }

  return admin;
}

/**
 * Cookie config constants – exported so login route can use them.
 */
export { COOKIE_NAME, COOKIE_ID, TOKEN_VALUE };

