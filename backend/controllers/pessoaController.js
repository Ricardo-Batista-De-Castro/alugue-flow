import prisma from '../config/database.js';
import bcrypt from 'bcryptjs';

export const getPessoas = async (req, res) => {
  try {
    const pessoas = await prisma.pessoa.findMany({
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

    return res.status(200).json(pessoas);
  } catch (error) {
    console.error('Erro ao buscar pessoas:', error);
    return res.status(500).json({ error: 'Erro ao buscar pessoas' });
  }
};

export const getPessoaById = async (req, res) => {
  try {
    const { id } = req.params;

    const pessoa = await prisma.pessoa.findUnique({
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

    if (!pessoa) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    return res.status(200).json(pessoa);
  } catch (error) {
    console.error('Erro ao buscar pessoa:', error);
    return res.status(500).json({ error: 'Erro ao buscar pessoa' });
  }
};

export const createPessoa = async (req, res) => {
  try {
    const { nome, cpf, rg, telefone, email, profissao, rendaMensal, criarUsuario, senha } = req.body;

    if (!nome || !cpf || !telefone || !email) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // ✅ OTIMIZADO: Verificações em paralelo usando Promise.all
    const verificacoesPromises = [
      prisma.pessoa.findUnique({ where: { cpf } }),
      prisma.pessoa.findUnique({ where: { email } }),
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

    const pessoa = await prisma.pessoa.create({
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
      message: 'Pessoa cadastrada com sucesso',
      pessoa,
    });
  } catch (error) {
    console.error('Erro ao criar pessoa:', error);
    return res.status(500).json({ error: 'Erro ao cadastrar pessoa' });
  }
};

export const updatePessoa = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cpf, rg, telefone, email, profissao, rendaMensal } = req.body;

    const pessoaExistente = await prisma.pessoa.findUnique({
      where: { id },
    });

    if (!pessoaExistente) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    // ✅ OTIMIZADO: Verificações em paralelo
    const verificacoesPromises = [];
    
    // Verificar CPF duplicado apenas se mudou
    if (cpf && cpf !== pessoaExistente.cpf) {
      verificacoesPromises.push(
        prisma.pessoa.findUnique({ where: { cpf } })
      );
    } else {
      verificacoesPromises.push(Promise.resolve(null));
    }

    // Verificar e-mail duplicado apenas se mudou
    if (email && email !== pessoaExistente.email) {
      verificacoesPromises.push(
        prisma.pessoa.findUnique({ where: { email } })
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

    const pessoa = await prisma.pessoa.update({
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
      message: 'Pessoa atualizada com sucesso',
      pessoa,
    });
  } catch (error) {
    console.error('Erro ao atualizar pessoa:', error);
    return res.status(500).json({ error: 'Erro ao atualizar pessoa' });
  }
};

export const deletePessoa = async (req, res) => {
  try {
    const { id } = req.params;

    const pessoa = await prisma.pessoa.findUnique({
      where: { id },
      include: {
        contratos: {
          where: { status: 'ativo' },
        },
      },
    });

    if (!pessoa) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    if (pessoa.contratos.length > 0) {
      return res.status(400).json({ error: 'Não é possível excluir pessoa com contratos ativos' });
    }

    // Se tiver usuário associado, excluir também em uma transação
    await prisma.$transaction(async (tx) => {
      // Se tiver usuário associado, excluir primeiro
      if (pessoa.usuarioId) {
        await tx.usuario.delete({
          where: { id: pessoa.usuarioId },
        });
      }

      // Excluir pessoa
      await tx.pessoa.delete({
        where: { id },
      });
    });

    return res.status(200).json({ message: 'Pessoa excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir pessoa:', error);
    return res.status(500).json({ error: 'Erro ao excluir pessoa' });
  }
};
