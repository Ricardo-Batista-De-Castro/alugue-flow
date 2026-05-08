import prisma from '../config/database.js';

/**
 * Repository para acesso aos dados de Contrato
 * Responsável APENAS por queries ao banco de dados
 */
class ContratoRepository {
  /**
   * Busca todos os contratos com filtros opcionais
   */
  async findAll(options = {}) {
    const { status, orderBy = { createdAt: 'desc' } } = options;
    const where = status ? { status } : undefined;

    return await prisma.contrato.findMany({
      where,
      orderBy,
      include: {
        imovel: {
          select: {
            id: true,
            nome: true,
            endereco: true,
            numero: true,
            bairro: true,
            cidade: true,
            estado: true,
          },
        },
        pessoa: {
          select: {
            id: true,
            nome: true,
            cpf: true,
            telefone: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Busca contrato por ID com includes
   */
  async findById(id) {
    return await prisma.contrato.findUnique({
      where: { id },
      include: {
        imovel: true,
        pessoa: true,
      },
    });
  }

  /**
   * Busca contrato ativo para um imóvel específico
   */
  async findActiveByImovelId(imovelId) {
    return await prisma.contrato.findFirst({
      where: {
        imovelId,
        status: 'ativo',
      },
    });
  }

  /**
   * Cria um novo contrato
   */
  async create(data) {
    return await prisma.contrato.create({
      data,
      include: {
        imovel: true,
        pessoa: true,
      },
    });
  }

  /**
   * Atualiza um contrato existente
   */
  async update(id, data) {
    return await prisma.contrato.update({
      where: { id },
      data,
      include: {
        imovel: true,
        pessoa: true,
      },
    });
  }

  /**
   * Exclui um contrato
   */
  async delete(id) {
    return await prisma.contrato.delete({
      where: { id },
    });
  }

  /**
   * Cria contrato e atualiza status do imóvel em transação
   */
  async createWithImovelUpdate(contratoData, imovelId) {
    return await prisma.$transaction(async (tx) => {
      // Criar contrato
      const novoContrato = await tx.contrato.create({
        data: contratoData,
        include: {
          imovel: true,
          pessoa: true,
        },
      });

      // Atualizar status do imóvel
      await tx.imovel.update({
        where: { id: imovelId },
        data: { status: 'alugado' },
      });

      return novoContrato;
    });
  }

  /**
   * Atualiza contrato e libera imóvel se necessário (transação)
   */
  async updateWithImovelStatus(id, contratoData, shouldFreeImovel, imovelId) {
    return await prisma.$transaction(async (tx) => {
      // Atualizar contrato
      const contratoAtualizado = await tx.contrato.update({
        where: { id },
        data: contratoData,
        include: {
          imovel: true,
          pessoa: true,
        },
      });

      // Se o status mudou para inativo, atualizar o imóvel
      if (shouldFreeImovel) {
        await tx.imovel.update({
          where: { id: imovelId },
          data: { status: 'disponivel' },
        });
      }

      return contratoAtualizado;
    });
  }

  /**
   * Exclui contrato e libera imóvel se necessário (transação)
   */
  async deleteWithImovelUpdate(id, shouldFreeImovel, imovelId) {
    return await prisma.$transaction(async (tx) => {
      // Excluir contrato
      await tx.contrato.delete({
        where: { id },
      });

      // Se o contrato estava ativo, liberar o imóvel
      if (shouldFreeImovel) {
        await tx.imovel.update({
          where: { id: imovelId },
          data: { status: 'disponivel' },
        });
      }
    });
  }
}

export default new ContratoRepository();
