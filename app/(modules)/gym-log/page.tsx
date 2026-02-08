"use client"

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkouts } from './hooks/useWorkouts';
import { AUTH_COOKIES, ROUTES } from '@/lib/constants';
import SlidePanel from './components/SlidePanel';
import WorkoutForm from './components/WorkoutForm';
import WorkoutPreview from './components/WorkoutPreview';
import WorkoutCard from './components/WorkoutCard';
import EmptyState from './components/EmptyState';
import FloatingActionButton from './components/FloatingActionButton';
import type { WorkoutLog } from './types';

export default function GymLogPage() {
  const router = useRouter();
  const { workouts, addWorkout, updateWorkout, deleteWorkout, isLoading } = useWorkouts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutLog | undefined>(undefined);
  const [previewWorkout, setPreviewWorkout] = useState<WorkoutLog | undefined>(undefined);
  const [isEditMode, setIsEditMode] = useState(false);

  // Check if sysadmin is logged in (should be caught by middleware, but double-check)
  useEffect(() => {
    const checkSysadmin = () => {
      const cookies = document.cookie.split(';');
      const hasSysadminAuth = cookies.some(cookie => 
        cookie.trim().startsWith(`${AUTH_COOKIES.SYSADMIN_TOKEN}=`)
      );
      
      if (hasSysadminAuth) {
        router.push(`${ROUTES.UNAUTHORIZED}?message=Sysadmin users cannot access regular user pages. Please log out first.`);
      }
    };

    checkSysadmin();
  }, [router]);

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

  const handlePreviewWorkout = (workout: WorkoutLog) => {
    setPreviewWorkout(workout);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditWorkout = (workout: WorkoutLog) => {
    setEditingWorkout(workout);
    setPreviewWorkout(undefined);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleEditFromPreview = () => {
    if (previewWorkout) {
      setEditingWorkout(previewWorkout);
      setPreviewWorkout(undefined);
      setIsEditMode(true);
    }
  };

  const handleAddNew = () => {
    setEditingWorkout(undefined);
    setPreviewWorkout(undefined);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteWorkout = async (id: string) => {
    if (window.confirm('Delete this workout log?')) {
      try {
        await deleteWorkout(id);
        handleCloseModal();
      } catch (error) {
        console.error('Failed to delete workout:', error);
        alert('Failed to delete workout. Please try again.');
      }
    }
  };

  const handleDeleteFromPreview = () => {
    if (previewWorkout) {
      handleDeleteWorkout(previewWorkout.id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWorkout(undefined);
    setPreviewWorkout(undefined);
    setIsEditMode(false);
  };

  const renderModalContent = () => {
    if (isEditMode) {
      return (
        <WorkoutForm
          workout={editingWorkout}
          onSave={handleSaveWorkout}
          onClose={handleCloseModal}
        />
      );
    }
    if (previewWorkout) {
      return (
        <WorkoutPreview
          workout={previewWorkout}
          onEdit={handleEditFromPreview}
          onDelete={handleDeleteFromPreview}
          onClose={handleCloseModal}
        />
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-20">
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
                onClick={() => handlePreviewWorkout(workout)}
                onEdit={() => handleEditWorkout(workout)}
                onDelete={() => handleDeleteWorkout(workout.id)}
              />
            ))}
          </div>
        )}
      </main>

      <SlidePanel isOpen={isModalOpen} onClose={handleCloseModal}>
        {renderModalContent()}
      </SlidePanel>

      <FloatingActionButton onClick={handleAddNew} />
    </div>
  );
}
