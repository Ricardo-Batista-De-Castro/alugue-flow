import prisma from '../config/database.js';
import bcrypt from 'bcryptjs';

export const getInquilinos = async (req, res) => {
  try {
    const inquilinos = await prisma.inquilino.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        contratos: {
          where: { status: 'ativo' },
          include: {
            imovel: {
              select: {
                nome: true,
                endereco: true,
              },
            },
          },
        },
        usuario: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return res.status(200).json(inquilinos);
  } catch (error) {
    console.error('Erro ao buscar inquilinos:', error);
    return res.status(500).json({ error: 'Erro ao buscar inquilinos' });
  }
};

export const getInquilinoById = async (req, res) => {
  try {
    const { id } = req.params;

    const inquilino = await prisma.inquilino.findUnique({
      where: { id },
      include: {
        contratos: {
          include: {
            imovel: true,
          },
        },
        usuario: {
          select: {
            id: true,
            email: true,
            tipo: true,
          },
        },
      },
    });

    if (!inquilino) {
      return res.status(404).json({ error: 'Inquilino não encontrado' });
    }

    return res.status(200).json(inquilino);
  } catch (error) {
    console.error('Erro ao buscar inquilino:', error);
    return res.status(500).json({ error: 'Erro ao buscar inquilino' });
  }
};

export const createInquilino = async (req, res) => {
  try {
    const { nome, cpf, rg, telefone, email, profissao, rendaMensal, criarUsuario, senha } = req.body;

    if (!nome || !cpf || !telefone || !email) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // ✅ OTIMIZADO: Verificações em paralelo usando Promise.all
    const verificacoesPromises = [
      prisma.inquilino.findUnique({ where: { cpf } }),
      prisma.inquilino.findUnique({ where: { email } }),
    ];

    // Só verificar usuário se for criar um
    if (criarUsuario && senha) {
      verificacoesPromises.push(
        prisma.usuario.findUnique({ where: { email } })
      );
    }

    const verificacoes = await Promise.all(verificacoesPromises);
    const [cpfExistente, emailExistente, usuarioEmailExistente] = verificacoes;

    // Validações
    if (cpfExistente) {
      return res.status(400).json({ error: 'CPF já cadastrado' });
    }

    if (emailExistente) {
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }

    if (usuarioEmailExistente) {
      return res.status(400).json({ error: 'E-mail já cadastrado como usuário' });
    }

    let usuarioId = null;

    // Se deve criar usuário, criar conta de acesso
    if (criarUsuario && senha) {
      const senhaHash = await bcrypt.hash(senha, 10);

      const usuario = await prisma.usuario.create({
        data: {
          nome,
          email,
          senha: senhaHash,
          tipo: 'inquilino',
        },
      });

      usuarioId = usuario.id;
    }

    const inquilino = await prisma.inquilino.create({
      data: {
        nome,
        cpf,
        rg: rg || null,
        telefone,
        email,
        profissao: profissao || null,
        rendaMensal: rendaMensal ? parseFloat(rendaMensal) : null,
        usuarioId,
      },
    });

    return res.status(201).json({
      message: 'Inquilino cadastrado com sucesso',
      inquilino,
    });
  } catch (error) {
    console.error('Erro ao criar inquilino:', error);
    return res.status(500).json({ error: 'Erro ao cadastrar inquilino' });
  }
};

export const updateInquilino = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cpf, rg, telefone, email, profissao, rendaMensal } = req.body;

    const inquilinoExistente = await prisma.inquilino.findUnique({
      where: { id },
    });

    if (!inquilinoExistente) {
      return res.status(404).json({ error: 'Inquilino não encontrado' });
    }

    // ✅ OTIMIZADO: Verificações em paralelo
    const verificacoesPromises = [];
    
    // Verificar CPF duplicado apenas se mudou
    if (cpf && cpf !== inquilinoExistente.cpf) {
      verificacoesPromises.push(
        prisma.inquilino.findUnique({ where: { cpf } })
      );
    } else {
      verificacoesPromises.push(Promise.resolve(null));
    }

    // Verificar e-mail duplicado apenas se mudou
    if (email && email !== inquilinoExistente.email) {
      verificacoesPromises.push(
        prisma.inquilino.findUnique({ where: { email } })
      );
    } else {
      verificacoesPromises.push(Promise.resolve(null));
    }

    const [cpfExistente, emailExistente] = await Promise.all(verificacoesPromises);

    if (cpfExistente) {
      return res.status(400).json({ error: 'CPF já cadastrado' });
    }

    if (emailExistente) {
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }

    const inquilino = await prisma.inquilino.update({
      where: { id },
      data: {
        nome,
        cpf,
        rg: rg || null,
        telefone,
        email,
        profissao: profissao || null,
        rendaMensal: rendaMensal ? parseFloat(rendaMensal) : null,
      },
    });

    return res.status(200).json({
      message: 'Inquilino atualizado com sucesso',
      inquilino,
    });
  } catch (error) {
    console.error('Erro ao atualizar inquilino:', error);
    return res.status(500).json({ error: 'Erro ao atualizar inquilino' });
  }
};

export const deleteInquilino = async (req, res) => {
  try {
    const { id } = req.params;

    const inquilino = await prisma.inquilino.findUnique({
      where: { id },
      include: {
        contratos: {
          where: { status: 'ativo' },
        },
      },
    });

    if (!inquilino) {
      return res.status(404).json({ error: 'Inquilino não encontrado' });
    }

    if (inquilino.contratos.length > 0) {
      return res.status(400).json({ error: 'Não é possível excluir inquilino com contratos ativos' });
    }

    // Se tiver usuário associado, excluir também em uma transação
    await prisma.$transaction(async (tx) => {
      // Se tiver usuário associado, excluir primeiro
      if (inquilino.usuarioId) {
        await tx.usuario.delete({
          where: { id: inquilino.usuarioId },
        });
      }

      // Excluir inquilino
      await tx.inquilino.delete({
        where: { id },
      });
    });

    return res.status(200).json({ message: 'Inquilino excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir inquilino:', error);
    return res.status(500).json({ error: 'Erro ao excluir inquilino' });
  }
};
