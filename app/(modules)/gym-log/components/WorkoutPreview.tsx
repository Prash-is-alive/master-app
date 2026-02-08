"use client"

import React, { useState } from 'react';
import { Edit2, Trash2, Calendar, ArrowLeft, Copy, Check } from 'lucide-react';
import type { WorkoutLog } from '../types';
import { formatDate } from '../utils';
import { workoutToToon } from '../services/toon';
import { copyToClipboard } from '@/lib/services/copy.service';

interface WorkoutPreviewProps {
  readonly workout: WorkoutLog;
  readonly onEdit: () => void;
  readonly onDelete: () => void;
  readonly onClose: () => void;
}

function WorkoutPreview({ workout, onEdit, onDelete, onClose }: WorkoutPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const toonString = workoutToToon(workout);
      await copyToClipboard(toonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy workout:', error);
    }
  };

  return (
    <>
      {/* Sticky Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-[#333333] flex items-center gap-3 bg-[#111111] shrink-0">
        <button
          onClick={onClose}
          className="p-2 -ml-2 text-gray-400 hover:text-[#ededed] hover:bg-[#1a1a1a] rounded-lg transition-colors"
          aria-label="Close"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg sm:text-xl font-bold text-[#ededed] flex-1">Workout Details</h2>
        <div className="flex gap-1 items-center">
          <button
            onClick={handleCopy}
            className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
            aria-label="Copy to TOON format"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
            aria-label="Edit"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            aria-label="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#111111]">
        {/* Date & Title */}
        <div className="space-y-2 pb-4 border-b border-[#333333]">
          <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm font-medium uppercase tracking-wide">
            <Calendar size={14} />
            <span>{formatDate(workout.date)}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#ededed] capitalize">{workout.day}</h3>
        </div>

        {/* Exercises List */}
        <div className="space-y-4">
          {workout.exercises.map((exercise) => (
            <div key={exercise.id} className="border border-[#333333] rounded-xl p-4 bg-[#1a1a1a] hover:border-[#404040] transition-colors">
              <div className="flex justify-between items-baseline mb-3">
                <h4 className="font-semibold text-[#ededed] text-base capitalize">{exercise.name}</h4>
                {exercise.notes && (
                  <span className="text-sm text-gray-400 italic">{exercise.notes}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {exercise.sets.map((set) => (
                  <span
                    key={set.id}
                    className="inline-flex items-center px-3 py-1.5 bg-[#111111] border border-[#333333] text-[#ededed] rounded-lg text-sm font-medium tabular-nums"
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
