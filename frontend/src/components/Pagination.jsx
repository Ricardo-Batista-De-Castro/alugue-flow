import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange, 
  onItemsPerPageChange 
}) => {
  // Gera array de números de página para exibir
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Se houver 5 ou menos páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas com reticências
      if (currentPage <= 3) {
        // Início: 1 2 3 4 ... última
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Fim: 1 ... penúltima-2 penúltima-1 penúltima última
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        // Meio: 1 ... atual-1 atual atual+1 ... última
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      {/* Selector de itens por página */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Exibir</label>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {[5, 10, 20, 50].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {/* Controles de navegação */}
      <div className="flex items-center gap-1">
        {/* Primeira página */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-2 py-1 rounded border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Primeira página"
        >
          «
        </button>

        {/* Página anterior */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 py-1 rounded border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Página anterior"
        >
          ‹
        </button>

        {/* Números das páginas */}
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-500">
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                currentPage === page
                  ? 'bg-primary-600 text-white font-semibold'
                  : 'border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Próxima página */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-2 py-1 rounded border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Próxima página"
        >
          ›
        </button>

        {/* Última página */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-2 py-1 rounded border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Última página"
        >
          »
        </button>

        {/* Total de itens */}
        <span className="ml-2 text-sm text-gray-600">
          Total: {totalItems}
        </span>
      </div>
    </div>
  );
};

export default Pagination;
