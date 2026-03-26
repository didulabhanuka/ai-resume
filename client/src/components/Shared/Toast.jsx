import { useEffect } from 'react';

const toastStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const icons = {
  success: '✓',
  error: '✕',
  info: 'i',
};

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium transition-all ${toastStyles[type]}`}>
      <span className="w-5 h-5 rounded-full flex items-center justify-center bg-current bg-opacity-10 font-bold text-xs">
        {icons[type]}
      </span>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 opacity-50 hover:opacity-100 transition-opacity"
      >
        ✕
      </button>
    </div>
  );
}