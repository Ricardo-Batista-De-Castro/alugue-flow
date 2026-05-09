import Pagination from './Pagination';
import ActionButtons from './ActionButtons';

const DataTable = ({
  columns = [],
  data = [],
  onRowClick,
  selectedRow,
  isLoading = false,
  error = null,
  emptyMessage = "Nenhum registro encontrado.",
  renderActions,
  pagination,
  onNew,
  onEdit,
  onDelete,
  newLabel,
  editLabel,
  deleteLabel,
  editDisabled = false,
  deleteDisabled = false,
  children
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">Erro ao carregar dados. Tente novamente.</p>
      </div>
    );
  }

  return (
    <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto max-w-full">
        <table className="min-w-max w-full divide-y divide-gray-200">
          <thead className="bg-primary-gradient">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={col.accessor || col.header || index}
                  className={`px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedRow?.id === row.id ? 'bg-primary-gradient-soft' : 'hover:bg-gray-50'
                  }`}
                >
                  {columns.map((col, index) => (
                    <td
                      key={col.accessor || col.header || index}
                      className={`px-4 py-3 text-sm whitespace-nowrap ${col.className || 'text-gray-600'}`}
                    >
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer da tabela: botões + paginação */}
      <div className="border-t border-gray-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3 bg-gray-50 rounded-b-lg">
        <div className="flex items-center gap-2">
          {renderActions ? (
            renderActions()
          ) : (
            <ActionButtons
              onNew={onNew}
              onEdit={onEdit}
              onDelete={onDelete}
              newLabel={newLabel}
              editLabel={editLabel}
              deleteLabel={deleteLabel}
              editDisabled={editDisabled}
              deleteDisabled={deleteDisabled}
            />
          )}
        </div>

        {pagination && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={pagination.onPageChange}
            onItemsPerPageChange={pagination.onItemsPerPageChange}
          />
        )}
      </div>

      {children}
    </div>
  );
};

export default DataTable;
