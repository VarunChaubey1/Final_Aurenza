import React from 'react';
import { useShop } from '../../context/ShopContext';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { toasts, removeToast } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#1F1F1F] text-white p-4 rounded-2xl shadow-2xl border border-[#D6A34A]/40 flex items-center justify-between gap-3 animate-slideUp"
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#D6A34A] flex-shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />}
            <span className="text-xs font-medium leading-tight">{toast.message}</span>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-white p-1"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
