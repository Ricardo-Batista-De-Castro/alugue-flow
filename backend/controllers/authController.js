import authService from '../services/auth.service.js';

/**
 * Controller para Autenticação
 * Responsável APENAS por receber requisições HTTP e retornar respostas
 */

export const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);

    return res.status(201).json({
      message: 'Usuário cadastrado com sucesso',
      ...result,
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const result = await authService.login(email, senha);

    return res.status(200).json({
      message: 'Login realizado com sucesso',
      ...result,
    });
  } catch (error) {
    console.error('Erro no login:', error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

export const me = async (req, res) => {
  try {
    const usuario = await authService.getUserProfile(req.user.id);

    return res.status(200).json(usuario);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};
