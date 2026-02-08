import { NextRequest, NextResponse } from 'next/server';
import { requireSysadmin } from '@/lib/api/sysadmin-auth';
import { userService } from '@/lib/db/services';

/**
 * GET /api/sysadmin/users
 * List all users (sysadmin only)
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireSysadmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const users = await userService.getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sysadmin/users
 * Create a new user (sysadmin only)
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireSysadmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const { username, email, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const user = await userService.createUser({ username, email, password });
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);

    if (error.message?.includes('already exists')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
