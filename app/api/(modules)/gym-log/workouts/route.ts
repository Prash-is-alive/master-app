import { NextRequest, NextResponse } from 'next/server';
import { getModuleDb } from '@/lib/db/mongodb';
import { getCurrentUser } from '@/lib/api/auth-utils';
import type { WorkoutLog } from '@/lib/db/schemas/gym-log';

// GET all workouts for the current user
export async function GET(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser(request);
    
    if (!user?._id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const db = await getModuleDb('gym-log');
    const workouts = await db
      .collection<WorkoutLog>('workout_logs')
      .find({ userId: user._id }) // Filter by user ID
      .sort({ date: -1 })
      .toArray();

    // Convert _id to string and ensure id field exists
    const formattedWorkouts = workouts.map(workout => ({
      ...workout,
      _id: workout._id?.toString(),
      id: workout.id || workout._id?.toString() || '',
    }));

    return NextResponse.json(formattedWorkouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workouts' },
      { status: 500 }
    );
  }
}

// POST create workout
export async function POST(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser(request);
    
    if (!user?._id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const workout: Omit<WorkoutLog, 'userId' | 'createdAt' | 'updatedAt' | '_id'> = await request.json();
    const db = await getModuleDb('gym-log');

    // Add user ID and timestamps (exclude _id - MongoDB will generate it)
    const workoutWithUser = {
      ...workout,
      userId: user._id, // Associate workout with user
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('workout_logs').insertOne(workoutWithUser);

    // Fetch the inserted document to get the generated _id
    const insertedWorkout = await db
      .collection('workout_logs')
      .findOne({ _id: result.insertedId });

    return NextResponse.json({
      ...insertedWorkout,
      _id: insertedWorkout?._id?.toString(),
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating workout:', error);
    return NextResponse.json(
      { error: 'Failed to create workout' },
      { status: 500 }
    );
  }
}

