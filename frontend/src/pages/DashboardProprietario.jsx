import { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';

const DashboardProprietario = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.get('/api/dashboard');
      setStats(response.data);
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

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <p className="text-blue-100 text-sm mb-1">Total de Imóveis</p>
            <p className="text-3xl font-bold">{stats?.resumo?.totalImoveis || 0}</p>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <p className="text-green-100 text-sm mb-1">Imóveis Alugados</p>
            <p className="text-3xl font-bold">{stats?.resumo?.imoveisAlugados || 0}</p>
          </div>

          <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <p className="text-yellow-100 text-sm mb-1">Imóveis Disponíveis</p>
            <p className="text-3xl font-bold">{stats?.resumo?.imoveisDisponiveis || 0}</p>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <p className="text-purple-100 text-sm mb-1">Receita Mensal</p>
            <p className="text-3xl font-bold">
              {formatCurrency(stats?.resumo?.receitaMensal || 0)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Próximos Vencimentos */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Próximos Vencimentos
            </h2>
            {stats?.contratosVencendo && stats.contratosVencendo.length > 0 ? (
              <div className="space-y-3">
                {stats.contratosVencendo.map((contrato) => (
                  <div
                    key={contrato.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {contrato.imovel.endereco}
                      </p>
                      <p className="text-sm text-gray-600">
                        {contrato.inquilino.nome}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">
                        {formatCurrency(contrato.valorAluguel)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Venc: {formatDate(contrato.dataVencimento)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Nenhum vencimento próximo
              </p>
            )}
          </div>

          {/* Contratos Ativos */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Últimos Imóveis
            </h2>
            {stats?.ultimosImoveis && stats.ultimosImoveis.length > 0 ? (
              <div className="space-y-3">
                {stats.ultimosImoveis.map((imovel) => (
                  <div
                    key={imovel.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {imovel.endereco}
                      </p>
                      <p className="text-sm text-gray-600">
                        {imovel.cidade} - {imovel.estado}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 ${imovel.status === 'disponivel' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} text-xs font-medium rounded-full`}>
                        {imovel.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Nenhum imóvel cadastrado
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardProprietario;
