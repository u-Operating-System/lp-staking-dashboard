import { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

export type ToastType = 'success' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  autoClose?: boolean;
}

export const Toast = ({ message, type, onClose, autoClose = true }: ToastProps) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [autoClose, onClose]);

  const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const borderColor = type === 'success' ? 'border-green-300' : 'border-red-300';
  const Icon = type === 'success' ? CheckCircleIcon : ExclamationCircleIcon;
  const iconColor = type === 'success' ? 'text-green-500' : 'text-red-500';

  return (
    <div 
      className={`fixed top-4 right-4 z-[99999] rounded-lg border-2 ${borderColor} ${bgColor} p-5 shadow-2xl animate-bounce-once min-w-[300px]`}
      style={{
        boxShadow: '0 0 25px rgba(0, 0, 0, 0.2)',
        animation: 'fadeIn 0.3s ease-out forwards',
      }}
    >
      <div className="flex items-start gap-3">
        <Icon className={`h-6 w-6 ${iconColor} flex-shrink-0`} />
        <p className={`text-base font-medium ${textColor}`}>{message}</p>
        <button
          onClick={() => {
            onClose();
          }}
          className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 ${textColor} hover:bg-gray-100 inline-flex h-8 w-8 items-center justify-center`}
        >
          <span className="sr-only">Close</span>
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-bounce-once {
          animation: bounce 0.5s ease-in-out;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}; 