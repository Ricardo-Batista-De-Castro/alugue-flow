import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';
import authRepository from '../repositories/auth.repository.js';

/**
 * Service para lógica de negócio de Autenticação
 * Responsável por validações, regras de negócio e orquestração
 */
class AuthService {
  /**
   * Registra novo usuário proprietário
   * @throws {Error} Se validações falharem
   */
  async register(userData) {
    const { nome, email, senha } = userData;

    // Validações básicas
    this._validateBasicFields({ nome, email, senha });

    // Verificar se email já existe
    await this._checkEmailExists(email);

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar usuário proprietário
    const usuario = await authRepository.createUsuario({
      nome,
      email,
      senha: senhaHash,
      tipo: 'proprietario',
    });

    // Gerar token
    const token = generateToken({
      id: usuario.id,
      email: usuario.email,
      tipo: usuario.tipo,
    });

    return { usuario, token };
  }

  /**
   * Autentica usuário proprietário
   * @throws {Error} Se credenciais inválidas
   */
  async loginProprietario(email, senha) {
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
   * Autentica locatário (pessoa) usando email e CPF
   * @throws {Error} Se credenciais inválidas ou sem permissão
   */
  async loginLocatario(email, cpf) {
    // Validar campos
    if (!email || !cpf) {
      const error = new Error('E-mail e CPF são obrigatórios');
      error.statusCode = 400;
      throw error;
    }

    // Buscar pessoa por email
    const pessoa = await authRepository.findPessoaByEmail(email);
    if (!pessoa) {
      const error = new Error('Credenciais inválidas');
      error.statusCode = 401;
      throw error;
    }

    // Validar CPF (senha = cpf sem formatação)
    // Limpar ambos os CPFs para comparação (banco pode ter formatação)
    const cpfLimpo = cpf.replace(/\D/g, '');
    const cpfBancoLimpo = pessoa.cpf.replace(/\D/g, '');
    
    if (cpfBancoLimpo !== cpfLimpo) {
      const error = new Error('CPF incorreto');
      error.statusCode = 401;
      throw error;
    }

    // Validar acesso à dashboard
    if (!pessoa.acessoDashboard) {
      const error = new Error('Acesso à dashboard não liberado. Entre em contato com o proprietário.');
      error.statusCode = 403;
      throw error;
    }

    // Validar contrato ativo
    const temContratoAtivo = await authRepository.verificarContratoAtivo(pessoa.id);
    if (!temContratoAtivo) {
      const error = new Error('Nenhum contrato ativo encontrado. Entre em contato com o proprietário.');
      error.statusCode = 403;
      throw error;
    }

    // Gerar token para locatário
    const token = generateToken({
      id: pessoa.id,
      email: pessoa.email,
      tipo: 'locatario',
      pessoaId: pessoa.id,
    });

    return { 
      usuario: {
        id: pessoa.id,
        nome: pessoa.nome,
        email: pessoa.email,
        tipo: 'locatario',
      }, 
      token 
    };
  }

  /**
   * Busca perfil do usuário logado (proprietário ou locatário)
   * @throws {Error} Se usuário não encontrado
   */
  async getUserProfile(userId, tipo) {
    if (tipo === 'locatario') {
      // Buscar na tabela Pessoa
      const pessoa = await authRepository.findPessoaById(userId);

      if (!pessoa) {
        const error = new Error('Locatário não encontrado');
        error.statusCode = 404;
        throw error;
      }

      // Retornar com formato padronizado
      return {
        id: pessoa.id,
        nome: pessoa.nome,
        email: pessoa.email,
        tipo: 'locatario',
        acessoDashboard: pessoa.acessoDashboard,
        createdAt: pessoa.createdAt,
      };
    } else {
      // Buscar na tabela Usuario
      const usuario = await authRepository.findUsuarioById(userId);

      if (!usuario) {
        const error = new Error('Usuário não encontrado');
        error.statusCode = 404;
        throw error;
      }

      return usuario;
    }
  }

  // ============================================
  // Métodos Privados de Validação
  // ============================================

  /**
   * Valida campos básicos obrigatórios
   * @private
   */
  _validateBasicFields({ nome, email, senha }) {
    if (!nome || !email || !senha) {
      const error = new Error('Nome, e-mail e senha são obrigatórios');
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

}

export default new AuthService();
