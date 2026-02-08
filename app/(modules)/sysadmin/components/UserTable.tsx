"use client"

import React from 'react';
import { Pencil, Trash2, Mail, Calendar } from 'lucide-react';
import type { UserRecord } from '../types';

interface UserTableProps {
  readonly users: UserRecord[];
  readonly onEdit: (user: UserRecord) => void;
  readonly onDelete: (user: UserRecord) => void;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      {/* Desktop Table */}
      <table className="w-full hidden md:table">
        <thead>
          <tr className="border-b border-[#333333]">
            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
              User
            </th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
              Email
            </th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
              Created
            </th>
            <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#222222]">
          {users.map((user) => (
            <tr
              key={user._id}
              className="hover:bg-[#1a1a1a] transition-colors group"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-400">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-[#ededed]">
                    {user.username}
                  </p>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-gray-400">
                  {user.email || '—'}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-gray-400">
                  {formatDate(user.createdAt)}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    aria-label={`Edit ${user.username}`}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    aria-label={`Delete ${user.username}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3 p-3">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-[#0a0a0a] border border-[#333333] rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-base font-bold text-blue-400">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#ededed]">
                  {user.username}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(user)}
                  className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                  aria-label={`Edit ${user.username}`}
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => onDelete(user)}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  aria-label={`Delete ${user.username}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-1.5 pl-[52px]">
              {user.email && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Mail size={12} />
                  <span>{user.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar size={12} />
                <span>Joined {formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
