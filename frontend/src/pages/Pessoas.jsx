import { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { usePessoas, useCreatePessoa, useUpdatePessoa, useDeletePessoa } from '../hooks/usePessoas';

const Pessoas = () => {
  const { data: pessoas = [], isLoading, error } = usePessoas();
  const createPessoa = useCreatePessoa();
  const updatePessoa = useUpdatePessoa();
  const deletePessoa = useDeletePessoa();

  const [showModal, setShowModal] = useState(false);
  const [editingPessoa, setEditingPessoa] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    rg: '',
    profissao: '',
    rendaMensal: '',
  });

  const [filters, setFilters] = useState({
    nome: '',
    email: '',
    cpf: '',
    profissao: '',
  });

  const [appliedFilters, setAppliedFilters] = useState({
    nome: '',
    email: '',
    cpf: '',
    profissao: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
        nome: '',
        email: '',
        cpf: '',
        profissao: '',
      });
      setAppliedFilters({
        nome: '',
        email: '',
        cpf: '',
        profissao: '',
      });
      setCurrentPage(1);
      setIsClearing(false);
    }, 300);
  };

  const filteredPessoas = useMemo(() => {
    return pessoas.filter((pessoa) => {
      const matchNome = !appliedFilters.nome || pessoa.nome.toLowerCase().includes(appliedFilters.nome.toLowerCase());
      const matchEmail = !appliedFilters.email || pessoa.email.toLowerCase().includes(appliedFilters.email.toLowerCase());
      const matchCpf = !appliedFilters.cpf || pessoa.cpf.includes(appliedFilters.cpf);
      const matchProfissao = !appliedFilters.profissao || (pessoa.profissao && pessoa.profissao.toLowerCase().includes(appliedFilters.profissao.toLowerCase()));
      
      return matchNome && matchEmail && matchCpf && matchProfissao;
    });
  }, [pessoas, appliedFilters]);

  const totalPages = Math.ceil(filteredPessoas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPessoas = filteredPessoas.slice(startIndex, endIndex);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPessoa) {
        await updatePessoa.mutateAsync({ id: editingPessoa.id, data: formData });
      } else {
        await createPessoa.mutateAsync(formData);
      }
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar pessoa:', error);
      alert('Erro ao salvar pessoa');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente excluir esta pessoa?')) return;
    try {
      await deletePessoa.mutateAsync(id);
    } catch (error) {
      console.error('Erro ao excluir pessoa:', error);
      alert('Erro ao excluir pessoa');
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedRow) {
      alert('Selecione uma pessoa para excluir');
      return;
    }
    await handleDelete(selectedRow.id);
    setSelectedRow(null);
  };

  const handleEdit = () => {
    if (!selectedRow) {
      alert('Selecione uma pessoa para editar');
      return;
    }
    openModal(selectedRow);
  };

  const openModal = (pessoa = null) => {
    if (pessoa) {
      setEditingPessoa(pessoa);
      setFormData({
        nome: pessoa.nome,
        email: pessoa.email,
        telefone: pessoa.telefone,
        cpf: pessoa.cpf,
        rg: pessoa.rg,
        profissao: pessoa.profissao,
        rendaMensal: pessoa.rendaMensal,
      });
    } else {
      setEditingPessoa(null);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        rg: '',
        profissao: '',
        rendaMensal: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPessoa(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
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
          <p className="text-red-600 text-lg">Erro ao carregar pessoas. Tente novamente.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Pessoas</h1>
          <button onClick={() => openModal()} className="btn-primary md:hidden">
            Nova Pessoa
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input 
                    type="text" 
                    name="nome" 
                    value={filters.nome} 
                    onChange={handleFilterChange} 
                    className="input-field py-1.5 text-sm" 
                    placeholder="Buscar por nome"
                  />
                </div>
                
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="text" 
                    name="email" 
                    value={filters.email} 
                    onChange={handleFilterChange} 
                    className="input-field py-1.5 text-sm" 
                    placeholder="Buscar por email"
                  />
                </div>
                
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                  <input 
                    type="text" 
                    name="cpf" 
                    value={filters.cpf} 
                    onChange={handleFilterChange} 
                    className="input-field py-1.5 text-sm" 
                    placeholder="Buscar por CPF"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profissão</label>
                  <input 
                    type="text" 
                    name="profissao" 
                    value={filters.profissao} 
                    onChange={handleFilterChange} 
                    className="input-field py-1.5 text-sm" 
                    placeholder="Buscar por profissão"
                  />
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
                <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">Email</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">Telefone</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">CPF</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">Profissão</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">Renda Mensal</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedPessoas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    Nenhuma pessoa encontrada
                  </td>
                </tr>
              ) : (
                paginatedPessoas.map((pessoa) => (
                  <tr
                    key={pessoa.id}
                    onClick={() => setSelectedRow(pessoa)}
                    className={`hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
                      selectedRow?.id === pessoa.id 
                        ? 'bg-primary-gradient-soft border-l-4 border-l-primary-600' 
                        : 'border-l-4 border-l-transparent'
                    }`}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">{pessoa.nome}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{pessoa.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{pessoa.telefone}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{pessoa.cpf}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{pessoa.profissao || '-'}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(pessoa.rendaMensal)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="hidden md:flex justify-between items-center mt-4 gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => openModal()}
              disabled={createPessoa.isPending}
              className="btn-primary inline-flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {createPessoa.isPending ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
              Novo
            </button>
            <button 
              onClick={handleEdit}
              disabled={!selectedRow || updatePessoa.isPending}
              className="btn-secondary inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updatePessoa.isPending ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              )}
              Editar
            </button>
            <button 
              onClick={handleDeleteSelected}
              disabled={!selectedRow || deletePessoa.isPending}
              className="btn-danger inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deletePessoa.isPending ? (
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

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Total: {filteredPessoas.length}
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
          {paginatedPessoas.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
              Nenhuma pessoa encontrada
            </div>
          ) : (
            paginatedPessoas.map((pessoa) => (
              <div key={pessoa.id} className="bg-white p-4 rounded-lg shadow">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900">{pessoa.nome}</h3>
                  <p className="text-sm text-gray-500">{pessoa.email}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Telefone:</span>
                    <span className="text-gray-900">{pessoa.telefone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">CPF:</span>
                    <span className="text-gray-900">{pessoa.cpf}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">RG:</span>
                    <span className="text-gray-900">{pessoa.rg}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profissão:</span>
                    <span className="text-gray-900">{pessoa.profissao || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Renda:</span>
                    <span className="text-gray-900 font-semibold">{formatCurrency(pessoa.rendaMensal)}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => openModal(pessoa)} className="btn-secondary flex-1 text-sm">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(pessoa.id)} className="btn-danger flex-1 text-sm">
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingPessoa ? 'Editar Pessoa' : 'Nova Pessoa'}
                </h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">Nome Completo</label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="label-field">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="label-field">Telefone</label>
                    <input
                      type="text"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="label-field">CPF</label>
                    <input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="label-field">RG</label>
                    <input
                      type="text"
                      name="rg"
                      value={formData.rg}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="label-field">Profissão</label>
                    <input
                      type="text"
                      name="profissao"
                      value={formData.profissao}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="label-field">Renda Mensal</label>
                    <input
                      type="number"
                      name="rendaMensal"
                      value={formData.rendaMensal}
                      onChange={handleChange}
                      className="input-field"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={createPessoa.isPending || updatePessoa.isPending}
                    className="btn-primary flex-1 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {createPessoa.isPending || updatePessoa.isPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Salvando...
                      </span>
                    ) : (
                      editingPessoa ? 'Atualizar' : 'Criar'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-secondary flex-1"
                  >
                    Cancelar
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

export default Pessoas;
