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
      usuario: {
        select: {
          id: true,
          email: true,
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
      usuario: {
        select: {
          id: true,
          email: true,
          tipo: true,
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
   * Busca pessoa por email
   */
  async findByEmail(email) {
    return await prisma.pessoa.findUnique({
      where: { email },
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

  /**
   * Exclui uma pessoa
   */
  async delete(id) {
    return await prisma.pessoa.delete({
      where: { id },
    });
  }

  /**
   * Verifica se a pessoa tem contratos ativos
   */
  async hasActiveContracts(id) {
    const pessoa = await prisma.pessoa.findUnique({
      where: { id },
      include: {
        contratos: {
          where: { status: 'ativo' },
        },
      },
    });

    return pessoa ? pessoa.contratos.length > 0 : false;
  }

  /**
   * Busca pessoa com contratos ativos (usado no delete)
   */
  async findWithActiveContracts(id) {
    return await prisma.pessoa.findUnique({
      where: { id },
      include: {
        contratos: {
          where: { status: 'ativo' },
        },
      },
    });
  }

  /**
   * Executa operação em transação para excluir pessoa e usuário
   */
  async deleteWithUser(pessoaId, usuarioId) {
    return await prisma.$transaction(async (tx) => {
      // Se tiver usuário associado, excluir primeiro
      if (usuarioId) {
        await tx.usuario.delete({
          where: { id: usuarioId },
        });
      }

      // Excluir pessoa
      await tx.pessoa.delete({
        where: { id: pessoaId },
      });
    });
  }
}

export default new PessoaRepository();
