import dashboardRepository from '../repositories/dashboard.repository.js';

/**
 * Service para lógica de negócio do Dashboard
 * Responsável por validações, regras de negócio e orquestração
 */
class DashboardService {
  /**
   * Busca dados completos do dashboard do proprietário
   */
  async getDashboardProprietario() {
    // Buscar todos os dados em paralelo
    const [counts, receitaMensal, contratos, ultimosImoveis, ultimasPessoas] = 
      await Promise.all([
        dashboardRepository.getProprietarioCounts(),
        dashboardRepository.getReceitaMensal(),
        dashboardRepository.getContratosParaVencimento(),
        dashboardRepository.getUltimosImoveis(),
        dashboardRepository.getUltimasPessoas(),
      ]);

    // Processar contratos para incluir informações de vencimento
    const contratosVencendo = this._processarContratosVencimento(contratos);

    return {
      resumo: {
        ...counts,
        receitaMensal,
      },
      contratosVencendo,
      ultimosImoveis,
      ultimasPessoas,
    };
  }

  /**
   * Busca dados do dashboard do locatário
   * @throws {Error} Se pessoa não encontrada
   */
  async getDashboardLocatario(pessoaId) {
    const pessoa = await dashboardRepository.getLocatarioData(pessoaId);

    if (!pessoa) {
      const error = new Error('Pessoa não encontrada');
      error.statusCode = 404;
      throw error;
    }

    const contratoAtivo = pessoa.contratos[0] || null;
    const diasAteVencimento = contratoAtivo 
      ? this._calcularDiasAteVencimento(contratoAtivo.diaVencimento)
      : null;

    return {
      pessoa: {
        nome: pessoa.nome,
        cpf: pessoa.cpf,
        telefone: pessoa.telefone,
        email: pessoa.email,
        endereco: pessoa.endereco,
      },
      contratoAtivo,
      diasAteVencimento,
    };
  }

  /**
   * Processa lista de contratos adicionando informações de vencimento
   * Filtra contratos que vencem nos próximos 30 dias
   * @private
   */
  _processarContratosVencimento(contratos) {
    const hoje = new Date();
    const diaAtual = hoje.getDate();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    return contratos
      .map(contrato => {
        const diaVencimento = contrato.diaVencimento;
        
        // Calcular a próxima data de vencimento
        let dataVencimento;
        if (diaVencimento >= diaAtual) {
          // Vencimento é neste mês
          dataVencimento = new Date(anoAtual, mesAtual, diaVencimento);
        } else {
          // Vencimento é no próximo mês
          dataVencimento = new Date(anoAtual, mesAtual + 1, diaVencimento);
        }
        
        const diasRestantes = Math.ceil((dataVencimento - hoje) / (1000 * 60 * 60 * 24));
        
        return {
          ...contrato,
          dataVencimento: dataVencimento.toISOString(),
          diasRestantes,
        };
      })
      .filter(contrato => contrato.diasRestantes <= 30 && contrato.diasRestantes >= 0)
      .sort((a, b) => a.diasRestantes - b.diasRestantes)
      .slice(0, 10); // Limitar a 10 contratos
  }

  /**
   * Calcula quantos dias faltam até o próximo vencimento
   * @private
   */
  _calcularDiasAteVencimento(diaVencimento) {
    const hoje = new Date();
    const diaAtual = hoje.getDate();
    
    if (diaVencimento >= diaAtual) {
      // Vencimento é neste mês
      return diaVencimento - diaAtual;
    } else {
      // Vencimento é no próximo mês
      const ultimoDiaMes = new Date(
        hoje.getFullYear(), 
        hoje.getMonth() + 1, 
        0
      ).getDate();
      return (ultimoDiaMes - diaAtual) + diaVencimento;
    }
  }
}

export default new DashboardService();
