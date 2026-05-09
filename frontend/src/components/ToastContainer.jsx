import Toast from './Toast';
import { useEffect, useMemo, useState } from 'react';

const ToastContainer = ({ toasts, onClose }) => {
  // Keep a local set of "visible" toast ids to animate in/out
  const [visibleIds, setVisibleIds] = useState(() => new Set());

  const ids = useMemo(() => toasts.map((t) => t.id), [toasts]);

  useEffect(() => {
    setVisibleIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
  }, [ids]);

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col-reverse gap-3">
      {toasts.map((t) => {
        const isVisible = visibleIds.has(t.id);
        return (
          <div
            key={t.id}
            className={`transition-all duration-200 ease-out ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
            }`}
          >
            <Toast toast={t} onClose={onClose} />
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
