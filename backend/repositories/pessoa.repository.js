import prisma from '../config/database.js';

/**
 * Repository para acesso aos dados de Pessoa
 * Responsável APENAS por queries ao banco de dados
 */
class PessoaRepository {
  /**
   * Busca todas as pessoas com includes opcionais
   */
  async findAll(options = {}) {
    const { orderBy = { createdAt: 'desc' }, include } = options;

    const defaultInclude = {
      contratos: {
        where: { status: 'ativo' },
        include: {
          imovel: {
            select: {
              nome: true,
              endereco: true,
            },
          },
        },
      },
    };

    return await prisma.pessoa.findMany({
      orderBy,
      include: include || defaultInclude,
    });
  }

  /**
   * Busca pessoa por ID com includes opcionais
   */
  async findById(id, includeOptions = null) {
    const defaultInclude = {
      contratos: {
        include: {
          imovel: true,
        },
      },
    };

    return await prisma.pessoa.findUnique({
      where: { id },
      include: includeOptions || defaultInclude,
    });
  }

  /**
   * Busca pessoa por CPF
   */
  async findByCpf(cpf) {
    return await prisma.pessoa.findUnique({
      where: { cpf },
    });
  }


  /**
   * Cria uma nova pessoa
   */
  async create(data) {
    return await prisma.pessoa.create({
      data,
    });
  }

  /**
   * Atualiza uma pessoa existente
   */
  async update(id, data) {
    return await prisma.pessoa.update({
      where: { id },
      data,
    });
  }

}

export default new PessoaRepository();
