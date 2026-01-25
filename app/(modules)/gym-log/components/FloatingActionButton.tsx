"use client"

import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  readonly onClick: () => void;
}

export default function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all active:scale-95 flex items-center justify-center z-40"
      aria-label="Add workout"
    >
      <Plus size={24} />
    </button>
  );
}

