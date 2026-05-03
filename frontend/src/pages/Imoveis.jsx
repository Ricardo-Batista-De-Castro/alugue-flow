import { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';

const Imoveis = () => {
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingImovel, setEditingImovel] = useState(null);
  const [formData, setFormData] = useState({
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    tipo: 'apartamento',
    quartos: '',
    banheiros: '',
    area: '',
    valorAluguel: '',
    status: 'disponivel',
  });

  useEffect(() => {
    loadImoveis();
  }, []);

  const loadImoveis = async () => {
    try {
      const response = await api.get('/api/imoveis');
      setImoveis(response.data);
    } catch (error) {
      console.error('Erro ao carregar imóveis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingImovel) {
        await api.put(`/api/imoveis/${editingImovel.id}`, formData);
      } else {
        await api.post('/api/imoveis', formData);
      }
      loadImoveis();
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar imóvel:', error);
      alert('Erro ao salvar imóvel');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente excluir este imóvel?')) return;
    try {
      await api.delete(`/api/imoveis/${id}`);
      loadImoveis();
    } catch (error) {
      console.error('Erro ao excluir imóvel:', error);
      alert('Erro ao excluir imóvel');
    }
  };

  const openModal = (imovel = null) => {
    if (imovel) {
      setEditingImovel(imovel);
      setFormData({
        endereco: imovel.endereco,
        cidade: imovel.cidade,
        estado: imovel.estado,
        cep: imovel.cep,
        tipo: imovel.tipo,
        quartos: imovel.quartos,
        banheiros: imovel.banheiros,
        area: imovel.area,
        valorAluguel: imovel.valorAluguel,
        status: imovel.status,
      });
    } else {
      setEditingImovel(null);
      setFormData({
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
        tipo: 'apartamento',
        quartos: '',
        banheiros: '',
        area: '',
        valorAluguel: '',
        status: 'disponivel',
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
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
          <h1 className="text-3xl font-bold text-gray-800">Imóveis</h1>
          <button onClick={() => openModal()} className="btn-primary">
            Novo Imóvel
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {imoveis.map((imovel) => (
            <div key={imovel.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  imovel.status === 'disponivel'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {imovel.status}
                </span>
                <span className="text-sm text-gray-500">{imovel.tipo}</span>
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {imovel.endereco}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {imovel.cidade}, {imovel.estado}
              </p>

              <div className="grid grid-cols-3 gap-2 mb-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">{imovel.quartos}</span> quartos
                </div>
                <div>
                  <span className="font-medium">{imovel.banheiros}</span> banheiros
                </div>
                <div>
                  <span className="font-medium">{imovel.area}</span> m²
                </div>
              </div>

              <div className="mb-4">
                <p className="text-2xl font-bold text-primary-600">
                  {formatCurrency(imovel.valorAluguel)}
                </p>
                <p className="text-sm text-gray-500">por mês</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openModal(imovel)}
                  className="btn-secondary flex-1"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(imovel.id)}
                  className="btn-danger flex-1"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

        {imoveis.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Nenhum imóvel cadastrado ainda.</p>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {editingImovel ? 'Editar Imóvel' : 'Novo Imóvel'}
                </h2>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Endereço
                      </label>
                      <input
                        type="text"
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Cidade
                      </label>
                      <input
                        type="text"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Estado
                      </label>
                      <input
                        type="text"
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        className="input-field"
                        required
                        maxLength={2}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        CEP
                      </label>
                      <input
                        type="text"
                        name="cep"
                        value={formData.cep}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Tipo
                      </label>
                      <select
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleChange}
                        className="input-field"
                        required
                      >
                        <option value="apartamento">Apartamento</option>
                        <option value="casa">Casa</option>
                        <option value="kitnet">Kitnet</option>
                        <option value="comercial">Comercial</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Quartos
                      </label>
                      <input
                        type="number"
                        name="quartos"
                        value={formData.quartos}
                        onChange={handleChange}
                        className="input-field"
                        required
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Banheiros
                      </label>
                      <input
                        type="number"
                        name="banheiros"
                        value={formData.banheiros}
                        onChange={handleChange}
                        className="input-field"
                        required
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Área (m²)
                      </label>
                      <input
                        type="number"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        className="input-field"
                        required
                        min="0"
                        step="0.01"
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
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="input-field"
                        required
                      >
                        <option value="disponivel">Disponível</option>
                        <option value="alugado">Alugado</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button type="submit" className="btn-primary flex-1">
                      {editingImovel ? 'Salvar' : 'Cadastrar'}
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

export default Imoveis;
