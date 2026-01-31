"use client"

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Save } from 'lucide-react';
import type { WorkoutLog, Exercise } from '../types';
import { generateId } from '../utils';

const DRAFT_STORAGE_KEY = 'gym-log-workout-draft';

interface WorkoutFormProps {
  workout?: WorkoutLog;
  onSave: (workout: WorkoutLog) => void;
  onClose: () => void;
}

export default function WorkoutForm({ workout, onSave, onClose }: WorkoutFormProps) {
  // Load draft from localStorage only for new workouts (not editing)
  const loadDraft = (): { date: string; day: string; exercises: Exercise[] } | null => {
    if (workout) return null; // Don't load draft when editing existing workout
    try {
      const draft = globalThis.localStorage?.getItem(DRAFT_STORAGE_KEY);
      if (draft) {
        return JSON.parse(draft);
      }
    } catch (error) {
      console.error('Failed to load draft from localStorage:', error);
    }
    return null;
  };

  const draft = loadDraft();
  // Reverse exercises when editing existing workout so they appear newest-first in the form
  const initialExercises = workout?.exercises 
    ? [...workout.exercises].reverse() 
    : (draft?.exercises || []);
  const [date, setDate] = useState(workout?.date || draft?.date || new Date().toISOString().split('T')[0]);
  const [day, setDay] = useState(workout?.day || draft?.day || '');
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);

  const addExercise = () => {
    setExercises([
      { id: generateId(), name: '', sets: [{ id: generateId(), weight: 0, reps: 0 }], notes: '' },
      ...exercises
    ]);
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter(ex => ex.id !== exerciseId));
  };

  const updateExerciseName = (exerciseId: string, name: string) => {
    setExercises(exercises.map(ex =>
      ex.id === exerciseId ? { ...ex, name } : ex
    ));
  };

  const updateExerciseNotes = (exerciseId: string, notes: string) => {
    setExercises(exercises.map(ex =>
      ex.id === exerciseId ? { ...ex, notes } : ex
    ));
  };

  const addSet = (exerciseId: string) => {
    setExercises(exercises.map(ex =>
      ex.id === exerciseId
        ? { ...ex, sets: [...ex.sets, { id: generateId(), weight: 0, reps: 0 }] }
        : ex
    ));
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setExercises(exercises.map(ex =>
      ex.id === exerciseId
        ? { ...ex, sets: ex.sets.filter(s => s.id !== setId) }
        : ex
    ));
  };

  const updateSet = (exerciseId: string, setId: string, field: 'weight' | 'reps', value: number) => {
    setExercises(exercises.map(ex =>
      ex.id === exerciseId
        ? {
          ...ex,
          sets: ex.sets.map(s =>
            s.id === setId ? { ...s, [field]: value } : s
          )
        }
        : ex
    ));
  };

  // Auto-save to localStorage (only for new workouts, not editing)
  useEffect(() => {
    if (workout) return; // Don't auto-save when editing existing workout

    try {
      const draft = {
        date,
        day,
        exercises
      };
      globalThis.localStorage?.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch (error) {
      console.error('Failed to save draft to localStorage:', error);
    }
  }, [date, day, exercises, workout]);

  const clearDraft = () => {
    try {
      globalThis.localStorage?.removeItem(DRAFT_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear draft from localStorage:', error);
    }
  };

  const handleDiscard = () => {
    clearDraft();
    setDate(new Date().toISOString().split('T')[0]);
    setDay('');
    setExercises([]);
    onClose();
  };

  const handleSubmit = () => {
    if (!day.trim() || exercises.length === 0) {
      alert('Please fill in the day and add at least one exercise');
      return;
    }
    const validExercises = exercises.filter(ex => ex.name.trim());
    // Reverse exercises array so they appear in the order they were added when displayed
    onSave({
      id: workout?.id || generateId(),
      date,
      day: day.trim(),
      exercises: [...validExercises].reverse()
    });
    clearDraft(); // Clear draft after successful save
    onClose();
  };

  return (
    <>
      {/* Sticky Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          {workout ? 'Edit Workout' : 'Log Workout'}
        </h2>
        <div className="flex gap-1 items-center">
          <button
            type="button"
            onClick={handleDiscard}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Discard"
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
        {/* Date & Title Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Focus (e.g., Pull Day)</label>
            <input
              type="text"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              placeholder="Enter workout focus..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 shadow-sm"
              required
            />
          </div>
        </div>

        {/* Exercises List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-700">Exercises</label>
            <button
              type="button"
              onClick={addExercise}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium transition-colors"
            >
              <Plus size={16} /> Add Exercise
            </button>
          </div>

          {exercises.map((exercise, exIndex) => (
            <div key={exercise.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
              {/* Exercise Header */}
              <div className="flex gap-3 mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={exercise.name}
                    onChange={(e) => updateExerciseName(exercise.id, e.target.value)}
                    placeholder="Exercise Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 font-medium"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeExercise(exercise.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Remove exercise"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              {/* Sets - Responsive Grid */}
              <div className="space-y-3">
                {/* Header Labels (Desktop only) */}
                <div className="hidden sm:grid grid-cols-12 gap-3 px-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="col-span-2">Set</div>
                  <div className="col-span-4">Weight (kg)</div>
                  <div className="col-span-4">Reps</div>
                  <div className="col-span-2 text-right">Action</div>
                </div>

                {exercise.sets.map((set, idx) => (
                  <div key={set.id} className="grid grid-cols-12 gap-2 sm:gap-3 items-center">
                    {/* Set Label */}
                    <div className="col-span-12 sm:col-span-2 flex items-center gap-2 sm:block">
                      <span className="text-xs font-bold text-gray-400 uppercase sm:hidden">Set</span>
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-xs font-bold text-gray-600">
                        {idx + 1}
                      </div>
                    </div>

                    {/* Weight Input */}
                    <div className="col-span-5 sm:col-span-4 relative">
                      <input
                        type="number"
                        value={set.weight || ''}
                        onChange={(e) => updateSet(exercise.id, set.id, 'weight', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-center sm:text-left"
                        step="0.5"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">kg</span>
                    </div>

                    {/* Reps Input */}
                    <div className="col-span-5 sm:col-span-4 relative">
                      <input
                        type="number"
                        value={set.reps || ''}
                        onChange={(e) => updateSet(exercise.id, set.id, 'reps', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-center sm:text-left"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">reps</span>
                    </div>

                    {/* Delete Set */}
                    <div className="col-span-2 sm:col-span-2 flex justify-end">
                      {exercise.sets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSet(exercise.id, set.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-gray-200/60 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => addSet(exercise.id)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold py-1 px-2 rounded hover:bg-blue-50 self-start"
                >
                  + Add Set
                </button>
                
                <input
                  type="text"
                  value={exercise.notes || ''}
                  onChange={(e) => updateExerciseNotes(exercise.id, e.target.value)}
                  placeholder="Notes (optional)..."
                  className="flex-1 text-sm px-3 py-1.5 border-0 border-b border-gray-200 focus:border-blue-500 focus:ring-0 bg-transparent text-gray-600 placeholder-gray-400"
                />
              </div>
            </div>
          ))}

          {exercises.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-gray-500 text-sm">No exercises added yet.</p>
              <button onClick={addExercise} className="mt-2 text-blue-500 font-medium text-sm">
                Add your first exercise
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0 rounded-b-xl">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex justify-center items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-sm transition-all active:scale-[0.98]"
        >
          <Save size={18} />
          Save Workout
        </button>
      </div>
    </>
  );
}

