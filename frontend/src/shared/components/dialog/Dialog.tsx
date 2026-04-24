import { useEffect } from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: any;
  footer?: any;
  size?: 'md' | 'lg' | 'xl';
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

  const sizeClass =
    size === 'xl'
      ? 'max-w-4xl'
      : size === 'lg'
        ? 'max-w-2xl'
        : 'max-w-lg';

  const handleClose = () => {
    if (!closeDisabled) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 px-3 py-4 sm:px-4 sm:py-6"
      onClick={handleClose}
    >
      <div className="flex min-h-full items-start justify-center sm:items-center">
        <div
          className={`my-auto flex max-h-[calc(100vh-2rem)] w-full ${sizeClass} flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100vh-3rem)]`}
          onClick={(event: { stopPropagation: () => void }) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex shrink-0 items-start justify-between border-b border-gray-200 px-4 py-4 sm:px-6">
            <div className="pr-4">
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

          <div className="overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">{children}</div>

          {footer && (
            <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
