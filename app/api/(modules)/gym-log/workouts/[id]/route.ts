import { NextRequest, NextResponse } from 'next/server';
import { getModuleDb } from '@/lib/db/mongodb';
import { getCurrentUser } from '@/lib/api/auth-utils';
import type { WorkoutLog } from '@/lib/db/schemas/gym-log';

// GET single workout
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get current user
    const user = await getCurrentUser(request);
    
    if (!user || !user._id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const db = await getModuleDb('gym-log');
    const workout = await db
      .collection<WorkoutLog>('workout_logs')
      .findOne({ id, userId: user._id }); // Filter by user ID

    if (!workout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...workout,
      _id: workout._id?.toString(),
    });
  } catch (error) {
    console.error('Error fetching workout:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workout' },
      { status: 500 }
    );
  }
}

// PUT update workout
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get current user
    const user = await getCurrentUser(request);
    
    if (!user || !user._id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    // First verify the workout belongs to the user
    const db = await getModuleDb('gym-log');
    const existingWorkout = await db
      .collection<WorkoutLog>('workout_logs')
      .findOne({ id, userId: user._id });

    if (!existingWorkout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    const workout: Omit<WorkoutLog, 'userId' | 'createdAt'> = await request.json();

    // Update workout (ensure userId cannot be changed)
    const result = await db.collection('workout_logs').updateOne(
      { id, userId: user._id }, // Ensure user owns the workout
      {
        $set: {
          ...workout,
          userId: user._id, // Prevent userId from being changed
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    // Fetch updated workout
    const updatedWorkout = await db
      .collection<WorkoutLog>('workout_logs')
      .findOne({ id, userId: user._id });

    return NextResponse.json({
      ...updatedWorkout,
      _id: updatedWorkout?._id?.toString(),
    });
  } catch (error) {
    console.error('Error updating workout:', error);
    return NextResponse.json(
      { error: 'Failed to update workout' },
      { status: 500 }
    );
  }
}

// DELETE workout
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get current user
    const user = await getCurrentUser(request);
    
    if (!user || !user._id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const db = await getModuleDb('gym-log');
    // Only delete if the workout belongs to the user
    const result = await db.collection('workout_logs').deleteOne({ 
      id,
      userId: user._id 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting workout:', error);
    return NextResponse.json(
      { error: 'Failed to delete workout' },
      { status: 500 }
    );
  }
}

