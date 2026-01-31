"use client"

import React from 'react';
import { Edit2, Trash2, Calendar, X } from 'lucide-react';
import type { WorkoutLog } from '../types';
import { formatDate } from '../utils';

interface WorkoutPreviewProps {
  readonly workout: WorkoutLog;
  readonly onEdit: () => void;
  readonly onDelete: () => void;
  readonly onClose: () => void;
}

function WorkoutPreview({ workout, onEdit, onDelete, onClose }: WorkoutPreviewProps) {
  return (
    <>
      {/* Sticky Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Workout Details</h2>
        <div className="flex gap-1 items-center">
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
          <button 
            type="button" 
            onClick={onClose} 
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-white">
        {/* Date & Title */}
        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium uppercase tracking-wide mb-2">
          <Calendar size={16} />
          <span>{formatDate(workout.date)}</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 capitalize mb-6">{workout.day}</h3>

        {/* Exercises List */}
        <div className="space-y-6">
          {workout.exercises.map((exercise) => (
            <div key={exercise.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
              <div className="flex justify-between items-baseline mb-3">
                <h4 className="font-semibold text-gray-800 text-base capitalize">{exercise.name}</h4>
                {exercise.notes && (
                  <span className="text-sm text-gray-500 italic">{exercise.notes}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {exercise.sets.map((set) => (
                  <span
                    key={set.id}
                    className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium tabular-nums shadow-sm"
                  >
                    {set.weight > 0 ? `${set.weight}kg` : 'BW'} × {set.reps}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </>
  );
}

export default WorkoutPreview;
