import { useState } from 'react';
import Layout from '../components/Layout';
import { useInquilinos, useCreateInquilino, useUpdateInquilino, useDeleteInquilino } from '../hooks/useInquilinos';

const Inquilinos = () => {
  const { data: inquilinos = [], isLoading, error } = useInquilinos();
  const createInquilino = useCreateInquilino();
  const updateInquilino = useUpdateInquilino();
  const deleteInquilino = useDeleteInquilino();

  const [showModal, setShowModal] = useState(false);
  const [editingInquilino, setEditingInquilino] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    rg: '',
    profissao: '',
    rendaMensal: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingInquilino) {
        await updateInquilino.mutateAsync({ id: editingInquilino.id, data: formData });
      } else {
        await createInquilino.mutateAsync(formData);
      }
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar inquilino:', error);
      alert('Erro ao salvar inquilino');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente excluir este inquilino?')) return;
    try {
      await deleteInquilino.mutateAsync(id);
    } catch (error) {
      console.error('Erro ao excluir inquilino:', error);
      alert('Erro ao excluir inquilino');
    }
  };

  const openModal = (inquilino = null) => {
    if (inquilino) {
      setEditingInquilino(inquilino);
      setFormData({
        nome: inquilino.nome,
        email: inquilino.email,
        telefone: inquilino.telefone,
        cpf: inquilino.cpf,
        rg: inquilino.rg,
        profissao: inquilino.profissao,
        rendaMensal: inquilino.rendaMensal,
      });
    } else {
      setEditingInquilino(null);
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
    setEditingInquilino(null);
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
          <p className="text-red-600 text-lg">Erro ao carregar inquilinos. Tente novamente.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Inquilinos</h1>
          <button onClick={() => openModal()} className="btn-primary">
            Novo Inquilino
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inquilinos.map((inquilino) => (
            <div key={inquilino.id} className="card">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {inquilino.nome}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="text-sm">
                  <span className="text-gray-600">Email:</span>
                  <p className="text-gray-800">{inquilino.email}</p>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Telefone:</span>
                  <p className="text-gray-800">{inquilino.telefone}</p>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">CPF:</span>
                  <p className="text-gray-800">{inquilino.cpf}</p>
                </div>
                {inquilino.rg && (
                  <div className="text-sm">
                    <span className="text-gray-600">RG:</span>
                    <p className="text-gray-800">{inquilino.rg}</p>
                  </div>
                )}
                {inquilino.profissao && (
                  <div className="text-sm">
                    <span className="text-gray-600">Profissão:</span>
                    <p className="text-gray-800">{inquilino.profissao}</p>
                  </div>
                )}
                {inquilino.rendaMensal && (
                  <div className="text-sm">
                    <span className="text-gray-600">Renda Mensal:</span>
                    <p className="text-gray-800 font-medium">
                      {formatCurrency(inquilino.rendaMensal)}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openModal(inquilino)}
                  className="btn-secondary flex-1"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(inquilino.id)}
                  className="btn-danger flex-1"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

        {inquilinos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Nenhum inquilino cadastrado ainda.</p>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {editingInquilino ? 'Editar Inquilino' : 'Novo Inquilino'}
                </h2>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Nome Completo
                      </label>
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
                      <label className="block text-gray-700 font-medium mb-2">
                        Email
                      </label>
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
                      <label className="block text-gray-700 font-medium mb-2">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        CPF
                      </label>
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
                      <label className="block text-gray-700 font-medium mb-2">
                        RG
                      </label>
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
                      <label className="block text-gray-700 font-medium mb-2">
                        Profissão
                      </label>
                      <input
                        type="text"
                        name="profissao"
                        value={formData.profissao}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Renda Mensal
                      </label>
                      <input
                        type="number"
                        name="rendaMensal"
                        value={formData.rendaMensal}
                        onChange={handleChange}
                        className="input-field"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button type="submit" className="btn-primary flex-1">
                      {editingInquilino ? 'Salvar' : 'Cadastrar'}
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

export default Inquilinos;
