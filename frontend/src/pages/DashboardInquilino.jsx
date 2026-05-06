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
      const response = await api.get('/api/dashboard');
      // Backend retorna { contratoAtivo, inquilino, diasAteVencimento }
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
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Sem Contrato Ativo</h2>
            <p className="text-gray-600 text-lg">
              Você não possui um contrato ativo no momento.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Entre em contato com um proprietário para alugar um imóvel.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // Verificar se o imóvel existe no contrato
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

        {/* Cards de Resumo no Topo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Valor do Aluguel */}
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

          {/* Dia de Vencimento */}
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

          {/* Status do Contrato */}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Informações do Imóvel */}
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
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Endereço</p>
                    <p className="font-medium text-gray-800">{contrato.imovel.endereco}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start space-x-4">
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

          {/* Período do Contrato */}
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

          {/* Informações do Proprietário */}
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
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-600">Nome</p>
                      <p className="font-medium text-gray-800">{contrato.imovel.proprietario.nome}</p>
                    </div>
                  </div>
                )}
                {contrato.imovel.proprietario.email && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-800">{contrato.imovel.proprietario.email}</p>
                    </div>
                  </div>
                )}
                {contrato.imovel.proprietario.telefone && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-600">Telefone</p>
                      <p className="font-medium text-gray-800">{contrato.imovel.proprietario.telefone}</p>
                    </div>
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

export default DashboardInquilino;
