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
   * Busca pessoa por email
   */
  async findPessoaByEmail(email) {
    return await prisma.pessoa.findFirst({
      where: { email },
    });
  }

  /**
   * Verifica se pessoa tem contrato ativo
   */
  async verificarContratoAtivo(pessoaId) {
    const contrato = await prisma.contrato.findFirst({
      where: {
        pessoaId,
        status: 'ativo',
      },
    });
    return !!contrato;
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
   * Busca usuário por ID
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
      },
    });
  }

  /**
   * Busca pessoa (locatário) por ID
   */
  async findPessoaById(id) {
    return await prisma.pessoa.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        acessoDashboard: true,
        createdAt: true,
      },
    });
  }
}

export default new AuthRepository();
