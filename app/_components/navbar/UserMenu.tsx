"use client"

import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Key, User, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ChangePasswordModal from './ChangePasswordModal';
import { AUTH_COOKIES, COOKIE_DELETE_VALUE, ROUTES } from '@/lib/constants';

interface UserMenuProps {
  readonly username: string;
}

export default function UserMenu({ username }: UserMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    // Clear all auth cookies
    document.cookie = `${AUTH_COOKIES.USER_TOKEN}=${COOKIE_DELETE_VALUE}`;
    document.cookie = `${AUTH_COOKIES.USER_ID}=${COOKIE_DELETE_VALUE}`;
    router.push(ROUTES.LOGIN);
  };

  const handleChangePassword = () => {
    setIsOpen(false);
    setIsPasswordModalOpen(true);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* User Badge - Clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-[#111111] hover:bg-[#1a1a1a] rounded-lg border border-[#333333] transition-colors"
      >
        <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center">
          <User size={14} className="text-blue-400" />
        </div>
        <span className="text-sm font-medium text-[#ededed] hidden sm:inline">
          {username}
        </span>
        <ChevronDown 
          size={14} 
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-[#111111] rounded-lg shadow-lg border border-[#333333] py-1 z-50"
          role="menu"
          tabIndex={-1}
        >
          {/* User Info Header */}
          <div className="px-4 py-2 border-b border-[#333333]">
            <p className="text-xs text-gray-400 mb-0.5">Signed in as</p>
            <p className="text-sm font-semibold text-[#ededed]">{username}</p>
          </div>

          {/* Menu Items */}
          <button
            onClick={handleChangePassword}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#ededed] hover:bg-[#1a1a1a] transition-colors"
          >
            <Key size={16} className="text-gray-400" />
            <span>Change Password</span>
          </button>

          <div className="border-t border-[#333333] my-1" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </div>
  );
}

