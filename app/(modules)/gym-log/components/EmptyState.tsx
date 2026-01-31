"use client"

import React from 'react';
import { Dumbbell } from 'lucide-react';

interface EmptyStateProps {
  onAddWorkout: () => void;
}

export default function EmptyState({ onAddWorkout }: EmptyStateProps) {
  return (
    <div className="text-center py-20 px-4">
      <div className="bg-blue-600/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <Dumbbell size={40} className="text-blue-400 opacity-80" />
      </div>
      <h2 className="text-2xl font-bold text-[#ededed] mb-2">No workouts yet</h2>
      <p className="text-gray-400 max-w-sm mx-auto mb-8">
        Consistency is key. Log your first session today and start building your streak.
      </p>
      <button
        onClick={onAddWorkout}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
      >
        Create First Log
      </button>
    </div>
  );
}

