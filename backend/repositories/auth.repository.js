import prisma from '../config/database.js';

/**
 * Repository para acesso aos dados de Autenticação
 * Responsável APENAS por queries ao banco de dados
 */
class AuthRepository {
  /**
   * Busca usuário por email
   */
  async findUsuarioByEmail(email) {
    return await prisma.usuario.findUnique({
      where: { email },
    });
  }

  /**
   * Busca pessoa por CPF
   */
  async findPessoaByCpf(cpf) {
    return await prisma.pessoa.findUnique({
      where: { cpf },
    });
  }

  /**
   * Cria novo usuário (apenas proprietário)
   */
  async createUsuario(data) {
    return await prisma.usuario.create({
      data,
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        createdAt: true,
      },
    });
  }

  /**
   * Cria usuário + pessoa em transação (inquilino)
   */
  async createUsuarioComPessoa(usuarioData, pessoaData) {
    return await prisma.$transaction(async (tx) => {
      const novoUsuario = await tx.usuario.create({
        data: usuarioData,
        select: {
          id: true,
          nome: true,
          email: true,
          tipo: true,
          createdAt: true,
        },
      });

      await tx.pessoa.create({
        data: {
          ...pessoaData,
          usuarioId: novoUsuario.id,
        },
      });

      return novoUsuario;
    });
  }

  /**
   * Busca usuário por ID com dados da pessoa (se existir)
   */
  async findUsuarioById(id) {
    return await prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        createdAt: true,
        pessoa: {
          select: {
            id: true,
            cpf: true,
            telefone: true,
            email: true,
          },
        },
      },
    });
  }
}

export default new AuthRepository();
