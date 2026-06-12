import React, { useEffect } from 'react';
import clsx from 'clsx';
import { X, CheckCircle, Warning, Info } from '@phosphor-icons/react';

export default function Toast({ message, type = 'success', onClose, duration = 5000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={clsx(
        'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-lg shadow-lg border transition-all duration-300 max-w-sm text-white',
        {
          'bg-emerald-600 border-emerald-700': type === 'success',
          'bg-red-600 border-red-700': type === 'error',
          'bg-amber-600 border-amber-700': type === 'warning',
        }
      )}
    >
      <div className="flex-shrink-0">
        {type === 'success' && <CheckCircle size={24} weight="fill" />}
        {type === 'error' && <Warning size={24} weight="fill" />}
        {type === 'warning' && <Warning size={24} weight="fill" />}
      </div>
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-auto text-white/85 hover:text-white focus:outline-none cursor-pointer">
        <X size={18} />
      </button>
    </div>
  );
}
