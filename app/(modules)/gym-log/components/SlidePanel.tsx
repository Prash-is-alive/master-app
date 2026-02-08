"use client"

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function SlidePanel({ isOpen, onClose, children }: SlidePanelProps) {
  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Slide Panel */}
      <div 
        className="fixed inset-y-0 right-0 w-full sm:w-[480px] md:w-[560px] lg:w-[640px] bg-[#111111] border-l border-[#333333] z-50 flex flex-col shadow-2xl transform transition-transform duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </>
  );
}

