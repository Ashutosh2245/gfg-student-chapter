import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className={`bg-dark-card border border-dark-border rounded-3xl w-full ${maxWidth} p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in duration-200`}>
        <div className="flex items-center justify-between border-b border-dark-border pb-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-dark-bg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
