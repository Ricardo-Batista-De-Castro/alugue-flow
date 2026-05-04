import prisma from '../config/database.js';

export const getContratos = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let where = {};

    // Se for inquilino, retornar apenas seus contratos
    if (req.user.tipo === 'inquilino') {
      const inquilino = await prisma.inquilino.findFirst({
        where: { usuarioId: req.user.id },
        select: { id: true }
      });

      if (!inquilino) {
        return res.status(404).json({ error: 'Inquilino não encontrado' });
      }

      where.inquilinoId = inquilino.id;
    }

    // Adicionar filtro de status se fornecido
    if (status) {
      where.status = status;
    }

    const [contratos, total] = await Promise.all([
      prisma.contrato.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          imovel: {
            select: {
              id: true,
              nome: true,
              endereco: true,
              numero: true,
              bairro: true,
              cidade: true
            }
          },
          inquilino: {
            select: {
              id: true,
              nome: true,
              telefone: true,
              email: true
            }
          },
        },
      }),
      prisma.contrato.count({ where })
    ]);

    return res.status(200).json({
      contratos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar contratos:', error);
    return res.status(500).json({ error: 'Erro ao buscar contratos' });
  }
};

export const getContratoById = async (req, res) => {
  try {
    const { id } = req.params;

    const contrato = await prisma.contrato.findUnique({
      where: { id },
      include: {
        imovel: true,
        inquilino: true,
      },
    });

    if (!contrato) {
      return res.status(404).json({ error: 'Contrato não encontrado' });
    }

    // Se for inquilino, verificar se é o contrato dele
    if (req.user.tipo === 'inquilino') {
      const inquilino = await prisma.inquilino.findFirst({
        where: { usuarioId: req.user.id },
      });

      if (!inquilino || contrato.inquilinoId !== inquilino.id) {
        return res.status(403).json({ error: 'Acesso negado' });
      }
    }

    return res.status(200).json(contrato);
  } catch (error) {
    console.error('Erro ao buscar contrato:', error);
    return res.status(500).json({ error: 'Erro ao buscar contrato' });
  }
};

export const createContrato = async (req, res) => {
  try {
    const { imovelId, inquilinoId, valorAluguel, dataInicio, dataFim, diaVencimento, observacoes, status } = req.body;

    if (!imovelId || !inquilinoId || !valorAluguel || !dataInicio || !dataFim || !diaVencimento) {
      return res.status(400).json({ error: 'Campos obrigatórios: imovelId, inquilinoId, valorAluguel, dataInicio, dataFim e diaVencimento' });
    }

    // Verificar se imóvel existe
    const imovel = await prisma.imovel.findUnique({
      where: { id: imovelId },
    });

    if (!imovel) {
      return res.status(404).json({ error: 'Imóvel não encontrado' });
    }

    // Verificar se inquilino existe
    const inquilino = await prisma.inquilino.findUnique({
      where: { id: inquilinoId },
    });

    if (!inquilino) {
      return res.status(404).json({ error: 'Inquilino não encontrado' });
    }

    // Verificar se já existe contrato ativo para o imóvel
    const contratoAtivo = await prisma.contrato.findFirst({
      where: {
        imovelId,
        status: 'ativo',
      },
    });

    if (contratoAtivo) {
      return res.status(400).json({ error: 'Já existe um contrato ativo para este imóvel' });
    }

    const contrato = await prisma.contrato.create({
      data: {
        imovelId,
        inquilinoId,
        valorAluguel: parseFloat(valorAluguel),
        dataInicio: new Date(dataInicio),
        dataFim: new Date(dataFim),
        diaVencimento: parseInt(diaVencimento),
        observacoes: observacoes || null,
        status: status || 'ativo',
      },
      include: {
        imovel: true,
        inquilino: true,
      },
    });

    // Atualizar status do imóvel para alugado
    await prisma.imovel.update({
      where: { id: imovelId },
      data: { status: 'alugado' },
    });

    return res.status(201).json({
      message: 'Contrato cadastrado com sucesso',
      contrato,
    });
  } catch (error) {
    console.error('Erro ao criar contrato:', error);
    return res.status(500).json({ error: 'Erro ao cadastrar contrato' });
  }
};

export const updateContrato = async (req, res) => {
  try {
    const { id } = req.params;
    const { valorAluguel, dataInicio, dataFim, diaVencimento, observacoes, status } = req.body;

    const contratoExistente = await prisma.contrato.findUnique({
      where: { id },
    });

    if (!contratoExistente) {
      return res.status(404).json({ error: 'Contrato não encontrado' });
    }

    const contrato = await prisma.contrato.update({
      where: { id },
      data: {
        valorAluguel: valorAluguel ? parseFloat(valorAluguel) : undefined,
        dataInicio: dataInicio ? new Date(dataInicio) : undefined,
        dataFim: dataFim ? new Date(dataFim) : undefined,
        diaVencimento: diaVencimento ? parseInt(diaVencimento) : undefined,
        observacoes: observacoes !== undefined ? observacoes : undefined,
        status,
      },
      include: {
        imovel: true,
        inquilino: true,
      },
    });

    // Se o contrato foi cancelado ou vencido, atualizar o imóvel para disponível
    if (status && status !== 'ativo') {
      await prisma.imovel.update({
        where: { id: contrato.imovelId },
        data: { status: 'disponivel' },
      });
    }

    return res.status(200).json({
      message: 'Contrato atualizado com sucesso',
      contrato,
    });
  } catch (error) {
    console.error('Erro ao atualizar contrato:', error);
    return res.status(500).json({ error: 'Erro ao atualizar contrato' });
  }
};

export const deleteContrato = async (req, res) => {
  try {
    const { id } = req.params;

    const contrato = await prisma.contrato.findUnique({
      where: { id },
    });

    if (!contrato) {
      return res.status(404).json({ error: 'Contrato não encontrado' });
    }

    // Atualizar o imóvel para disponível antes de excluir o contrato
    await prisma.imovel.update({
      where: { id: contrato.imovelId },
      data: { status: 'disponivel' },
    });

    await prisma.contrato.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Contrato excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir contrato:', error);
    return res.status(500).json({ error: 'Erro ao excluir contrato' });
  }
};
