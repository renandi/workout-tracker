interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

const VARIANT_STYLES = {
  danger:  { icon: '⚠️', confirm: 'bg-red-600 hover:bg-red-700 text-white' },
  warning: { icon: '⚡', confirm: 'bg-yellow-500 hover:bg-yellow-600 text-white' },
  info:    { icon: 'ℹ️', confirm: 'bg-blue-600 hover:bg-blue-700 text-white' },
};

export function ConfirmModal({
  open, title, description, confirmLabel, cancelLabel,
  variant = 'info', onConfirm, onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  const styles = VARIANT_STYLES[variant];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-3xl mb-4 text-center">{styles.icon}</div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 text-center mb-2">
          {title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
          {description}
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={onConfirm}
            className={`w-full py-3 rounded-xl font-medium text-sm transition-all active:scale-95 ${styles.confirm}`}
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3 rounded-xl font-medium text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}