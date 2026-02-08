"use client"

import { useState, useEffect, useCallback } from 'react';
import type { UserRecord, CreateUserPayload, UpdateUserPayload } from '../types';

const API_BASE = '/api/sysadmin/users';

export function useUsers() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(API_BASE);

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data: UserRecord[] = await response.json();
      setUsers(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load users';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const createUser = async (payload: CreateUserPayload): Promise<UserRecord> => {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to create user');
    }

    const newUser: UserRecord = await response.json();
    setUsers(prev => [newUser, ...prev]);
    return newUser;
  };

  const updateUser = async (id: string, payload: UpdateUserPayload): Promise<UserRecord> => {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to update user');
    }

    const updated: UserRecord = await response.json();
    setUsers(prev => prev.map(u => (u._id === id ? updated : u)));
    return updated;
  };

  const deleteUser = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete user');
    }

    setUsers(prev => prev.filter(u => u._id !== id));
  };

  return {
    users,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    refresh: loadUsers,
  };
}

