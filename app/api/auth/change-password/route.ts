import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/api/auth-utils';
import { userService } from '@/lib/db/services';
import bcrypt from 'bcryptjs';

// POST - Change user password
export async function POST(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser(request);
    
    if (!user || !user._id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { oldPassword, newPassword } = await request.json();

    // Validation
    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Old password and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Get user from database to verify old password
    const dbUser = await userService.findById(user._id.toString());
    
    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, dbUser.password);
    
    if (!isOldPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Check if new password is different from old password
    const isSamePassword = await bcrypt.compare(newPassword, dbUser.password);
    
    if (isSamePassword) {
      return NextResponse.json(
        { error: 'New password must be different from current password' },
        { status: 400 }
      );
    }

    // Update password
    const success = await userService.updatePassword(user._id.toString(), newPassword);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    );
  }
}

