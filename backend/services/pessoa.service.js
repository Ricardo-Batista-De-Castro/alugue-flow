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
    const { 
      nome, 
      cpf, 
      rg, 
      telefone, 
      email, 
      profissao, 
      rendaMensal, 
      endereco,
      dataNascimento,
      situacao = 'EM_CADASTRO',
      acessoDashboard = false 
    } = data;

    // Validação de campos obrigatórios
    if (!nome || !cpf || !telefone || !email) {
      const error = new Error('Nome, CPF, telefone e e-mail são obrigatórios');
      error.statusCode = 400;
      throw error;
    }

    // Validar situacao
    this._validateSituacao(situacao);

    // Verificar se CPF já existe
    await this._validateCpfUnique(cpf);

    // Criar pessoa
    const pessoa = await pessoaRepository.create({
      nome,
      cpf,
      rg: rg || null,
      telefone,
      email,
      profissao: profissao || null,
      rendaMensal: rendaMensal ? parseFloat(rendaMensal) : null,
      endereco: endereco || null,
      dataNascimento: dataNascimento || null,
      situacao,
      acessoDashboard,
    });

    return pessoa;
  }

  /**
   * Atualiza uma pessoa existente
   * @throws {Error} Se pessoa não encontrada ou validações falharem
   */
  async updatePessoa(id, data) {
    const { 
      nome, 
      cpf, 
      rg, 
      telefone, 
      email, 
      profissao, 
      rendaMensal,
      endereco,
      dataNascimento,
      situacao,
      acessoDashboard 
    } = data;

    // Verificar se pessoa existe
    const pessoaExistente = await pessoaRepository.findById(id);

    if (!pessoaExistente) {
      const error = new Error('Pessoa não encontrada');
      error.statusCode = 404;
      throw error;
    }

    // Validar situacao se fornecida
    if (situacao) {
      this._validateSituacao(situacao);
    }

    // Verificar CPF duplicado apenas se mudou
    if (cpf && cpf !== pessoaExistente.cpf) {
      await this._validateCpfUnique(cpf);
    }

    // Atualizar pessoa
    const pessoa = await pessoaRepository.update(id, {
      nome,
      cpf,
      rg: rg || null,
      telefone,
      email,
      profissao: profissao || null,
      rendaMensal: rendaMensal ? parseFloat(rendaMensal) : null,
      endereco: endereco || null,
      dataNascimento: dataNascimento || null,
      situacao: situacao || pessoaExistente.situacao,
      acessoDashboard: acessoDashboard !== undefined ? acessoDashboard : pessoaExistente.acessoDashboard,
    });

    return pessoa;
  }

  /**
   * Valida se CPF não está duplicado
   * @private
   */
  async _validateCpfUnique(cpf) {
    const cpfExistente = await pessoaRepository.findByCpf(cpf);

    if (cpfExistente) {
      const error = new Error('CPF já cadastrado');
      error.statusCode = 400;
      throw error;
    }
  }

  /**
   * Valida se situacao é válida
   * @private
   */
  _validateSituacao(situacao) {
    const situacoesValidas = ['EM_CADASTRO', 'ATIVO', 'INATIVO', 'BLOQUEADO'];
    
    if (!situacoesValidas.includes(situacao)) {
      const error = new Error('Situação inválida. Valores permitidos: EM_CADASTRO, ATIVO, INATIVO, BLOQUEADO');
      error.statusCode = 400;
      throw error;
    }
  }
}

export default new PessoaService();
