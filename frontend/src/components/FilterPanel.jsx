import { useState } from 'react';

const FilterPanel = ({
  title = "Filtros de Pesquisa",
  children,
  onSearch,
  onClear,
  isSearching = false,
  defaultExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-white rounded-lg shadow-md mb-4 border-l-4 border-primary-600">
      {/* Header colapsável */}
      <div
        className="px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between rounded-t-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-lg font-semibold text-gray-800">
          {title}
        </h2>
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
            isExpanded ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Conteúdo expansível */}
      {isExpanded && (
        <div className="px-4 py-4">
          <div className="grid grid-cols-12 gap-3">
            {children}
          </div>

          {/* Botões de ação */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={onSearch}
              disabled={isSearching}
              className="btn-primary inline-flex items-center gap-2 text-sm py-2 px-4 disabled:opacity-50"
            >
              {isSearching ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Pesquisar
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Pesquisar
                </>
              )}
            </button>

            <button
              onClick={onClear}
              disabled={isSearching}
              className="btn-secondary inline-flex items-center gap-2 text-sm py-2 px-4 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente auxiliar para campos de filtro
export const FilterField = ({ label, children, className = "col-span-12 sm:col-span-6 lg:col-span-3" }) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
};

export default FilterPanel;
