import { NextRequest, NextResponse } from 'next/server';
import { requireSysadmin } from '@/lib/api/sysadmin-auth';
import { userService } from '@/lib/db/services';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/sysadmin/users/:id
 * Get a single user by ID (sysadmin only)
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const authResult = await requireSysadmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    const user = await userService.getUserById(id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/sysadmin/users/:id
 * Update a user (sysadmin only)
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const authResult = await requireSysadmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    const { username, email, password } = await request.json();

    // Update password if provided
    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters' },
          { status: 400 }
        );
      }
      await userService.updatePassword(id, password);
    }

    // Update profile fields
    const updateData: { username?: string; email?: string } = {};
    if (username !== undefined) updateData.username = username;
    if (email !== undefined) updateData.email = email;

    if (Object.keys(updateData).length > 0) {
      const updated = await userService.updateUser(id, updateData);

      if (!updated) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(updated);
    }

    // If only password was updated, return updated user
    const user = await userService.getUserById(id);
    return NextResponse.json(user);
  } catch (error: any) {
    console.error('Error updating user:', error);

    if (error.message?.includes('already exists')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/sysadmin/users/:id
 * Delete a user (sysadmin only)
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const authResult = await requireSysadmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;

    const deleted = await userService.deleteUser(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
