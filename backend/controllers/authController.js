import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';
import prisma from '../config/database.js';

export const register = async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha || !tipo) {
      return res.status(400).json({ error: 'Todos os campos sรฃo obrigatรณrios' });
    }

    if (!['proprietario', 'inquilino'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo de usuรกrio invรกlido' });
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      return res.status(400).json({ error: 'E-mail jรก cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        tipo,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        createdAt: true,
      },
    });

    const token = generateToken({ id: usuario.id, email: usuario.email, tipo: usuario.tipo });

    return res.status(201).json({
      message: 'Usuรกrio cadastrado com sucesso',
      usuario,
      token,
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(500).json({ error: 'Erro ao cadastrar usuรกrio' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'E-mail e senha sรฃo obrigatรณrios' });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais invรกlidas' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais invรกlidas' });
    }

    const token = generateToken({ id: usuario.id, email: usuario.email, tipo: usuario.tipo });

    const { senha: _, ...usuarioSemSenha } = usuario;

    return res.status(200).json({
      message: 'Login realizado com sucesso',
      usuario: usuarioSemSenha,
      token,
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro ao realizar login' });
  }
};

export const me = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        createdAt: true,
        inquilino: {
          select: {
            id: true,
            cpf: true,
            telefone: true,
            email: true,
          },
        },
      },
    });

    return res.status(200).json(usuario);
  } catch (error) {
    console.error('Erro ao buscar usuรกrio:', error);
    return res.status(500).json({ error: 'Erro ao buscar dados do usuรกrio' });
  }
};
