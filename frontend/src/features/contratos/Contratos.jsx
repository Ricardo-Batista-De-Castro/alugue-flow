import { useState, useMemo } from 'react';
import Layout from '../../components/Layout';
import ContratosModal from './ContratosModal';
import DataTable from '../../components/DataTable';
import ActionButtons from '../../components/ActionButtons';
import FilterPanel, { FilterField } from '../../components/FilterPanel';
import StatusBadge from '../../components/StatusBadge';
import Pagination from '../../components/Pagination';
import { useContratos, useCreateContrato, useUpdateContrato, useDeleteContrato } from './useContratos';
import { useToast } from '../../context/ToastContext.jsx';

const Contratos = () => {
  const { data: contratos = [], isLoading, error } = useContratos();
  const createContrato = useCreateContrato();
  const updateContrato = useUpdateContrato();
  const deleteContrato = useDeleteContrato();

  const toast = useToast();

  const emptyForm = { imovelId: '', pessoaId: '', dataInicio: '', dataFim: '', valorAluguel: '', diaVencimento: '', observacoes: '', status: 'ativo' };

  const [showModal, setShowModal] = useState(false);
  const [editingContrato, setEditingContrato] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ pessoa: '', imovel: '', status: '' });
  const [applied, setApplied] = useState({ pessoa: '', imovel: '', status: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isSearching, setIsSearching] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const isPending = createContrato.isPending || updateContrato.isPending || deleteContrato.isPending;

  const openModal = (contrato = null) => {
    setEditingContrato(contrato);
    setFormData(contrato ? {
      imovelId: contrato.imovelId,
      pessoaId: contrato.pessoaId,
      dataInicio: contrato.dataInicio.split('T')[0],
      dataFim: contrato.dataFim.split('T')[0],
      valorAluguel: contrato.valorAluguel,
      diaVencimento: contrato.diaVencimento,
      observacoes: contrato.observacoes || '',
      status: contrato.status,
    } : emptyForm);
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingContrato(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingContrato) {
        await updateContrato.mutateAsync({ id: editingContrato.id, data: formData });
        toast.success('Contrato atualizado', 'Alterações salvas com sucesso.');
      } else {
        await createContrato.mutateAsync(formData);
        toast.success('Contrato cadastrado', 'Registro salvo com sucesso.');
      }
      closeModal();
    } catch {
      toast.error('Erro ao salvar contrato', 'Tente novamente.');
    }
  };

  const handleDelete = async () => {
    if (!selectedRow || !confirm('Deseja realmente excluir este contrato?')) return;
    try {
      await deleteContrato.mutateAsync(selectedRow.id);
      setSelectedRow(null);
      toast.success('Contrato excluído', 'Registro removido com sucesso.');
    } catch {
      toast.error('Erro ao excluir contrato', 'Tente novamente.');
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => { setApplied(filters); setCurrentPage(1); setIsSearching(false); }, 300);
  };

  const clearFilters = () => {
    setIsClearing(true);
    const em = { pessoa: '', imovel: '', status: '' };
    setTimeout(() => { setFilters(em); setApplied(em); setCurrentPage(1); setIsClearing(false); }, 300);
  };

  const filtered = useMemo(() => contratos.filter(c =>
    (!applied.pessoa || c.pessoa.nome.toLowerCase().includes(applied.pessoa.toLowerCase())) &&
    (!applied.imovel || c.imovel.endereco.toLowerCase().includes(applied.imovel.toLowerCase())) &&
    (!applied.status || c.status === applied.status)
  ), [contratos, applied]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const fmtCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
  const fmtDate = (d) => new Date(d).toLocaleDateString('pt-BR');

  const statusBadge = (s) => {
    const map = {
      ativo: { text: 'Ativo', cls: 'bg-green-100 text-green-800' },
      encerrado: { text: 'Encerrado', cls: 'bg-gray-100 text-gray-800' },
      cancelado: { text: 'Cancelado', cls: 'bg-red-100 text-red-800' },
    };
    const b = map[s] || map.ativo;
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
        <p className="text-red-600 text-lg">Erro ao carregar contratos. Tente novamente.</p>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Contratos</h1>
          <button onClick={() => openModal()} className="btn-primary md:hidden">Novo Contrato</button>
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
            <FilterField label="Pessoa" className="col-span-12 sm:col-span-6 lg:col-span-4">
              <input 
                type="text" 
                name="pessoa" 
                value={filters.pessoa} 
                onChange={handleFilterChange} 
                className="input-field py-1.5 text-sm" 
                placeholder="Buscar por pessoa"
              />
            </FilterField>

            <FilterField label="Imóvel" className="col-span-12 sm:col-span-6 lg:col-span-5">
              <input 
                type="text" 
                name="imovel" 
                value={filters.imovel} 
                onChange={handleFilterChange} 
                className="input-field py-1.5 text-sm" 
                placeholder="Buscar por endereço"
              />
            </FilterField>

            <FilterField label="Status" className="col-span-12 sm:col-span-6 lg:col-span-3">
              <select 
                name="status" 
                value={filters.status} 
                onChange={handleFilterChange} 
                className="input-field py-1.5 text-sm"
              >
                <option value="">Todos</option>
                <option value="ativo">Ativo</option>
                <option value="encerrado">Encerrado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </FilterField>
          </FilterPanel>
        </div>

        {/* Tabela Desktop */}
        <DataTable
          columns={[
            { 
              header: 'Imóvel', 
              accessor: 'imovel', 
              className: 'font-medium',
              render: (c) => (
                <div>
                  <div>{c.imovel.endereco}</div>
                  <div className="text-xs text-gray-500 font-normal">{c.imovel.cidade} - {c.imovel.estado}</div>
                </div>
              )
            },
            { header: 'Pessoa', accessor: 'pessoa', render: (c) => c.pessoa.nome },
            { header: 'Início', accessor: 'dataInicio', render: (c) => fmtDate(c.dataInicio) },
            { header: 'Fim', accessor: 'dataFim', render: (c) => fmtDate(c.dataFim) },
            { header: 'Valor', accessor: 'valorAluguel', render: (c) => fmtCurrency(c.valorAluguel) },
            { header: 'Vencimento', accessor: 'diaVencimento', render: (c) => `Dia ${c.diaVencimento}` },
            { 
              header: 'Status', 
              accessor: 'status', 
              render: (c) => {
                const statusMap = {
                  'ativo': { label: 'Ativo', color: 'green' },
                  'encerrado': { label: 'Encerrado', color: 'gray' },
                  'cancelado': { label: 'Cancelado', color: 'red' }
                };
                const status = statusMap[c.status] || statusMap['ativo'];
                return <StatusBadge status={status.label} colorMap={{ [status.label]: status.color }} />;
              }
            }
          ]}
          data={paginated}
          selectedRow={selectedRow}
          onRowClick={setSelectedRow}
          emptyMessage="Nenhum contrato encontrado."
          onNew={() => openModal()}
          onEdit={() => selectedRow && openModal(selectedRow)}
          onDelete={handleDelete}
          editDisabled={!selectedRow}
          deleteDisabled={!selectedRow}
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

        <div className="md:hidden space-y-4">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Nenhum contrato encontrado.</p>
          ) : filtered.map((c) => (
            <div key={c.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800">{c.pessoa.nome}</h3>
                {statusBadge(c.status)}
              </div>
              <p className="text-sm text-gray-600 font-medium">{c.imovel.endereco}</p>
              <p className="text-sm text-gray-500">{c.imovel.cidade} - {c.imovel.estado}</p>
              <p className="text-sm text-gray-600 mt-2">Período: {fmtDate(c.dataInicio)} a {fmtDate(c.dataFim)}</p>
              <p className="text-sm text-gray-600">Valor: {fmtCurrency(c.valorAluguel)}</p>
              <p className="text-sm text-gray-600">Vencimento: Dia {c.diaVencimento}</p>
              <div className="flex justify-end gap-2 mt-3">
                <button onClick={() => openModal(c)} className="btn-secondary !py-1.5 !px-3 !text-xs">
                  Editar
                </button>
                <button onClick={() => { setSelectedRow(c); handleDelete(); }} className="btn-danger !py-1.5 !px-3 !text-xs">
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <ContratosModal 
          editingContrato={editingContrato} 
          formData={formData} 
          onChange={handleChange} 
          onSubmit={handleSubmit} 
          onClose={closeModal} 
        />
      )}
    </Layout>
  );
};

export default Contratos;
