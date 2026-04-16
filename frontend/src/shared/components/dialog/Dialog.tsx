import { useEffect } from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: any;
  footer?: any;
  size?: 'md' | 'lg';
  closeDisabled?: boolean;
}

export default function Dialog({
  isOpen,
  title,
  description,
  onClose,
  children,
  footer,
  size = 'md',
  closeDisabled = false,
}: DialogProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !closeDisabled) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [closeDisabled, isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const sizeClass = size === 'lg' ? 'max-w-2xl' : 'max-w-lg';

  const handleClose = () => {
    if (!closeDisabled) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6"
      onClick={handleClose}
    >
      <div
        className={`w-full ${sizeClass} rounded-2xl bg-white shadow-2xl`}
        onClick={(event: { stopPropagation: () => void }) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={closeDisabled}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Fechar dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>

        {footer && <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}
