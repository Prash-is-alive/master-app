"use client"

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Calendar, Dumbbell, Save } from 'lucide-react';

// --- Types ---
interface Set {
  id: string;
  weight: number;
  reps: number;
}

interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  notes?: string;
}

interface WorkoutLog {
  id: string;
  date: string;
  day: string;
  exercises: Exercise[];
}

// --- Utility functions ---
const generateId = () => Math.random().toString(36).substr(2, 9);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

// --- Custom Hook ---
const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue, mounted] as const;
};

// --- Components ---

// 1. Modal Component (Improved Backdrop & Layout)
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({
  isOpen,
  onClose,
  children
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-white sm:rounded-xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        {children}
      </div>
    </div>
  );
};

// 2. Add/Edit Workout Form (Responsive Redesign)
const WorkoutForm: React.FC<{
  workout?: WorkoutLog;
  onSave: (workout: WorkoutLog) => void;
  onClose: () => void;
}> = ({ workout, onSave, onClose }) => {
  const [date, setDate] = useState(workout?.date || new Date().toISOString().split('T')[0]);
  const [day, setDay] = useState(workout?.day || '');
  const [exercises, setExercises] = useState<Exercise[]>(workout?.exercises || []);

  const addExercise = () => {
    setExercises([
      ...exercises,
      { id: generateId(), name: '', sets: [{ id: generateId(), weight: 0, reps: 0 }], notes: '' }
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

  const handleSubmit = () => {
    if (!day.trim() || exercises.length === 0) {
      alert('Please fill in the day and add at least one exercise');
      return;
    }
    const validExercises = exercises.filter(ex => ex.name.trim());
    onSave({
      id: workout?.id || generateId(),
      date,
      day: day.trim(),
      exercises: validExercises
    });
    onClose();
  };

  return (
    <>
      {/* Sticky Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          {workout ? 'Edit Workout' : 'Log Workout'}
        </h2>
        <button 
          type="button" 
          onClick={onClose} 
          className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
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
      <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3 shrink-0 rounded-b-xl">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-[2] flex justify-center items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-sm transition-all active:scale-[0.98]"
        >
          <Save size={18} />
          Save Workout
        </button>
      </div>
    </>
  );
};

// 3. Workout Card (Card View)
const WorkoutCard: React.FC<{
  workout: WorkoutLog;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ workout, onEdit, onDelete }) => {
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
};

// --- Main Page Component ---
const GymLogger: React.FC = () => {
  const [workouts, setWorkouts, mounted] = useLocalStorage<WorkoutLog[]>('gym-workouts', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutLog | undefined>(undefined);

  // Prevent hydration mismatch
  if (!mounted) return null;

  const sortedWorkouts = [...workouts].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleSaveWorkout = (workout: WorkoutLog) => {
    if (editingWorkout) {
      setWorkouts(workouts.map(w => w.id === workout.id ? workout : w));
    } else {
      setWorkouts([workout, ...workouts]); // Add to top
    }
    setEditingWorkout(undefined);
  };

  const handleEditWorkout = (workout: WorkoutLog) => {
    setEditingWorkout(workout);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingWorkout(undefined);
    setIsModalOpen(true);
  }

  const handleDeleteWorkout = (id: string) => {
    if (window.confirm('Delete this workout log?')) {
      setWorkouts(workouts.filter(w => w.id !== id));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWorkout(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* App Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Dumbbell size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">Gym Logger</h1>
              <p className="text-xs text-gray-500">Track your progress</p>
            </div>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm active:scale-95"
          >
            <Plus size={20} />
            <span className="hidden sm:inline font-medium">Log Workout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {sortedWorkouts.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Dumbbell size={40} className="text-blue-500 opacity-80" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No workouts yet</h2>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">
              Consistency is key. Log your first session today and start building your streak.
            </p>
            <button
              onClick={handleAddNew}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all"
            >
              Create First Log
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {sortedWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onEdit={() => handleEditWorkout(workout)}
                onDelete={() => handleDeleteWorkout(workout.id)}
              />
            ))}
          </div>
        )}
      </main>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <WorkoutForm
          workout={editingWorkout}
          onSave={handleSaveWorkout}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default GymLogger;