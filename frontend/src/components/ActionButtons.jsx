const ActionButtons = ({
  onNew,
  onEdit,
  onDelete,
  editDisabled = false,
  deleteDisabled = false,
  newLabel = "Novo",
  editLabel = "Editar",
  deleteLabel = "Excluir",
  showNew = true,
  showEdit = true,
  showDelete = true
}) => {
  return (
    <>
      {showNew && onNew && (
        <button
          onClick={onNew}
          className="btn-primary inline-flex items-center gap-1 text-sm py-1.5 px-3"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          {newLabel}
        </button>
      )}

      {showEdit && onEdit && (
        <button
          onClick={onEdit}
          disabled={editDisabled}
          className="btn-secondary inline-flex items-center gap-1 text-sm py-1.5 px-3 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          {editLabel}
        </button>
      )}

      {showDelete && onDelete && (
        <button
          onClick={onDelete}
          disabled={deleteDisabled}
          className="bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          {deleteLabel}
        </button>
      )}
    </>
  );
};

export default ActionButtons;
