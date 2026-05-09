import { useState } from 'react';
import Layout from '../../components/Layout';
import ImoveisModal from './ImoveisModal';
import DataTable from '../../components/DataTable';
import ActionButtons from '../../components/ActionButtons';
import FilterPanel, { FilterField } from '../../components/FilterPanel';
import StatusBadge from '../../components/StatusBadge';
import Pagination from '../../components/Pagination';
import { useImoveis, useCreateImovel, useUpdateImovel, useDeleteImovel } from './useImoveis';
import { useToast } from '../../context/ToastContext.jsx';

const Imoveis = () => {
  const { data: imoveis = [], isLoading, error } = useImoveis();
  const createImovel = useCreateImovel();
  const updateImovel = useUpdateImovel();
  const deleteImovel = useDeleteImovel();

  const toast = useToast();

  const emptyForm = { nome:'', endereco:'', numero:'', complemento:'', bairro:'', cidade:'', estado:'', cep:'', tipo:'apartamento', quartos:'', banheiros:'', area:'', valorAluguel:'', status:'disponivel', observacoes:'' };

  const [showModal, setShowModal] = useState(false);
  const [editingImovel, setEditingImovel] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ cidade:'', estado:'', tipo:'', status:'' });
  const [applied, setApplied] = useState({ cidade:'', estado:'', tipo:'', status:'' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isSearching, setIsSearching] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const temContratoAtivo = (im) => im?.contratos?.some((c) => c.status === 'ativo');
  const isPending = createImovel.isPending || updateImovel.isPending;

  const openModal = (imovel = null, viewMode = false) => {
    setEditingImovel(imovel);
    setIsViewMode(viewMode);
    setFormData(imovel ? {
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
      status: temContratoAtivo(imovel) ? 'alugado' : 'disponivel',
      observacoes: imovel.observacoes || ''
    } : emptyForm);
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingImovel(null); setIsViewMode(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { status, ...data } = formData; // status é indicativo (derivado de contrato ativo)
    try {
      if (editingImovel) {
        await updateImovel.mutateAsync({ id: editingImovel.id, data });
        toast.success('Imóvel atualizado', 'Alterações salvas com sucesso.');
      } else {
        await createImovel.mutateAsync(data);
        toast.success('Imóvel cadastrado', 'Registro salvo com sucesso.');
      }
      closeModal();
    } catch {
      toast.error('Erro ao salvar imóvel', 'Tente novamente.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente excluir este imóvel?')) return;
    try {
      await deleteImovel.mutateAsync(id);
      toast.success('Imóvel excluído', 'Registro removido com sucesso.');
    } catch {
      toast.error('Erro ao excluir imóvel', 'Tente novamente.');
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
    const em = { cidade:'', estado:'', tipo:'', status:'' };
    setTimeout(() => { setFilters(em); setApplied(em); setCurrentPage(1); setIsClearing(false); }, 300);
  };

  const filtered = imoveis.filter(im =>
    (!applied.cidade || im.cidade.toLowerCase().includes(applied.cidade.toLowerCase())) &&
    (!applied.estado || im.estado.toLowerCase().includes(applied.estado.toLowerCase())) &&
    (!applied.tipo || im.tipo === applied.tipo) &&
    (!applied.status || im.status === applied.status)
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const fmtCurrency = (v) => new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(v);
  const tipoLabel = { apartamento:'Apartamento', casa:'Casa', comercial:'Comercial', terreno:'Terreno', chacara:'Chácara' };

  const Spinner = () => (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  );

  if (isLoading) return (
    <Layout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"/>
      </div>
    </Layout>
  );
  if (error) return (
    <Layout>
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">Erro ao carregar imóveis. Tente novamente.</p>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div>
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Imóveis</h1>
          <button onClick={() => openModal()} className="btn-primary md:hidden">Novo Imóvel</button>
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
            <FilterField label="Cidade" className="col-span-12 sm:col-span-6 lg:col-span-3">
              <input 
                type="text" 
                name="cidade" 
                value={filters.cidade} 
                onChange={handleFilterChange} 
                className="input-field py-1.5 text-sm" 
                placeholder="Buscar por cidade"
              />
            </FilterField>

            <FilterField label="Estado" className="col-span-12 sm:col-span-6 lg:col-span-2">
              <input 
                type="text" 
                name="estado" 
                value={filters.estado} 
                onChange={handleFilterChange} 
                className="input-field py-1.5 text-sm" 
                placeholder="SP" 
                maxLength="2"
              />
            </FilterField>

            <FilterField label="Tipo" className="col-span-12 sm:col-span-6 lg:col-span-4">
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
            </FilterField>

            <FilterField label="Status" className="col-span-12 sm:col-span-6 lg:col-span-3">
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
            </FilterField>
          </FilterPanel>
        </div>

        {/* Tabela Desktop */}
        <DataTable
          columns={[
            { header: 'Cód. Imóvel', accessor: 'codigo' },
            { header: 'Nome', accessor: 'nome', render: (im) => im.nome || '-' },
            { header: 'Endereço', accessor: 'endereco', render: (im) => `${im.endereco}${im.numero ? `, ${im.numero}` : ''}` },
            { header: 'Cidade', accessor: 'cidade' },
            { header: 'UF', accessor: 'estado' },
            { header: 'Tipo', accessor: 'tipo', render: (im) => tipoLabel[im.tipo] || im.tipo },
            { header: 'Quartos', accessor: 'quartos', render: (im) => im.quartos ?? '-', className: 'text-center' },
            { header: 'Área', accessor: 'area', render: (im) => im.area ? `${im.area} m²` : '-' },
            { header: 'Valor', accessor: 'valorAluguel', render: (im) => im.valorAluguel ? fmtCurrency(im.valorAluguel) : '-' },
            { 
              header: 'Situação', 
              accessor: 'status', 
              render: (im) => (
                <StatusBadge 
                  status={im.status === 'alugado' ? 'Alugado' : 'Disponível'}
                  colorMap={{ 'Alugado': 'blue', 'Disponível': 'green' }}
                />
              )
            }
          ]}
          data={paginated}
          selectedRow={selectedRow}
          onRowClick={setSelectedRow}
          emptyMessage="Nenhum imóvel encontrado."
          onNew={() => openModal()}
          onEdit={() => selectedRow && openModal(selectedRow, temContratoAtivo(selectedRow))}
          onDelete={() => selectedRow && handleDelete(selectedRow.id)}
          editLabel={selectedRow && temContratoAtivo(selectedRow) ? 'Visualizar' : 'Editar'}
          editDisabled={!selectedRow}
          deleteDisabled={!selectedRow || temContratoAtivo(selectedRow)}
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

        {/* Cards Mobile */}
        <div className="md:hidden space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">Nenhum imóvel encontrado.</div>
          ) : filtered.map(im => (
            <div key={im.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-800">{im.nome || im.endereco}</p>
                  <p className="text-sm text-gray-500">{im.cidade} - {im.estado}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${im.status === 'alugado' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                  {im.status === 'alugado' ? 'Alugado' : 'Disponível'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{tipoLabel[im.tipo] || im.tipo} · {im.quartos ? `${im.quartos} quartos` : ''} {im.area ? `· ${im.area}m²` : ''}</p>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-primary-700">{im.valorAluguel ? fmtCurrency(im.valorAluguel) : '-'}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(im, temContratoAtivo(im))}
                    className="btn-secondary !py-1.5 !px-3 !text-xs flex-1"
                  >
                    {temContratoAtivo(im) ? 'Visualizar' : 'Editar'}
                  </button>
                  <button
                    onClick={() => handleDelete(im.id)}
                    disabled={temContratoAtivo(im)}
                    className="btn-danger !py-1.5 !px-3 !text-xs flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ImoveisModal
        show={showModal}
        onClose={closeModal}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        editingImovel={editingImovel}
        isViewMode={isViewMode}
        isPending={isPending}
      />
    </Layout>
  );
};

export default Imoveis;
