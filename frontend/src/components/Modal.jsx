const Modal = ({
  show,
  onClose,
  title,
  children,
  size = 'lg',
  headerGradient = false,
  footer
}) => {
  if (!show) return null;

  // Mapeamento de tamanhos padronizados
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  const modalSizeClass = sizeClasses[size] || sizeClasses.lg;

  // Estilo do header baseado na prop headerGradient
  const headerClass = headerGradient
    ? 'bg-primary-gradient text-white'
    : 'bg-white text-gray-800 border-b border-gray-200';

  const closeButtonClass = headerGradient
    ? 'text-white hover:text-gray-200'
    : 'text-gray-500 hover:text-gray-700';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-lg shadow-xl w-full ${modalSizeClass} max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className={`sticky top-0 px-6 py-4 flex justify-between items-center ${headerClass}`}>
          <h2 className="text-xl font-bold">
            {title}
          </h2>
          <button
            onClick={onClose}
            className={`transition-colors ${closeButtonClass}`}
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 pb-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
