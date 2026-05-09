import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import ToastContainer from '../components/ToastContainer';

const ToastContext = createContext(null);

const DEFAULT_DURATION_MS = 4000;

const randomId = () => {
  // Simple, good-enough id for UI
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const push = useCallback((type, title, message, options = {}) => {
    const id = randomId();
    const duration = options.duration ?? DEFAULT_DURATION_MS;

    const toast = {
      id,
      type, // 'success' | 'warning' | 'error' | 'info'
      title,
      message,
      createdAt: Date.now(),
      duration,
    };

    setToasts((prev) => [toast, ...prev].slice(0, 5)); // keep last 5

    if (duration > 0) {
      const timer = setTimeout(() => remove(id), duration);
      timersRef.current.set(id, timer);
    }

    return id;
  }, [remove]);

  const api = useMemo(() => ({
    push,
    remove,
    success: (title, message, options) => push('success', title, message, options),
    warning: (title, message, options) => push('warning', title, message, options),
    error: (title, message, options) => push('error', title, message, options),
    info: (title, message, options) => push('info', title, message, options),
  }), [push, remove]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastContainer toasts={toasts} onClose={remove} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};
