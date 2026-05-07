import { verifyToken } from '../utils/jwt.js';
import prisma from '../config/database.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
      },
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    req.user = usuario;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Erro na autenticação' });
  }
};

export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    if (allowedRoles.length && !allowedRoles.includes(req.user.tipo)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    next();
  };
};

export const authorizeProprietario = (req, res, next) => {
  if (req.user.tipo !== 'proprietario') {
    return res.status(403).json({ error: 'Acesso negado. Apenas proprietários.' });
  }
  next();
};

export const authorizeInquilino = async (req, res, next) => {
  if (req.user.tipo === 'proprietario') {
    return next();
  }

  // Se for inquilino, verificar se está acessando apenas seus próprios dados
  if (req.user.tipo === 'inquilino') {
    const pessoa = await prisma.pessoa.findFirst({
      where: { usuarioId: req.user.id },
    });

    if (!pessoa) {
      return res.status(403).json({ error: 'Pessoa não encontrada' });
    }

    req.pessoa = pessoa;
    return next();
  }

  return res.status(403).json({ error: 'Acesso negado' });
};
