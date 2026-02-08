"use client"

import React from 'react';
import { Users, Plus } from 'lucide-react';

interface EmptyStateProps {
  readonly onCreateUser: () => void;
}

export default function EmptyState({ onCreateUser }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-4">
        <Users size={28} className="text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-[#ededed] mb-2">No users found</h3>
      <p className="text-sm text-gray-400 mb-6 max-w-sm">
        Get started by creating the first user account.
      </p>
      <button
        onClick={onCreateUser}
        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
      >
        <Plus size={18} />
        Create User
      </button>
    </div>
  );
}

