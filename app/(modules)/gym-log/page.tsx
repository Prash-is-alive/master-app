"use client"

import React, { useState, useMemo } from 'react';
import { useWorkouts } from './hooks/useWorkouts';
import Modal from './components/Modal';
import WorkoutForm from './components/WorkoutForm';
import WorkoutCard from './components/WorkoutCard';
import EmptyState from './components/EmptyState';
import FloatingActionButton from './components/FloatingActionButton';
import type { WorkoutLog } from './types';

export default function GymLogPage() {
  const { workouts, addWorkout, updateWorkout, deleteWorkout, isLoading } = useWorkouts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutLog | undefined>(undefined);

  const sortedWorkouts = useMemo(() => {
    return [...workouts].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [workouts]);

  const handleSaveWorkout = async (workout: WorkoutLog) => {
    try {
      if (editingWorkout) {
        await updateWorkout(workout);
      } else {
        await addWorkout(workout);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save workout:', error);
      alert('Failed to save workout. Please try again.');
    }
  };

  const handleEditWorkout = (workout: WorkoutLog) => {
    setEditingWorkout(workout);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingWorkout(undefined);
    setIsModalOpen(true);
  };

  const handleDeleteWorkout = async (id: string) => {
    if (window.confirm('Delete this workout log?')) {
      try {
        await deleteWorkout(id);
      } catch (error) {
        console.error('Failed to delete workout:', error);
        alert('Failed to delete workout. Please try again.');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWorkout(undefined);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {sortedWorkouts.length === 0 ? (
          <EmptyState onAddWorkout={handleAddNew} />
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

      <FloatingActionButton onClick={handleAddNew} />
    </div>
  );
}
