import { useState, useEffect } from 'react';
import api from '../../services/api';
import Layout from '../../components/Layout';

const DashboardLocatario = () => {
  const [contrato, setContrato] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.get('/api/dashboard');
      setContrato(response.data.contratoAtivo);
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
          <div className="max-w-md mx-auto">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Sem Contrato Ativo</h2>
            <p className="text-gray-600 text-lg">Você não possui um contrato ativo no momento.</p>
            <p className="text-gray-500 text-sm mt-2">Entre em contato com um proprietário para alugar um imóvel.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!contrato.imovel) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-600 text-lg">Erro: Dados do imóvel não encontrados.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Meu Contrato</h1>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-primary-100 text-sm font-medium mb-1">Valor do Aluguel</p>
                <p className="text-3xl font-bold">{formatCurrency(contrato.valorAluguel)}</p>
              </div>
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Vencimento</p>
                <p className="text-3xl font-bold">Dia {contrato.diaVencimento}</p>
                <p className="text-blue-100 text-xs mt-1">de cada mês</p>
              </div>
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Status</p>
                <p className="text-2xl font-bold capitalize">{contrato.status}</p>
                <p className="text-green-100 text-xs mt-1">Contrato vigente</p>
              </div>
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Informações Detalhadas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Imóvel */}
          <div className="card">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-primary-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Imóvel Alugado</h2>
            </div>
            <div className="space-y-3">
              {contrato.imovel.endereco && (
                <div>
                  <p className="text-sm text-gray-600">Endereço</p>
                  <p className="font-medium text-gray-800">{contrato.imovel.endereco}</p>
                </div>
              )}
              <div className="flex space-x-4">
                {contrato.imovel.cidade && (
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Cidade</p>
                    <p className="font-medium text-gray-800">{contrato.imovel.cidade}</p>
                  </div>
                )}
                {contrato.imovel.estado && (
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Estado</p>
                    <p className="font-medium text-gray-800">{contrato.imovel.estado}</p>
                  </div>
                )}
              </div>
              {contrato.imovel.cep && (
                <div>
                  <p className="text-sm text-gray-600">CEP</p>
                  <p className="font-medium text-gray-800">{contrato.imovel.cep}</p>
                </div>
              )}
            </div>
          </div>

          {/* Período */}
          <div className="card">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Período do Contrato</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Data de Início</p>
                <p className="text-lg font-semibold text-gray-800">{formatDate(contrato.dataInicio)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Data de Término</p>
                <p className="text-lg font-semibold text-gray-800">{formatDate(contrato.dataFim)}</p>
              </div>
              {contrato.observacoes && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Observações</p>
                  <p className="text-gray-800 text-sm leading-relaxed">{contrato.observacoes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Proprietário */}
          {contrato.imovel.proprietario && (
            <div className="card">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Proprietário</h2>
              </div>
              <div className="space-y-3">
                {contrato.imovel.proprietario.nome && (
                  <div>
                    <p className="text-sm text-gray-600">Nome</p>
                    <p className="font-medium text-gray-800">{contrato.imovel.proprietario.nome}</p>
                  </div>
                )}
                {contrato.imovel.proprietario.email && (
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-800">{contrato.imovel.proprietario.email}</p>
                  </div>
                )}
                {contrato.imovel.proprietario.telefone && (
                  <div>
                    <p className="text-sm text-gray-600">Telefone</p>
                    <p className="font-medium text-gray-800">{contrato.imovel.proprietario.telefone}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DashboardLocatario;
