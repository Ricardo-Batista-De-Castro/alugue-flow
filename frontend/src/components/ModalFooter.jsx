const Spinner = () => (
  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

const ModalFooter = ({
  onCancel,
  onSubmit,
  formId,
  cancelText = 'Cancelar',
  submitText = 'Salvar',
  isPending = false,
  loadingText = 'Salvando...',
  isViewMode = false,
  closeText = 'Fechar'
}) => {
  if (isViewMode) {
    return (
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary px-6"
        >
          {closeText}
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
      <button
        type="button"
        onClick={onCancel}
        className="btn-secondary px-6"
      >
        {cancelText}
      </button>
      <button
        type="submit"
        form={formId}
        disabled={isPending}
        className="btn-primary px-6 inline-flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isPending && <Spinner />}
        {isPending ? loadingText : submitText}
      </button>
    </div>
  );
};

export default ModalFooter;
