"use client"

import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-[#111111] sm:rounded-xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl overflow-hidden shadow-2xl flex flex-col border border-[#333333]"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

