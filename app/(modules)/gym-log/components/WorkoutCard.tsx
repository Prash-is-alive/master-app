"use client"

import React, { useState } from 'react';
import { Edit2, Trash2, Calendar, Copy, Check } from 'lucide-react';
import type { WorkoutLog } from '../types';
import { formatDate } from '../utils';
import { workoutToToon } from '../services/toon';
import { copyToClipboard } from '@/lib/services/copy.service';

interface WorkoutCardProps {
  readonly workout: WorkoutLog;
  readonly onEdit: () => void;
  readonly onDelete: () => void;
  readonly onClick: () => void;
}

export default function WorkoutCard({ workout, onEdit, onDelete, onClick }: WorkoutCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <div 
      className="group bg-[#111111] rounded-xl border border-[#333333] p-5 hover:bg-[#1a1a1a] hover:border-[#404040] transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 text-gray-400 text-xs font-medium uppercase tracking-wide mb-1">
            <Calendar size={14} />
            <span>{formatDate(workout.date)}</span>
          </div>
          <h3 className="text-lg font-bold text-[#ededed] capitalize">{workout.day}</h3>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
            aria-label="Copy to TOON format"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
            aria-label="Edit"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
              <h4 className="font-semibold text-[#ededed] text-sm capitalize">{exercise.name}</h4>
              {exercise.notes && (
                <span className="text-xs text-gray-500 italic truncate max-w-[150px]">{exercise.notes}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {exercise.sets.map((set) => (
                <span
                  key={set.id}
                  className="inline-flex items-center px-2.5 py-1 bg-[#1a1a1a] border border-[#333333] text-[#ededed] rounded-md text-xs font-medium tabular-nums"
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

