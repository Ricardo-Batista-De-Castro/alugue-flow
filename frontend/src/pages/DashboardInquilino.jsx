import { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';

const DashboardInquilino = () => {
  const [contrato, setContrato] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.get('/api/dashboard/inquilino');
      setContrato(response.data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
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

  if (!contrato) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Você não possui um contrato ativo no momento.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Meu Contrato</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações do Imóvel */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Imóvel</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Endereço</p>
                <p className="font-medium text-gray-800">{contrato.imovel.endereco}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cidade</p>
                <p className="font-medium text-gray-800">{contrato.imovel.cidade}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <p className="font-medium text-gray-800">{contrato.imovel.estado}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">CEP</p>
                <p className="font-medium text-gray-800">{contrato.imovel.cep}</p>
              </div>
            </div>
          </div>

          {/* Informações do Proprietário */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Proprietário</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Nome</p>
                <p className="font-medium text-gray-800">{contrato.imovel.proprietario.nome}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-800">{contrato.imovel.proprietario.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Telefone</p>
                <p className="font-medium text-gray-800">{contrato.imovel.proprietario.telefone}</p>
              </div>
            </div>
          </div>

          {/* Informações do Contrato */}
          <div className="card lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Detalhes do Contrato</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600">Valor do Aluguel</p>
                <p className="text-2xl font-bold text-primary-600">
                  {formatCurrency(contrato.valorAluguel)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Dia de Vencimento</p>
                <p className="text-2xl font-bold text-gray-800">{contrato.diaVencimento}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  {contrato.status}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <p className="text-sm text-gray-600">Data de Início</p>
                <p className="font-medium text-gray-800">{formatDate(contrato.dataInicio)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Data de Fim</p>
                <p className="font-medium text-gray-800">{formatDate(contrato.dataFim)}</p>
              </div>
            </div>
            {contrato.observacoes && (
              <div className="mt-6">
                <p className="text-sm text-gray-600">Observações</p>
                <p className="font-medium text-gray-800 mt-1">{contrato.observacoes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardInquilino;
