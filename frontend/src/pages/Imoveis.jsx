import { useState } from 'react';
import Layout from '../components/Layout';
import { useImoveis, useCreateImovel, useUpdateImovel, useDeleteImovel } from '../hooks/useImoveis';

const Imoveis = () => {
  const { data: imoveis = [], isLoading, error } = useImoveis();
  const createImovel = useCreateImovel();
  const updateImovel = useUpdateImovel();
  const deleteImovel = useDeleteImovel();

  const [showModal, setShowModal] = useState(false);
  const [editingImovel, setEditingImovel] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    cidade: '',
    estado: '',
    tipo: '',
    status: '',
  });
  const [appliedFilters, setAppliedFilters] = useState({
    cidade: '',
    estado: '',
    tipo: '',
    status: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isSearching, setIsSearching] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    tipo: 'apartamento',
    quartos: '',
    banheiros: '',
    area: '',
    valorAluguel: '',
    status: 'disponivel',
    observacoes: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingImovel) {
        await updateImovel.mutateAsync({ id: editingImovel.id, data: formData });
      } else {
        await createImovel.mutateAsync(formData);
      }
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar imóvel:', error);
      alert('Erro ao salvar imóvel');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente excluir este imóvel?')) return;
    try {
      await deleteImovel.mutateAsync(id);
    } catch (error) {
      console.error('Erro ao excluir imóvel:', error);
      alert('Erro ao excluir imóvel');
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedRow) {
      alert('Selecione um imóvel para excluir');
      return;
    }
    await handleDelete(selectedRow.id);
    setSelectedRow(null);
  };

  const handleEdit = () => {
    if (!selectedRow) {
      alert('Selecione um imóvel para editar');
      return;
    }
    openModal(selectedRow);
  };

  const openModal = (imovel = null) => {
    if (imovel) {
      setEditingImovel(imovel);
      setFormData({
        nome: imovel.nome || '',
        endereco: imovel.endereco || '',
        numero: imovel.numero || '',
        complemento: imovel.complemento || '',
        bairro: imovel.bairro || '',
        cidade: imovel.cidade || '',
        estado: imovel.estado || '',
        cep: imovel.cep || '',
        tipo: imovel.tipo || 'apartamento',
        quartos: imovel.quartos || '',
        banheiros: imovel.banheiros || '',
        area: imovel.area || '',
        valorAluguel: imovel.valorAluguel || '',
        status: imovel.status || 'disponivel',
        observacoes: imovel.observacoes || '',
      });
    } else {
      setEditingImovel(null);
      setFormData({
        nome: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
        tipo: 'apartamento',
        quartos: '',
        banheiros: '',
        area: '',
        valorAluguel: '',
        status: 'disponivel',
        observacoes: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingImovel(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setAppliedFilters(filters);
      setCurrentPage(1);
      setIsSearching(false);
    }, 300);
  };

  const clearFilters = () => {
    setIsClearing(true);
    setTimeout(() => {
      setFilters({
        cidade: '',
        estado: '',
        tipo: '',
        status: '',
      });
      setAppliedFilters({
        cidade: '',
        estado: '',
        tipo: '',
        status: '',
      });
      setCurrentPage(1);
      setIsClearing(false);
    }, 300);
  };

  const filteredImoveis = imoveis.filter((imovel) => {
    return (
      (!appliedFilters.cidade || imovel.cidade.toLowerCase().includes(appliedFilters.cidade.toLowerCase())) &&
      (!appliedFilters.estado || imovel.estado.toLowerCase().includes(appliedFilters.estado.toLowerCase())) &&
      (!appliedFilters.tipo || imovel.tipo === appliedFilters.tipo) &&
      (!appliedFilters.status || imovel.status === appliedFilters.status)
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredImoveis.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedImoveis = filteredImoveis.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-600 text-lg">Erro ao carregar imóveis. Tente novamente.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Imóveis</h1>
          <button onClick={() => openModal()} className="btn-primary md:hidden">
            Novo Imóvel
          </button>
        </div>

        <div className="hidden md:block bg-white rounded-lg shadow-md border-l-4 border-primary-600 overflow-hidden mb-4">
          <div 
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-50 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <h2 className="text-gray-700 font-semibold text-sm tracking-wide uppercase px-4">Filtros</h2>
            <svg 
              className={`w-5 h-5 text-gray-600 transition-transform duration-300 mr-4 ${showFilters ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {showFilters && (
            <div className="px-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                  <input 
                    type="text" 
                    name="cidade" 
                    value={filters.cidade} 
                    onChange={handleFilterChange} 
                    className="input-field py-1.5 text-sm" 
                    placeholder="Buscar por cidade"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <input 
                    type="text" 
                    name="estado" 
                    value={filters.estado} 
                    onChange={handleFilterChange} 
                    className="input-field py-1.5 text-sm" 
                    placeholder="Ex: SP"
                    maxLength="2"
                  />
                </div>
                
                <div className="md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select 
                    name="tipo" 
                    value={filters.tipo} 
                    onChange={handleFilterChange} 
                    className="input-field py-1.5 text-sm"
                  >
                    <option value="">Todos</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="casa">Casa</option>
                    <option value="comercial">Comercial</option>
                    <option value="terreno">Terreno</option>
                    <option value="chacara">Chácara</option>
                  </select>
                </div>
                
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select 
                    name="status" 
                    value={filters.status} 
                    onChange={handleFilterChange} 
                    className="input-field py-1.5 text-sm"
                  >
                    <option value="">Todos</option>
                    <option value="disponivel">Disponível</option>
                    <option value="alugado">Alugado</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {showFilters && (
          <div className="hidden md:flex gap-3 mb-4">
            <button 
              onClick={handleSearch}
              disabled={isSearching}
              className="btn-primary inline-flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
              Pesquisar
            </button>
            <button 
              onClick={clearFilters}
              disabled={isClearing}
              className="btn-secondary inline-flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isClearing ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              Limpar
            </button>
          </div>
        )}

        <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-transparent overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-primary-gradient">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">Nome</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">Endereço</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">Cidade</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">UF</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">Tipo</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">Quartos</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">Área</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">Valor</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">Situação</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedImoveis.map((imovel) => (
                <tr
                  key={imovel.id}
                  onClick={() => setSelectedRow(imovel)}
                  className={`cursor-pointer transition-all duration-200 ${selectedRow?.id === imovel.id ? 'bg-primary-gradient-soft' : 'hover:bg-gray-50'}`}
                >
                  <td className={`px-4 py-2 text-sm font-medium text-gray-900 ${selectedRow?.id === imovel.id ? 'border-l-4 border-primary-600' : ''}`}>{imovel.nome || 'Sem nome'}</td>
                  <td className="px-4 py-2 text-sm text-gray-500">{imovel.endereco}, {imovel.numero}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{imovel.cidade}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{imovel.estado}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 capitalize">{imovel.tipo}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{imovel.quartos}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{imovel.area} m²</td>
                  <td className="px-4 py-2 text-sm font-medium text-primary-600">{formatCurrency(imovel.valorAluguel)}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${imovel.status === 'disponivel' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {imovel.status === 'disponivel' ? 'Disponível' : 'Alugado'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="hidden md:flex justify-between items-center mt-4 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200 w-full">
          {/* Botões de ação à esquerda */}
          <div className="flex gap-3">
            <button 
              onClick={() => openModal()}
              className="btn-primary inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Novo
            </button>
            <button 
              onClick={handleEdit}
              disabled={!selectedRow}
              className="btn-secondary inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar
            </button>
            <button 
              onClick={handleDeleteSelected}
              disabled={!selectedRow || deleteImovel.isPending}
              className="btn-danger inline-flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {deleteImovel.isPending ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
              Excluir
            </button>
          </div>

          {/* Paginação à direita */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Total: {filteredImoveis.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Itens por página:</span>
              <select 
                value={itemsPerPage} 
                onChange={handleItemsPerPageChange}
                className="input-field py-1 px-2 text-sm w-20"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                if (totalPages <= 7 || page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                        currentPage === page
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2 py-1 text-sm text-gray-500">...</span>;
                }
                return null;
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Próxima
              </button>
            </div>
          </div>
        </div>

        <div className="md:hidden space-y-4">
          {paginatedImoveis.map((imovel) => (
            <div key={imovel.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{imovel.nome || 'Sem nome'}</h3>
                  <p className="text-sm text-gray-500">{imovel.endereco}, {imovel.numero}</p>
                  <p className="text-sm text-gray-500">{imovel.cidade} - {imovel.estado}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${imovel.status === 'disponivel' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {imovel.status === 'disponivel' ? 'Disponível' : 'Alugado'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                  <span className="text-gray-500">Tipo:</span>
                  <span className="ml-1 font-medium capitalize">{imovel.tipo}</span>
                </div>
                <div>
                  <span className="text-gray-500">Quartos:</span>
                  <span className="ml-1 font-medium">{imovel.quartos}</span>
                </div>
                <div>
                  <span className="text-gray-500">Área:</span>
                  <span className="ml-1 font-medium">{imovel.area} m²</span>
                </div>
                <div>
                  <span className="text-gray-500">Valor:</span>
                  <span className="ml-1 font-medium text-primary-600">{formatCurrency(imovel.valorAluguel)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openModal(imovel)}
                  className="flex-1 btn-secondary text-sm py-2 inline-flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(imovel.id)}
                  disabled={deleteImovel.isPending}
                  className="flex-1 btn-danger text-sm py-2 inline-flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {deleteImovel.isPending ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingImovel ? 'Editar Imóvel' : 'Novo Imóvel'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Imóvel
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Ex: Apartamento Centro"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Endereço *
                    </label>
                    <input
                      type="text"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="Rua, Avenida, etc."
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número *
                    </label>
                    <input
                      type="text"
                      name="numero"
                      value={formData.numero}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Complemento
                    </label>
                    <input
                      type="text"
                      name="complemento"
                      value={formData.complemento}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Apto, Bloco, etc."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      name="bairro"
                      value={formData.bairro}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado *
                    </label>
                    <input
                      type="text"
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      required
                      maxLength="2"
                      className="input-field"
                      placeholder="Ex: SP"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CEP *
                    </label>
                    <input
                      type="text"
                      name="cep"
                      value={formData.cep}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="00000-000"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo *
                    </label>
                    <select
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleChange}
                      required
                      className="input-field"
                    >
                      <option value="apartamento">Apartamento</option>
                      <option value="casa">Casa</option>
                      <option value="comercial">Comercial</option>
                      <option value="terreno">Terreno</option>
                      <option value="chacara">Chácara</option>
                    </select>
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quartos *
                    </label>
                    <input
                      type="number"
                      name="quartos"
                      value={formData.quartos}
                      onChange={handleChange}
                      required
                      min="0"
                      className="input-field"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Banheiros *
                    </label>
                    <input
                      type="number"
                      name="banheiros"
                      value={formData.banheiros}
                      onChange={handleChange}
                      required
                      min="0"
                      className="input-field"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Área (m²) *
                    </label>
                    <input
                      type="number"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="input-field"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor do Aluguel (R$) *
                    </label>
                    <input
                      type="number"
                      name="valorAluguel"
                      value={formData.valorAluguel}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="input-field"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                      className="input-field"
                    >
                      <option value="disponivel">Disponível</option>
                      <option value="alugado">Alugado</option>
                    </select>
                  </div>

                  <div className="md:col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observações
                    </label>
                    <textarea
                      name="observacoes"
                      value={formData.observacoes || ''}
                      onChange={handleChange}
                      rows="3"
                      className="input-field"
                      placeholder="Informações adicionais sobre o imóvel"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={createImovel.isPending || updateImovel.isPending}
                    className="btn-primary inline-flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {(createImovel.isPending || updateImovel.isPending) ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Salvando...
                      </>
                    ) : (
                      'Salvar'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Imoveis;
