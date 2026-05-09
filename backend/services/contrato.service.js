import contratoRepository from '../repositories/contrato.repository.js';
import prisma from '../config/database.js';

/**
 * Service para lógica de negócio de Contrato
 * Responsável por validações, regras de negócio e orquestração
 */
class ContratoService {
  /**
   * Busca todos os contratos com filtro opcional de status e pessoaId
   */
  async getAllContratos(status, filtros = {}) {
    const where = {};
    if (status) where.status = status;
    if (filtros.pessoaId) where.pessoaId = filtros.pessoaId;
    
    return await contratoRepository.findAll(where);
  }

  /**
   * Busca contrato por ID
   * @throws {Error} Se contrato não encontrado
   */
  async getContratoById(id) {
    const contrato = await contratoRepository.findById(id);

    if (!contrato) {
      const error = new Error('Contrato não encontrado');
      error.statusCode = 404;
      throw error;
    }

    return contrato;
  }

  /**
   * Cria um novo contrato com validações
   * @throws {Error} Se validações falharem
   */
  async createContrato(data) {
    const {
      imovelId,
      pessoaId,
      dataInicio,
      dataFim,
      valorAluguel,
      diaVencimento,
      observacoes,
    } = data;

    // Validação de campos obrigatórios
    if (!imovelId || !pessoaId || !dataInicio || !dataFim || !valorAluguel || !diaVencimento) {
      const error = new Error('Todos os campos obrigatórios devem ser preenchidos');
      error.statusCode = 400;
      throw error;
    }

    // Validações em paralelo
    await this._validateContratoCreation(imovelId, pessoaId);

    // Validar datas
    const dataInicioDate = new Date(dataInicio);
    const dataFimDate = new Date(dataFim);
    this._validateDates(dataInicioDate, dataFimDate);

    // Validar dia de vencimento
    const diaVencimentoNum = parseInt(diaVencimento);
    this._validateDiaVencimento(diaVencimentoNum);

    // Criar contrato e atualizar status do imóvel em transação
    const contrato = await contratoRepository.createWithImovelUpdate(
      {
        imovelId,
        pessoaId,
        dataInicio: dataInicioDate,
        dataFim: dataFimDate,
        valorAluguel: parseFloat(valorAluguel),
        diaVencimento: diaVencimentoNum,
        observacoes: observacoes || null,
        status: 'ativo',
      },
      imovelId
    );

    return contrato;
  }

  /**
   * Atualiza um contrato existente
   * @throws {Error} Se contrato não encontrado ou validações falharem
   */
  async updateContrato(id, data) {
    const {
      dataInicio,
      dataFim,
      valorAluguel,
      diaVencimento,
      status,
      observacoes,
    } = data;

    // Verificar se contrato existe
    const contratoExistente = await contratoRepository.findById(id);

    if (!contratoExistente) {
      const error = new Error('Contrato não encontrado');
      error.statusCode = 404;
      throw error;
    }

    // Preparar dados para atualização
    const updateData = {};

    if (dataInicio !== undefined) updateData.dataInicio = new Date(dataInicio);
    if (dataFim !== undefined) updateData.dataFim = new Date(dataFim);
    if (valorAluguel !== undefined) updateData.valorAluguel = parseFloat(valorAluguel);
    if (diaVencimento !== undefined) {
      const diaNum = parseInt(diaVencimento);
      this._validateDiaVencimento(diaNum);
      updateData.diaVencimento = diaNum;
    }
    if (status !== undefined) updateData.status = status;
    if (observacoes !== undefined) updateData.observacoes = observacoes || null;

    // Validar datas se fornecidas
    if (updateData.dataInicio && updateData.dataFim) {
      this._validateDates(updateData.dataInicio, updateData.dataFim);
    }

    // Verificar se deve liberar o imóvel (ativo → inativo)
    const shouldFreeImovel = status && status !== 'ativo' && contratoExistente.status === 'ativo';

    // Verificar se deve ocupar o imóvel (inativo → ativo)
    const shouldOccupyImovel = status && status === 'ativo' && contratoExistente.status !== 'ativo';

    // Determinar novo status do imóvel
    let imovelStatus = null;
    if (shouldFreeImovel) imovelStatus = 'disponivel';
    if (shouldOccupyImovel) imovelStatus = 'alugado';

    // Atualizar contrato e status do imóvel se necessário
    const contrato = await contratoRepository.updateWithImovelStatus(
      id,
      updateData,
      imovelStatus,
      contratoExistente.imovelId
    );

    return contrato;
  }

  /**
   * Exclui um contrato
   * @throws {Error} Se contrato não encontrado
   */
  async deleteContrato(id) {
    const contrato = await contratoRepository.findById(id);

    if (!contrato) {
      const error = new Error('Contrato não encontrado');
      error.statusCode = 404;
      throw error;
    }

    // Excluir contrato e liberar imóvel se estava ativo
    const shouldFreeImovel = contrato.status === 'ativo';
    await contratoRepository.deleteWithImovelUpdate(id, shouldFreeImovel, contrato.imovelId);

    return { message: 'Contrato excluído com sucesso' };
  }

  /**
   * Valida se imóvel e pessoa existem, e se imóvel não tem contrato ativo
   * @private
   */
  async _validateContratoCreation(imovelId, pessoaId) {
    const [imovel, pessoa, contratoAtivo] = await Promise.all([
      prisma.imovel.findUnique({ where: { id: imovelId } }),
      prisma.pessoa.findUnique({ where: { id: pessoaId } }),
      contratoRepository.findActiveByImovelId(imovelId),
    ]);

    if (!imovel) {
      const error = new Error('Imóvel não encontrado');
      error.statusCode = 404;
      throw error;
    }

    if (!pessoa) {
      const error = new Error('Pessoa não encontrada');
      error.statusCode = 404;
      throw error;
    }

    if (contratoAtivo) {
      const error = new Error('Já existe um contrato ativo para este imóvel');
      error.statusCode = 400;
      throw error;
    }
  }

  /**
   * Valida se data fim é posterior à data início
   * @private
   */
  _validateDates(dataInicio, dataFim) {
    if (dataFim <= dataInicio) {
      const error = new Error('A data de término deve ser posterior à data de início');
      error.statusCode = 400;
      throw error;
    }
  }

  /**
   * Valida se dia de vencimento está entre 1 e 31
   * @private
   */
  _validateDiaVencimento(dia) {
    if (dia < 1 || dia > 31) {
      const error = new Error('Dia de vencimento deve estar entre 1 e 31');
      error.statusCode = 400;
      throw error;
    }
  }
}

export default new ContratoService();
