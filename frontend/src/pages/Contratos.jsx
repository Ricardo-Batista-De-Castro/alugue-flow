import { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';

const Contratos = () => {
  const [contratos, setContratos] = useState([]);
  const [imoveis, setImoveis] = useState([]);
  const [inquilinos, setInquilinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingContrato, setEditingContrato] = useState(null);
  const [formData, setFormData] = useState({
    imovelId: '',
    inquilinoId: '',
    dataInicio: '',
    dataFim: '',
    valorAluguel: '',
    diaVencimento: '',
    observacoes: '',
    status: 'ativo',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [contratosRes, imoveisRes, inquilinosRes] = await Promise.all([
        api.get('/api/contratos'),
        api.get('/api/imoveis'),
        api.get('/api/inquilinos'),
      ]);
      setContratos(contratosRes.data);
      setImoveis(imoveisRes.data);
      setInquilinos(inquilinosRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingContrato) {
        await api.put(`/api/contratos/${editingContrato.id}`, formData);
      } else {
        await api.post('/api/contratos', formData);
      }
      loadData();
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar contrato:', error);
      alert('Erro ao salvar contrato');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente excluir este contrato?')) return;
    try {
      await api.delete(`/api/contratos/${id}`);
      loadData();
    } catch (error) {
      console.error('Erro ao excluir contrato:', error);
      alert('Erro ao excluir contrato');
    }
  };

  const openModal = (contrato = null) => {
    if (contrato) {
      setEditingContrato(contrato);
      setFormData({
        imovelId: contrato.imovelId,
        inquilinoId: contrato.inquilinoId,
        dataInicio: contrato.dataInicio.split('T')[0],
        dataFim: contrato.dataFim.split('T')[0],
        valorAluguel: contrato.valorAluguel,
        diaVencimento: contrato.diaVencimento,
        observacoes: contrato.observacoes || '',
        status: contrato.status,
      });
    } else {
      setEditingContrato(null);
      setFormData({
        imovelId: '',
        inquilinoId: '',
        dataInicio: '',
        dataFim: '',
        valorAluguel: '',
        diaVencimento: '',
        observacoes: '',
        status: 'ativo',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingContrato(null);
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Contratos</h1>
          <button onClick={() => openModal()} className="btn-primary">
            Novo Contrato
          </button>
        </div>

        <div className="space-y-4">
          {contratos.map((contrato) => (
            <div key={contrato.id} className="card">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-800">
                      {contrato.imovel.endereco}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      contrato.status === 'ativo'
                        ? 'bg-green-100 text-green-800'
                        : contrato.status === 'encerrado'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {contrato.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Inquilino:</span> {contrato.inquilino.nome}
                    </div>
                    <div>
                      <span className="font-medium">Valor:</span> {formatCurrency(contrato.valorAluguel)}
                    </div>
                    <div>
                      <span className="font-medium">Início:</span> {formatDate(contrato.dataInicio)}
                    </div>
                    <div>
                      <span className="font-medium">Fim:</span> {formatDate(contrato.dataFim)}
                    </div>
                    <div>
                      <span className="font-medium">Vencimento:</span> Dia {contrato.diaVencimento}
                    </div>
                  </div>
                  {contrato.observacoes && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Observações:</span> {contrato.observacoes}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(contrato)}
                    className="btn-secondary"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(contrato.id)}
                    className="btn-danger"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {contratos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Nenhum contrato cadastrado ainda.</p>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {editingContrato ? 'Editar Contrato' : 'Novo Contrato'}
                </h2>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Imóvel
                      </label>
                      <select
                        name="imovelId"
                        value={formData.imovelId}
                        onChange={handleChange}
                        className="input-field"
                        required
                      >
                        <option value="">Selecione um imóvel</option>
                        {imoveis.map((imovel) => (
                          <option key={imovel.id} value={imovel.id}>
                            {imovel.endereco} - {imovel.cidade}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Inquilino
                      </label>
                      <select
                        name="inquilinoId"
                        value={formData.inquilinoId}
                        onChange={handleChange}
                        className="input-field"
                        required
                      >
                        <option value="">Selecione um inquilino</option>
                        {inquilinos.map((inquilino) => (
                          <option key={inquilino.id} value={inquilino.id}>
                            {inquilino.nome}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Data de Início
                      </label>
                      <input
                        type="date"
                        name="dataInicio"
                        value={formData.dataInicio}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Data de Fim
                      </label>
                      <input
                        type="date"
                        name="dataFim"
                        value={formData.dataFim}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Valor do Aluguel
                      </label>
                      <input
                        type="number"
                        name="valorAluguel"
                        value={formData.valorAluguel}
                        onChange={handleChange}
                        className="input-field"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Dia de Vencimento
                      </label>
                      <input
                        type="number"
                        name="diaVencimento"
                        value={formData.diaVencimento}
                        onChange={handleChange}
                        className="input-field"
                        required
                        min="1"
                        max="31"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="input-field"
                        required
                      >
                        <option value="ativo">Ativo</option>
                        <option value="encerrado">Encerrado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Observações
                      </label>
                      <textarea
                        name="observacoes"
                        value={formData.observacoes}
                        onChange={handleChange}
                        className="input-field"
                        rows="3"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button type="submit" className="btn-primary flex-1">
                      {editingContrato ? 'Salvar' : 'Cadastrar'}
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
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Contratos;
