import React from 'react';

export default function Toast({ toast, onClose }) {
  if (!toast || !toast.visible) return null;

  return (
    <div
      id="toast-notification"
      className="fixed bottom-6 right-6 z-50 transform transition-all duration-300 pointer-events-auto"
    >
      <div className="bg-primary text-on-primary px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-outline-variant/30 animate-fade-in-up">
        <span className="material-symbols-outlined text-secondary text-2xl">
          {toast.icon || 'info'}
        </span>
        <div className="flex flex-col">
          <span className="font-body-sm text-body-sm font-medium">{toast.message}</span>
          {toast.subtitle && (
            <span className="text-xs text-primary-fixed">{toast.subtitle}</span>
          )}
        </div>
        <button
          onClick={onClose}
          className="ml-2 text-outline hover:text-on-primary text-xs uppercase"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
