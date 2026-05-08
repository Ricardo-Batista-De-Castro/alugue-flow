import prisma from '../config/database.js';

/**
 * Repository para acesso aos dados de Imóvel
 * Responsável APENAS por queries ao banco de dados
 */
class ImovelRepository {
  /**
   * Busca imóveis com paginação e filtro de status
   */
  async findAll(options = {}) {
    const { 
      page = 1, 
      limit = 10, 
      status,
      orderBy = { createdAt: 'desc' }
    } = options;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = status ? { status } : undefined;

    const [imoveis, total] = await Promise.all([
      prisma.imovel.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy,
        include: {
          contratos: {
            where: { status: 'ativo' },
            include: {
              pessoa: {
                select: {
                  nome: true,
                  telefone: true,
                },
              },
            },
          },
        },
      }),
      prisma.imovel.count({ where })
    ]);

    return {
      imoveis,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit))
    };
  }

  /**
   * Busca imóvel por ID com contratos
   */
  async findById(id) {
    return await prisma.imovel.findUnique({
      where: { id },
      include: {
        contratos: {
          include: {
            pessoa: true,
          },
        },
      },
    });
  }

  /**
   * Busca imóvel por ID com contratos ativos (para validações)
   */
  async findByIdWithActiveContratos(id) {
    return await prisma.imovel.findUnique({
      where: { id },
      include: {
        contratos: {
          where: { status: 'ativo' },
        },
      },
    });
  }

  /**
   * Cria um novo imóvel
   */
  async create(data) {
    return await prisma.imovel.create({
      data,
    });
  }

  /**
   * Atualiza um imóvel existente
   */
  async update(id, data) {
    return await prisma.imovel.update({
      where: { id },
      data,
    });
  }

  /**
   * Exclui um imóvel
   */
  async delete(id) {
    return await prisma.imovel.delete({
      where: { id },
    });
  }

  /**
   * Verifica se imóvel existe (simples)
   */
  async exists(id) {
    const imovel = await prisma.imovel.findUnique({
      where: { id },
      select: { id: true }
    });
    return !!imovel;
  }
}

export default new ImovelRepository();
