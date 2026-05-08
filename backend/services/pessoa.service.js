import pessoaRepository from '../repositories/pessoa.repository.js';
import prisma from '../config/database.js';
import bcrypt from 'bcryptjs';

/**
 * Service para lógica de negócio de Pessoa
 * Responsável por validações, regras de negócio e orquestração
 */
class PessoaService {
  /**
   * Busca todas as pessoas
   */
  async getAllPessoas() {
    return await pessoaRepository.findAll();
  }

  /**
   * Busca pessoa por ID
   * @throws {Error} Se pessoa não encontrada
   */
  async getPessoaById(id) {
    const pessoa = await pessoaRepository.findById(id);

    if (!pessoa) {
      const error = new Error('Pessoa não encontrada');
      error.statusCode = 404;
      throw error;
    }

    return pessoa;
  }

  /**
   * Cria uma nova pessoa com validações
   * @throws {Error} Se validações falharem
   */
  async createPessoa(data) {
    const { nome, cpf, rg, telefone, email, profissao, rendaMensal, criarUsuario, senha } = data;

    // Validação de campos obrigatórios
    if (!nome || !cpf || !telefone || !email) {
      const error = new Error('Todos os campos são obrigatórios');
      error.statusCode = 400;
      throw error;
    }

    // Verificar duplicados em paralelo
    await this._validateDuplicates(cpf, email, criarUsuario, senha);

    // Criar usuário se necessário
    const usuarioId = await this._createUserIfNeeded(nome, email, senha, criarUsuario);

    // Criar pessoa
    const pessoa = await pessoaRepository.create({
      nome,
      cpf,
      rg: rg || null,
      telefone,
      email,
      profissao: profissao || null,
      rendaMensal: rendaMensal ? parseFloat(rendaMensal) : null,
      usuarioId,
    });

    return pessoa;
  }

  /**
   * Atualiza uma pessoa existente
   * @throws {Error} Se pessoa não encontrada ou validações falharem
   */
  async updatePessoa(id, data) {
    const { nome, cpf, rg, telefone, email, profissao, rendaMensal } = data;

    // Verificar se pessoa existe
    const pessoaExistente = await pessoaRepository.findById(id);

    if (!pessoaExistente) {
      const error = new Error('Pessoa não encontrada');
      error.statusCode = 404;
      throw error;
    }

    // Verificar duplicados apenas se os campos mudaram
    await this._validateDuplicatesForUpdate(id, cpf, email, pessoaExistente);

    // Atualizar pessoa
    const pessoa = await pessoaRepository.update(id, {
      nome,
      cpf,
      rg: rg || null,
      telefone,
      email,
      profissao: profissao || null,
      rendaMensal: rendaMensal ? parseFloat(rendaMensal) : null,
    });

    return pessoa;
  }

  /**
   * Exclui uma pessoa
   * @throws {Error} Se pessoa não encontrada ou tiver contratos ativos
   */
  async deletePessoa(id) {
    // Buscar pessoa com contratos ativos
    const pessoa = await pessoaRepository.findWithActiveContracts(id);

    if (!pessoa) {
      const error = new Error('Pessoa não encontrada');
      error.statusCode = 404;
      throw error;
    }

    // Validar se não tem contratos ativos
    if (pessoa.contratos.length > 0) {
      const error = new Error('Não é possível excluir pessoa com contratos ativos');
      error.statusCode = 400;
      throw error;
    }

    // Excluir pessoa e usuário (se existir) em transação
    await pessoaRepository.deleteWithUser(id, pessoa.usuarioId);

    return { message: 'Pessoa excluída com sucesso' };
  }

  /**
   * Valida se CPF e email não estão duplicados
   * @private
   */
  async _validateDuplicates(cpf, email, criarUsuario, senha) {
    const verificacoesPromises = [
      pessoaRepository.findByCpf(cpf),
      pessoaRepository.findByEmail(email),
    ];

    // Só verificar usuário se for criar um
    if (criarUsuario && senha) {
      verificacoesPromises.push(
        prisma.usuario.findUnique({ where: { email } })
      );
    }

    const [cpfExistente, emailExistente, usuarioEmailExistente] = await Promise.all(verificacoesPromises);

    if (cpfExistente) {
      const error = new Error('CPF já cadastrado');
      error.statusCode = 400;
      throw error;
    }

    if (emailExistente) {
      const error = new Error('E-mail já cadastrado');
      error.statusCode = 400;
      throw error;
    }

    if (usuarioEmailExistente) {
      const error = new Error('E-mail já cadastrado como usuário');
      error.statusCode = 400;
      throw error;
    }
  }

  /**
   * Valida duplicados na atualização (apenas se campos mudaram)
   * @private
   */
  async _validateDuplicatesForUpdate(id, cpf, email, pessoaExistente) {
    const verificacoesPromises = [];

    // Verificar CPF duplicado apenas se mudou
    if (cpf && cpf !== pessoaExistente.cpf) {
      verificacoesPromises.push(pessoaRepository.findByCpf(cpf));
    } else {
      verificacoesPromises.push(Promise.resolve(null));
    }

    // Verificar e-mail duplicado apenas se mudou
    if (email && email !== pessoaExistente.email) {
      verificacoesPromises.push(pessoaRepository.findByEmail(email));
    } else {
      verificacoesPromises.push(Promise.resolve(null));
    }

    const [cpfExistente, emailExistente] = await Promise.all(verificacoesPromises);

    if (cpfExistente) {
      const error = new Error('CPF já cadastrado');
      error.statusCode = 400;
      throw error;
    }

    if (emailExistente) {
      const error = new Error('E-mail já cadastrado');
      error.statusCode = 400;
      throw error;
    }
  }

  /**
   * Cria usuário se necessário
   * @private
   */
  async _createUserIfNeeded(nome, email, senha, criarUsuario) {
    if (!criarUsuario || !senha) {
      return null;
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        tipo: 'inquilino',
      },
    });

    return usuario.id;
  }
}

export default new PessoaService();
