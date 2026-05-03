import prisma from '../config/database.js';

export const getImoveis = async (req, res) => {
  try {
    const imoveis = await prisma.imovel.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        contratos: {
          where: { status: 'ativo' },
          include: {
            inquilino: {
              select: {
                nome: true,
                telefone: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json(imoveis);
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error);
    return res.status(500).json({ error: 'Erro ao buscar imóveis' });
  }
};

export const getImovelById = async (req, res) => {
  try {
    const { id } = req.params;

    const imovel = await prisma.imovel.findUnique({
      where: { id },
      include: {
        contratos: {
          include: {
            inquilino: true,
          },
        },
      },
    });

    if (!imovel) {
      return res.status(404).json({ error: 'Imóvel não encontrado' });
    }

    return res.status(200).json(imovel);
  } catch (error) {
    console.error('Erro ao buscar imóvel:', error);
    return res.status(500).json({ error: 'Erro ao buscar imóvel' });
  }
};

export const createImovel = async (req, res) => {
  try {
    const {
      nome,
      tipo,
      endereco,
      numero,
      bairro,
      cidade,
      estado,
      cep,
      valorAluguel,
      status,
    } = req.body;

    if (!nome || !tipo || !endereco || !numero || !bairro || !cidade || !estado || !cep || !valorAluguel) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const imovel = await prisma.imovel.create({
      data: {
        nome,
        tipo,
        endereco,
        numero,
        bairro,
        cidade,
        estado,
        cep,
        valorAluguel: parseFloat(valorAluguel),
        status: status || 'disponivel',
      },
    });

    return res.status(201).json({
      message: 'Imóvel cadastrado com sucesso',
      imovel,
    });
  } catch (error) {
    console.error('Erro ao criar imóvel:', error);
    return res.status(500).json({ error: 'Erro ao cadastrar imóvel' });
  }
};

export const updateImovel = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nome,
      tipo,
      endereco,
      numero,
      bairro,
      cidade,
      estado,
      cep,
      valorAluguel,
      status,
    } = req.body;

    const imovelExistente = await prisma.imovel.findUnique({
      where: { id },
    });

    if (!imovelExistente) {
      return res.status(404).json({ error: 'Imóvel não encontrado' });
    }

    const imovel = await prisma.imovel.update({
      where: { id },
      data: {
        nome,
        tipo,
        endereco,
        numero,
        bairro,
        cidade,
        estado,
        cep,
        valorAluguel: valorAluguel ? parseFloat(valorAluguel) : undefined,
        status,
      },
    });

    return res.status(200).json({
      message: 'Imóvel atualizado com sucesso',
      imovel,
    });
  } catch (error) {
    console.error('Erro ao atualizar imóvel:', error);
    return res.status(500).json({ error: 'Erro ao atualizar imóvel' });
  }
};

export const deleteImovel = async (req, res) => {
  try {
    const { id } = req.params;

    const imovel = await prisma.imovel.findUnique({
      where: { id },
      include: {
        contratos: {
          where: { status: 'ativo' },
        },
      },
    });

    if (!imovel) {
      return res.status(404).json({ error: 'Imóvel não encontrado' });
    }

    if (imovel.contratos.length > 0) {
      return res.status(400).json({ error: 'Não é possível excluir imóvel com contratos ativos' });
    }

    await prisma.imovel.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Imóvel excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir imóvel:', error);
    return res.status(500).json({ error: 'Erro ao excluir imóvel' });
  }
};
