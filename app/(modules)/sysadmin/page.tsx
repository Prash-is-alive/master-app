"use client"

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, RefreshCw, Users, LogOut } from 'lucide-react';
import { AUTH_COOKIES, COOKIE_DELETE_VALUE, ROUTES, API_ENDPOINTS } from '@/lib/constants';
import { useUsers } from './hooks/useUsers';
import UserTable from './components/UserTable';
import UserForm from './components/UserForm';
import SlidePanel from './components/SlidePanel';
import ConfirmDialog from './components/ConfirmDialog';
import EmptyState from './components/EmptyState';
import LoginForm from './components/LoginForm';
import type { UserRecord, CreateUserPayload, UpdateUserPayload } from './types';

type AuthState = 'loading' | 'unauthenticated' | 'authenticated';

export default function SysadminPage() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>('loading');

  // Check if regular user is logged in (should be caught by middleware, but double-check)
  useEffect(() => {
    const checkRegularUser = () => {
      const cookies = document.cookie.split(';');
      const hasRegularAuth = cookies.some(cookie => 
        cookie.trim().startsWith(`${AUTH_COOKIES.USER_TOKEN}=`)
      );
      
      if (hasRegularAuth) {
        router.push(ROUTES.UNAUTHORIZED);
      }
    };

    checkRegularUser();
  }, [router]);

  // Check if already authenticated as sysadmin
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch(API_ENDPOINTS.SYSADMIN.AUTH.ME);
      setAuthState(response.ok ? 'authenticated' : 'unauthenticated');
    } catch {
      setAuthState('unauthenticated');
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLoginSuccess = () => {
    setAuthState('authenticated');
  };

  const handleLogout = () => {
    document.cookie = `${AUTH_COOKIES.SYSADMIN_TOKEN}=${COOKIE_DELETE_VALUE}`;
    document.cookie = `${AUTH_COOKIES.SYSADMIN_ID}=${COOKIE_DELETE_VALUE}`;
    setAuthState('unauthenticated');
  };

  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (authState === 'unauthenticated') {
    return <LoginForm onSuccess={handleLoginSuccess} />;
  }

  return <SysadminDashboard onLogout={handleLogout} />;
}

// ─── Authenticated Dashboard ─────────────────────────────────

interface SysadminDashboardProps {
  readonly onLogout: () => void;
}

function SysadminDashboard({ onLogout }: SysadminDashboardProps) {
  const { users, isLoading, error, createUser, updateUser, deleteUser, refresh } = useUsers();

  // Panel state
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | undefined>(undefined);

  // Delete dialog state
  const [deletingUser, setDeletingUser] = useState<UserRecord | null>(null);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenCreate = () => {
    setEditingUser(undefined);
    setIsPanelOpen(true);
  };

  const handleOpenEdit = (user: UserRecord) => {
    setEditingUser(user);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setEditingUser(undefined);
  };

  const handleSave = async (data: CreateUserPayload | UpdateUserPayload) => {
    if (editingUser) {
      await updateUser(editingUser._id, data as UpdateUserPayload);
      showToast(`User "${editingUser.username}" updated successfully`, 'success');
    } else {
      await createUser(data as CreateUserPayload);
      showToast(`User "${(data as CreateUserPayload).username}" created successfully`, 'success');
    }
    handleClosePanel();
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;

    try {
      await deleteUser(deletingUser._id);
      showToast(`User "${deletingUser.username}" deleted successfully`, 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to delete user', 'error');
    } finally {
      setDeletingUser(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center">
              <Users size={20} className="text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#ededed]">Users</h2>
              <p className="text-sm text-gray-400">
                {users.length} user{users.length === 1 ? '' : 's'} total
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              className="p-2.5 text-gray-400 hover:text-[#ededed] hover:bg-[#111111] border border-[#333333] rounded-lg transition-colors"
              aria-label="Refresh"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Create User</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-[#333333] rounded-lg transition-colors"
              aria-label="Sign out"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Content */}
        {users.length === 0 ? (
          <EmptyState onCreateUser={handleOpenCreate} />
        ) : (
          <div className="bg-[#111111] border border-[#333333] rounded-xl overflow-hidden">
            <UserTable
              users={users}
              onEdit={handleOpenEdit}
              onDelete={setDeletingUser}
            />
          </div>
        )}
      </main>

      {/* Create / Edit Panel */}
      <SlidePanel isOpen={isPanelOpen} onClose={handleClosePanel}>
        <UserForm
          user={editingUser}
          onSave={handleSave}
          onClose={handleClosePanel}
        />
      </SlidePanel>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingUser}
        title="Delete User"
        message={`Are you sure you want to delete "${deletingUser?.username}"? This action cannot be undone.`}
        confirmLabel="Delete User"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingUser(null)}
      />

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[80] px-5 py-3 rounded-lg text-sm font-medium shadow-lg transition-all duration-300 ${
            toast.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
