"use client"

import React, { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import type { UserRecord, CreateUserPayload, UpdateUserPayload } from '../types';

interface UserFormProps {
  readonly user?: UserRecord;
  readonly onSave: (data: CreateUserPayload | UpdateUserPayload) => Promise<void>;
  readonly onClose: () => void;
}

function validateForm(
  username: string,
  password: string,
  confirmPassword: string,
  isEditing: boolean
): string | null {
  if (!username.trim()) return 'Username is required';
  if (!isEditing && !password) return 'Password is required';
  if (password && password.length < 6) return 'Password must be at least 6 characters';
  if (password && password !== confirmPassword) return 'Passwords do not match';
  return null;
}

function buildUpdatePayload(
  user: UserRecord,
  username: string,
  email: string,
  password: string
): UpdateUserPayload {
  const payload: UpdateUserPayload = {};
  if (username !== user.username) payload.username = username.trim();
  if (email !== (user.email ?? '')) payload.email = email.trim() || undefined;
  if (password) payload.password = password;
  return payload;
}

function buildCreatePayload(username: string, email: string, password: string): CreateUserPayload {
  return {
    username: username.trim(),
    password,
    ...(email.trim() && { email: email.trim() }),
  };
}

export default function UserForm({ user, onSave, onClose }: UserFormProps) {
  const isEditing = !!user;

  const [username, setUsername] = useState(user?.username ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm(username, password, confirmPassword, isEditing);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSaving(true);
      const payload = user
        ? buildUpdatePayload(user, username, email, password)
        : buildCreatePayload(username, email, password);
      await onSave(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save user');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#333333]">
        <h2 className="text-lg font-bold text-[#ededed]">
          {isEditing ? 'Edit User' : 'Create User'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-[#ededed] hover:bg-[#1a1a1a] rounded-lg transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1.5">
            Username <span className="text-red-400">*</span>
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            autoComplete="off"
            className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#333333] rounded-lg text-[#ededed] placeholder:text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email (optional)"
            autoComplete="off"
            className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#333333] rounded-lg text-[#ededed] placeholder:text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1.5">
            Password {!isEditing && <span className="text-red-400">*</span>}
            {isEditing && <span className="text-gray-600 text-xs ml-1">(leave blank to keep current)</span>}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password (min 6 chars)"
            autoComplete="new-password"
            className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#333333] rounded-lg text-[#ededed] placeholder:text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* Confirm Password */}
        {password && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-1.5">
              Confirm Password <span className="text-red-400">*</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              autoComplete="new-password"
              className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#333333] rounded-lg text-[#ededed] placeholder:text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#333333] flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-[#ededed] hover:bg-[#1a1a1a] rounded-lg transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              {isEditing ? 'Update User' : 'Create User'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

