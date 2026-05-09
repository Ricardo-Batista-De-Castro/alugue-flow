import { useState, useMemo } from 'react';
import Layout from '../../components/Layout';
import PessoasModal from './PessoasModal';
import DataTable from '../../components/DataTable';
import ActionButtons from '../../components/ActionButtons';
import FilterPanel, { FilterField } from '../../components/FilterPanel';
import StatusBadge from '../../components/StatusBadge';
import Pagination from '../../components/Pagination';
import { usePessoas, useCreatePessoa, useUpdatePessoa } from './usePessoas';

const Pessoas = () => {
  const { data: pessoas = [], isLoading, error } = usePessoas();
  const createPessoa = useCreatePessoa();
  const updatePessoa = useUpdatePessoa();

  const emptyForm = { nome: '', email: '', telefone: '', cpf: '', rg: '', profissao: '', situacao: 'EM_CADASTRO', rendaMensal: '', acessoDashboard: false };

  const [showModal, setShowModal] = useState(false);
  const [editingPessoa, setEditingPessoa] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ nome: '', email: '', cpf: '', profissao: '', situacao: '' });
  const [applied, setApplied] = useState({ nome: '', email: '', cpf: '', profissao: '', situacao: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isSearching, setIsSearching] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const isPending = createPessoa.isPending || updatePessoa.isPending;

  const openModal = (pessoa = null) => {
    setEditingPessoa(pessoa);
    setFormData(pessoa ? {
      nome: pessoa.nome || '',
      email: pessoa.email || '',
      telefone: pessoa.telefone || '',
      cpf: pessoa.cpf || '',
      rg: pessoa.rg || '',
      profissao: pessoa.profissao || '',
      situacao: pessoa.situacao || 'EM_CADASTRO',
      rendaMensal: pessoa.rendaMensal || '',
      acessoDashboard: pessoa.acessoDashboard || false,
    } : emptyForm);
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingPessoa(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPessoa) await updatePessoa.mutateAsync({ id: editingPessoa.id, data: formData });
      else await createPessoa.mutateAsync(formData);
      closeModal();
    } catch { alert('Erro ao salvar pessoa'); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === 'acessoDashboard' ? value === 'true' : value;
    setFormData({ ...formData, [name]: finalValue });
  };
  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => { setApplied(filters); setCurrentPage(1); setIsSearching(false); }, 300);
  };

  const clearFilters = () => {
    setIsClearing(true);
    const em = { nome: '', email: '', cpf: '', profissao: '', situacao: '' };
    setTimeout(() => { setFilters(em); setApplied(em); setCurrentPage(1); setIsClearing(false); }, 300);
  };

  const filtered = useMemo(() => pessoas.filter(p =>
    (!applied.nome || p.nome.toLowerCase().includes(applied.nome.toLowerCase())) &&
    (!applied.email || p.email.toLowerCase().includes(applied.email.toLowerCase())) &&
    (!applied.cpf || p.cpf.includes(applied.cpf)) &&
    (!applied.profissao || (p.profissao && p.profissao.toLowerCase().includes(applied.profissao.toLowerCase()))) &&
    (!applied.situacao || p.situacao === applied.situacao)
  ), [pessoas, applied]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const fmtCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

  const situacaoBadge = (s) => {
    const map = {
      EM_CADASTRO: { text: 'Em Cadastro', cls: 'bg-yellow-100 text-yellow-800' },
      ATIVO: { text: 'Ativo', cls: 'bg-green-100 text-green-800' },
      INATIVO: { text: 'Inativo', cls: 'bg-red-100 text-red-800' },
      BLOQUEADO: { text: 'Bloqueado', cls: 'bg-gray-100 text-gray-800' },
    };
    const b = map[s] || map.EM_CADASTRO;
    return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${b.cls}`}>{b.text}</span>;
  };

  const Spinner = () => (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );

  if (isLoading) return (
    <Layout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    </Layout>
  );

  if (error) return (
    <Layout>
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">Erro ao carregar pessoas. Tente novamente.</p>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div>
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Pessoas</h1>
          <button onClick={() => openModal()} className="btn-primary md:hidden">Nova Pessoa</button>
        </div>

        {/* Painel de Filtros */}
        <div className="hidden md:block">
          <FilterPanel
            title="Filtros"
            onSearch={handleSearch}
            onClear={clearFilters}
            isSearching={isSearching}
            defaultExpanded={false}
          >
            <FilterField label="Nome" className="col-span-12 sm:col-span-6 lg:col-span-3">
              <input 
                type="text" 
                name="nome" 
                value={filters.nome} 
                onChange={handleFilterChange} 
                className="input-field py-1.5 text-sm" 
                placeholder="Buscar por nome"
              />
            </FilterField>

            <FilterField label="Email" className="col-span-12 sm:col-span-6 lg:col-span-3">
              <input 
                type="text" 
                name="email" 
                value={filters.email} 
                onChange={handleFilterChange} 
                className="input-field py-1.5 text-sm" 
                placeholder="Buscar por email"
              />
            </FilterField>

            <FilterField label="CPF" className="col-span-12 sm:col-span-6 lg:col-span-2">
              <input 
                type="text" 
                name="cpf" 
                value={filters.cpf} 
                onChange={handleFilterChange} 
                className="input-field py-1.5 text-sm" 
                placeholder="000.000.000-00"
              />
            </FilterField>

            <FilterField label="Profissão" className="col-span-12 sm:col-span-6 lg:col-span-2">
              <input 
                type="text" 
                name="profissao" 
                value={filters.profissao} 
                onChange={handleFilterChange} 
                className="input-field py-1.5 text-sm" 
                placeholder="Profissão"
              />
            </FilterField>

            <FilterField label="Situação" className="col-span-12 sm:col-span-6 lg:col-span-2">
              <select 
                name="situacao" 
                value={filters.situacao} 
                onChange={handleFilterChange} 
                className="input-field py-1.5 text-sm"
              >
                <option value="">Todas</option>
                <option value="EM_CADASTRO">Em Cadastro</option>
                <option value="ATIVO">Ativo</option>
                <option value="INATIVO">Inativo</option>
                <option value="BLOQUEADO">Bloqueado</option>
              </select>
            </FilterField>
          </FilterPanel>
        </div>

        {/* Tabela Desktop */}
        <DataTable
          columns={[
            { header: 'Nome', accessor: 'nome', className: 'font-medium' },
            { header: 'Email', accessor: 'email' },
            { header: 'Telefone', accessor: 'telefone' },
            { header: 'CPF', accessor: 'cpf' },
            { header: 'Profissão', accessor: 'profissao', render: (p) => p.profissao || '-' },
            { header: 'Renda Mensal', accessor: 'rendaMensal', render: (p) => fmtCurrency(p.rendaMensal) },
            { 
              header: 'Dashboard', 
              accessor: 'acessoDashboard', 
              render: (p) => p.acessoDashboard ? (
                <StatusBadge 
                  status="Sim" 
                  colorMap={{ 'Sim': 'blue' }} 
                />
              ) : null
            },
            { 
              header: 'Situação', 
              accessor: 'situacao', 
              render: (p) => {
                const statusMap = {
                  'EM_CADASTRO': { label: 'Em Cadastro', color: 'yellow' },
                  'ATIVO': { label: 'Ativo', color: 'green' },
                  'INATIVO': { label: 'Inativo', color: 'red' },
                  'BLOQUEADO': { label: 'Bloqueado', color: 'gray' }
                };
                const status = statusMap[p.situacao] || statusMap['EM_CADASTRO'];
                return <StatusBadge status={status.label} colorMap={{ [status.label]: status.color }} />;
              }
            }
          ]}
          data={paginated}
          selectedRow={selectedRow}
          onRowClick={setSelectedRow}
          emptyMessage="Nenhuma pessoa encontrada."
          onNew={() => openModal()}
          onEdit={() => selectedRow && openModal(selectedRow)}
          editDisabled={!selectedRow}
          showDelete={false}
          pagination={{
            currentPage,
            totalPages,
            totalItems: filtered.length,
            itemsPerPage,
            onPageChange: setCurrentPage,
            onItemsPerPageChange: (value) => {
              setItemsPerPage(value);
              setCurrentPage(1);
            }
          }}
        />

        {/* Cards mobile */}
        <div className="md:hidden space-y-4">
          <button onClick={() => openModal()} className="btn-primary w-full mb-2">Nova Pessoa</button>
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Nenhuma pessoa encontrada.</p>
          ) : filtered.map(p => (
            <div key={p.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800">{p.nome}</h3>
                {situacaoBadge(p.situacao)}
              </div>
              <p className="text-sm text-gray-600">{p.email}</p>
              <p className="text-sm text-gray-600">{p.telefone}</p>
              <p className="text-sm text-gray-600">CPF: {p.cpf}</p>
              {p.profissao && <p className="text-sm text-gray-600">Profissão: {p.profissao}</p>}
              <p className="text-sm text-gray-600">Renda: {fmtCurrency(p.rendaMensal)}</p>
              {p.acessoDashboard && (
                <p className="text-sm text-gray-600">
                  Dashboard: 
                  <span className="ml-1 inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    Sim
                  </span>
                </p>
              )}
              <button onClick={() => openModal(p)} className="btn-secondary w-full mt-3 text-sm">Editar</button>
            </div>
          ))}
        </div>
      </div>

      <PessoasModal
        show={showModal}
        onClose={closeModal}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        editingPessoa={editingPessoa}
        isPending={isPending}
      />
    </Layout>
  );
};

export default Pessoas;
