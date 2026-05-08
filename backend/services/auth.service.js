import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';
import authRepository from '../repositories/auth.repository.js';

/**
 * Service para lógica de negócio de Autenticação
 * Responsável por validações, regras de negócio e orquestração
 */
class AuthService {
  /**
   * Registra novo usuário (proprietário ou inquilino)
   * @throws {Error} Se validações falharem
   */
  async register(userData) {
    const { nome, email, senha, tipo, telefone, cpf, rg, profissao, rendaMensal } = userData;

    // Validações básicas
    this._validateBasicFields({ nome, email, senha, tipo });

    // Validações específicas para inquilino
    if (tipo === 'inquilino') {
      this._validateInquilinoFields({ cpf, telefone, rg, profissao, rendaMensal });
      await this._checkCpfExists(cpf);
    }

    // Verificar se email já existe
    await this._checkEmailExists(email);

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar usuário baseado no tipo
    let usuario;
    if (tipo === 'inquilino') {
      usuario = await this._createInquilino({
        nome,
        email,
        senhaHash,
        tipo,
        cpf,
        telefone,
        rg,
        profissao,
        rendaMensal,
      });
    } else {
      usuario = await this._createProprietario({
        nome,
        email,
        senhaHash,
        tipo,
      });
    }

    // Gerar token
    const token = generateToken({
      id: usuario.id,
      email: usuario.email,
      tipo: usuario.tipo,
    });

    return { usuario, token };
  }

  /**
   * Autentica usuário
   * @throws {Error} Se credenciais inválidas
   */
  async login(email, senha) {
    // Validar campos
    if (!email || !senha) {
      const error = new Error('E-mail e senha são obrigatórios');
      error.statusCode = 400;
      throw error;
    }

    // Buscar usuário
    const usuario = await authRepository.findUsuarioByEmail(email);
    if (!usuario) {
      const error = new Error('Credenciais inválidas');
      error.statusCode = 401;
      throw error;
    }

    // Validar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      const error = new Error('Credenciais inválidas');
      error.statusCode = 401;
      throw error;
    }

    // Gerar token
    const token = generateToken({
      id: usuario.id,
      email: usuario.email,
      tipo: usuario.tipo,
    });

    // Remover senha do retorno
    const { senha: _, ...usuarioSemSenha } = usuario;

    return { usuario: usuarioSemSenha, token };
  }

  /**
   * Busca perfil do usuário logado
   * @throws {Error} Se usuário não encontrado
   */
  async getUserProfile(userId) {
    const usuario = await authRepository.findUsuarioById(userId);

    if (!usuario) {
      const error = new Error('Usuário não encontrado');
      error.statusCode = 404;
      throw error;
    }

    return usuario;
  }

  // ============================================
  // Métodos Privados de Validação
  // ============================================

  /**
   * Valida campos básicos obrigatórios
   * @private
   */
  _validateBasicFields({ nome, email, senha, tipo }) {
    if (!nome || !email || !senha || !tipo) {
      const error = new Error('Todos os campos são obrigatórios');
      error.statusCode = 400;
      throw error;
    }

    if (!['proprietario', 'inquilino'].includes(tipo)) {
      const error = new Error('Tipo de usuário inválido');
      error.statusCode = 400;
      throw error;
    }
  }

  /**
   * Valida campos específicos do inquilino
   * @private
   */
  _validateInquilinoFields({ cpf, telefone, rg, profissao, rendaMensal }) {
    if (!cpf || !telefone || !rg || !profissao || !rendaMensal) {
      const error = new Error('CPF, telefone, RG, profissão e renda mensal são obrigatórios para inquilinos');
      error.statusCode = 400;
      throw error;
    }
  }

  /**
   * Verifica se CPF já existe
   * @private
   */
  async _checkCpfExists(cpf) {
    const cpfExistente = await authRepository.findPessoaByCpf(cpf);
    if (cpfExistente) {
      const error = new Error('CPF já cadastrado');
      error.statusCode = 400;
      throw error;
    }
  }

  /**
   * Verifica se email já existe
   * @private
   */
  async _checkEmailExists(email) {
    const usuarioExistente = await authRepository.findUsuarioByEmail(email);
    if (usuarioExistente) {
      const error = new Error('E-mail já cadastrado');
      error.statusCode = 400;
      throw error;
    }
  }

  /**
   * Cria usuário proprietário
   * @private
   */
  async _createProprietario({ nome, email, senhaHash, tipo }) {
    return await authRepository.createUsuario({
      nome,
      email,
      senha: senhaHash,
      tipo,
    });
  }

  /**
   * Cria usuário inquilino (com pessoa associada)
   * @private
   */
  async _createInquilino({ nome, email, senhaHash, tipo, cpf, telefone, rg, profissao, rendaMensal }) {
    const usuarioData = {
      nome,
      email,
      senha: senhaHash,
      tipo,
    };

    const pessoaData = {
      nome,
      cpf,
      telefone,
      email,
      rg,
      profissao,
      rendaMensal: parseFloat(rendaMensal),
    };

    return await authRepository.createUsuarioComPessoa(usuarioData, pessoaData);
  }
}

export default new AuthService();
