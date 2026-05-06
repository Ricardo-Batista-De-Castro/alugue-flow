import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';
import prisma from '../config/database.js';

export const register = async (req, res) => {
  try {
    const { nome, email, senha, tipo, telefone, cpf, rg, profissao, rendaMensal } = req.body;

    if (!nome || !email || !senha || !tipo) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (!['proprietario', 'inquilino'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo de usuário inválido' });
    }

    // Validações específicas para inquilino
    if (tipo === 'inquilino') {
      if (!cpf || !telefone || !rg || !profissao || !rendaMensal) {
        return res.status(400).json({ error: 'CPF, telefone, RG, profissão e renda mensal são obrigatórios para inquilinos' });
      }

      // Verificar se CPF já existe
      const cpfExistente = await prisma.inquilino.findUnique({
        where: { cpf },
      });

      if (cpfExistente) {
        return res.status(400).json({ error: 'CPF já cadastrado' });
      }
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    let usuario;

    // Se for inquilino, criar Usuario E Inquilino em transação
    if (tipo === 'inquilino') {
      const resultado = await prisma.$transaction(async (tx) => {
        const novoUsuario = await tx.usuario.create({
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

        await tx.inquilino.create({
          data: {
            nome,
            cpf,
            telefone,
            email,
            rg,
            profissao,
            rendaMensal: parseFloat(rendaMensal),
            usuarioId: novoUsuario.id,
          },
        });

        return novoUsuario;
      });

      usuario = resultado;
    } else {
      // Se for proprietário, criar apenas o Usuario
      usuario = await prisma.usuario.create({
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
    }

    const token = generateToken({ id: usuario.id, email: usuario.email, tipo: usuario.tipo });

    return res.status(201).json({
      message: 'Usuário cadastrado com sucesso',
      usuario,
      token,
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(500).json({ error: 'Erro ao cadastrar usuário' });
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
