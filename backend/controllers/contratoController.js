import prisma from '../config/database.js';

export const getContratos = async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : undefined;

    const contratos = await prisma.contrato.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        imovel: {
          select: {
            id: true,
            nome: true,
            endereco: true,
            numero: true,
            bairro: true,
            cidade: true,
            estado: true,
          },
        },
        pessoa: {
          select: {
            id: true,
            nome: true,
            cpf: true,
            telefone: true,
            email: true,
          },
        },
      },
    });

    return res.status(200).json(contratos);
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
        pessoa: true,
      },
    });

    if (!contrato) {
      return res.status(404).json({ error: 'Contrato não encontrado' });
    }

    return res.status(200).json(contrato);
  } catch (error) {
    console.error('Erro ao buscar contrato:', error);
    return res.status(500).json({ error: 'Erro ao buscar contrato' });
  }
};

export const createContrato = async (req, res) => {
  try {
    const {
      imovelId,
      pessoaId,
      dataInicio,
      dataFim,
      valorAluguel,
      diaVencimento,
      observacoes,
    } = req.body;

    // Validar campos obrigatórios
    if (!imovelId || !pessoaId || !dataInicio || !dataFim || !valorAluguel || !diaVencimento) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
    }

    // ✅ OTIMIZADO: Validações em paralelo usando Promise.all
    const [imovel, pessoa, contratoAtivo] = await Promise.all([
      prisma.imovel.findUnique({ where: { id: imovelId } }),
      prisma.pessoa.findUnique({ where: { id: pessoaId } }),
      prisma.contrato.findFirst({
        where: {
          imovelId,
          status: 'ativo',
        },
      }),
    ]);

    // Validações
    if (!imovel) {
      return res.status(404).json({ error: 'Imóvel não encontrado' });
    }

    if (!pessoa) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    if (contratoAtivo) {
      return res.status(400).json({ error: 'Já existe um contrato ativo para este imóvel' });
    }

    // Validar datas
    const dataInicioDate = new Date(dataInicio);
    const dataFimDate = new Date(dataFim);

    if (dataFimDate <= dataInicioDate) {
      return res.status(400).json({ error: 'A data de término deve ser posterior à data de início' });
    }

    // Validar dia de vencimento
    const diaVencimentoNum = parseInt(diaVencimento);
    if (diaVencimentoNum < 1 || diaVencimentoNum > 31) {
      return res.status(400).json({ error: 'Dia de vencimento deve estar entre 1 e 31' });
    }

    // Criar contrato e atualizar status do imóvel em uma transação
    const contrato = await prisma.$transaction(async (tx) => {
      // Criar contrato
      const novoContrato = await tx.contrato.create({
        data: {
          imovelId,
          pessoaId,
          dataInicio: dataInicioDate,
          dataFim: dataFimDate,
          valorAluguel: parseFloat(valorAluguel),
          diaVencimento: diaVencimentoNum,
          observacoes: observacoes || null,
          status: 'ativo',
        },
        include: {
          imovel: true,
          pessoa: true,
        },
      });

      // Atualizar status do imóvel
      await tx.imovel.update({
        where: { id: imovelId },
        data: { status: 'alugado' },
      });

      return novoContrato;
    });

    return res.status(201).json({
      message: 'Contrato criado com sucesso',
      contrato,
    });
  } catch (error) {
    console.error('Erro ao criar contrato:', error);
    return res.status(500).json({ 
      error: 'Erro ao criar contrato',
      details: error.message 
    });
  }
};

export const updateContrato = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      dataInicio,
      dataFim,
      valorAluguel,
      diaVencimento,
      status,
      observacoes,
    } = req.body;

    const contratoExistente = await prisma.contrato.findUnique({
      where: { id },
      include: { imovel: true },
    });

    if (!contratoExistente) {
      return res.status(404).json({ error: 'Contrato não encontrado' });
    }

    // Preparar dados para atualização
    const data = {};
    
    if (dataInicio !== undefined) data.dataInicio = new Date(dataInicio);
    if (dataFim !== undefined) data.dataFim = new Date(dataFim);
    if (valorAluguel !== undefined) data.valorAluguel = parseFloat(valorAluguel);
    if (diaVencimento !== undefined) data.diaVencimento = parseInt(diaVencimento);
    if (status !== undefined) data.status = status;
    if (observacoes !== undefined) data.observacoes = observacoes || null;

    // Validar datas se fornecidas
    if (data.dataInicio && data.dataFim && data.dataFim <= data.dataInicio) {
      return res.status(400).json({ error: 'A data de término deve ser posterior à data de início' });
    }

    // Atualizar contrato e status do imóvel se necessário
    const contrato = await prisma.$transaction(async (tx) => {
      // Atualizar contrato
      const contratoAtualizado = await tx.contrato.update({
        where: { id },
        data,
        include: {
          imovel: true,
          pessoa: true,
        },
      });

      // Se o status mudou para inativo, atualizar o imóvel
      if (status && status !== 'ativo' && contratoExistente.status === 'ativo') {
        await tx.imovel.update({
          where: { id: contratoExistente.imovelId },
          data: { status: 'disponivel' },
        });
      }

      return contratoAtualizado;
    });

    return res.status(200).json({
      message: 'Contrato atualizado com sucesso',
      contrato,
    });
  } catch (error) {
    console.error('Erro ao atualizar contrato:', error);
    return res.status(500).json({ 
      error: 'Erro ao atualizar contrato',
      details: error.message 
    });
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

    // Excluir contrato e liberar imóvel em uma transação
    await prisma.$transaction(async (tx) => {
      // Excluir contrato
      await tx.contrato.delete({
        where: { id },
      });

      // Se o contrato estava ativo, liberar o imóvel
      if (contrato.status === 'ativo') {
        await tx.imovel.update({
          where: { id: contrato.imovelId },
          data: { status: 'disponivel' },
        });
      }
    });

    return res.status(200).json({ message: 'Contrato excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir contrato:', error);
    return res.status(500).json({ error: 'Erro ao excluir contrato' });
  }
};
