"use client"

import React from 'react';
import { Edit2, Trash2, Calendar } from 'lucide-react';
import type { WorkoutLog } from '../types';
import { formatDate } from '../utils';

interface WorkoutCardProps {
  readonly workout: WorkoutLog;
  readonly onEdit: () => void;
  readonly onDelete: () => void;
}

export default function WorkoutCard({ workout, onEdit, onDelete }: WorkoutCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">
            <Calendar size={14} />
            <span>{formatDate(workout.date)}</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 capitalize">{workout.day}</h3>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label="Edit"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {workout.exercises.map((exercise) => (
          <div key={exercise.id}>
            <div className="flex justify-between items-baseline mb-2">
              <h4 className="font-semibold text-gray-800 text-sm capitalize">{exercise.name}</h4>
              {exercise.notes && (
                <span className="text-xs text-gray-400 italic truncate max-w-[150px]">{exercise.notes}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {exercise.sets.map((set) => (
                <span
                  key={set.id}
                  className="inline-flex items-center px-2.5 py-1 bg-gray-100 border border-gray-200 text-gray-700 rounded-md text-xs font-medium tabular-nums"
                >
                  {set.weight > 0 ? `${set.weight}kg` : 'BW'} × {set.reps}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

