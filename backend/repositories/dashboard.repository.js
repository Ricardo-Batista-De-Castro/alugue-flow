import prisma from '../config/database.js';

/**
 * Repository para acesso aos dados do Dashboard
 * Responsável APENAS por queries ao banco de dados
 */
class DashboardRepository {
  /**
   * Busca todas as contagens do dashboard do proprietário em paralelo
   */
  async getProprietarioCounts() {
    const [
      totalImoveis,
      imoveisDisponiveis,
      imoveisAlugados,
      totalPessoas,
      contratosAtivos,
      contratosVencidos,
    ] = await Promise.all([
      prisma.imovel.count(),
      prisma.imovel.count({ where: { status: 'disponivel' } }),
      prisma.imovel.count({ where: { status: 'alugado' } }),
      prisma.pessoa.count(),
      prisma.contrato.count({ where: { status: 'ativo' } }),
      prisma.contrato.count({ where: { status: 'vencido' } }),
    ]);

    return {
      totalImoveis,
      imoveisDisponiveis,
      imoveisAlugados,
      totalPessoas,
      contratosAtivos,
      contratosVencidos,
    };
  }

  /**
   * Calcula a receita mensal total (soma de contratos ativos)
   */
  async getReceitaMensal() {
    const result = await prisma.contrato.aggregate({
      where: { status: 'ativo' },
      _sum: { valorAluguel: true },
    });

    return result._sum.valorAluguel || 0;
  }

  /**
   * Busca contratos ativos para análise de vencimento
   */
  async getContratosParaVencimento(limit = 20) {
    return await prisma.contrato.findMany({
      where: { status: 'ativo' },
      take: limit,
      include: {
        imovel: {
          select: {
            nome: true,
            endereco: true,
          },
        },
        pessoa: {
          select: {
            nome: true,
            telefone: true,
          },
        },
      },
      orderBy: { diaVencimento: 'asc' },
    });
  }

  /**
   * Busca os últimos imóveis cadastrados
   */
  async getUltimosImoveis(limit = 5) {
    return await prisma.imovel.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Busca as últimas pessoas cadastradas
   */
  async getUltimasPessoas(limit = 5) {
    return await prisma.pessoa.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Busca dados do locatário com contrato ativo
   */
  async getLocatarioData(pessoaId) {
    return await prisma.pessoa.findFirst({
      where: { id: pessoaId },
      include: {
        contratos: {
          where: { status: 'ativo' },
          take: 1,
          include: {
            imovel: true,
          },
        },
      },
    });
  }
}

export default new DashboardRepository();
