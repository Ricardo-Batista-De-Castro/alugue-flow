const iconByType = {
  success: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 6L9 17l-5-5" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4m0 4h.01" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.29 3.86l-8.02 13.9A2 2 0 004 21h16a2 2 0 001.73-3.24l-8.02-13.9a2 2 0 00-3.42 0z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    </svg>
  ),
};

const styleByType = {
  success: {
    bar: 'bg-green-600',
    progress: 'bg-green-800/40',
    icon: 'text-white',
    bg: 'bg-green-500/90',
    title: 'text-white',
    message: 'text-green-50',
    close: 'text-green-100 hover:text-white',
  },
  warning: {
    bar: 'bg-amber-600',
    progress: 'bg-amber-900/50',
    icon: 'text-white',
    bg: 'bg-amber-500',
    title: 'text-white',
    message: 'text-amber-50',
    close: 'text-amber-100 hover:text-white',
  },
  error: {
    bar: 'bg-red-700',
    progress: 'bg-red-900/50',
    icon: 'text-white',
    bg: 'bg-red-600',
    title: 'text-white',
    message: 'text-red-50',
    close: 'text-red-100 hover:text-white',
  },
  info: {
    bar: 'bg-blue-700',
    progress: 'bg-blue-900/50',
    icon: 'text-white',
    bg: 'bg-blue-600',
    title: 'text-white',
    message: 'text-blue-50',
    close: 'text-blue-100 hover:text-white',
  },
};

const Toast = ({ toast, onClose }) => {
  const styles = styleByType[toast.type] || styleByType.info;

  return (
    <div
      className={`w-[360px] max-w-[calc(100vw-2rem)] ${styles.bg} shadow-xl border border-white/15 rounded-md overflow-hidden`}
      role="status"
      aria-live="polite"
    >
      <div className="flex">
        <div className={`w-2 ${styles.bar}`} />
        <div className="flex-1 p-4 pr-10">
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 ${styles.icon}`}>
              {iconByType[toast.type] || iconByType.info}
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-semibold leading-5 ${styles.title} truncate`}>
                {toast.title}
              </p>
              {toast.message && (
                <p className={`text-sm leading-5 ${styles.message} break-words`}>
                  {toast.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onClose(toast.id)}
          className={`px-3 py-2 transition-colors ${styles.close}`}
          aria-label="Fechar"
          title="Fechar"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Barra de progresso (contador para auto-fechar) */}
      {toast.duration > 0 && (
        <div className="h-1 bg-white/15">
          <div
            className={`h-full ${styles.progress} toast-progress`}
            style={{ '--toast-duration': `${toast.duration}ms` }}
          />
        </div>
      )}
    </div>
  );
};

export default Toast;
