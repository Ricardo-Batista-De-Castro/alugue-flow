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
      complemento,
      bairro,
      cidade,
      estado,
      cep,
      quartos,
      banheiros,
      area,
      valorAluguel,
      status,
    } = req.body;

    // Validar campos obrigatórios
    if (!nome || !tipo || !endereco || !numero || !bairro || !cidade || !estado || !cep || !valorAluguel) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
    }

    // Validar formato dos campos numéricos
    const valorAluguelNum = parseFloat(valorAluguel);
    if (isNaN(valorAluguelNum) || valorAluguelNum <= 0) {
      return res.status(400).json({ error: 'Valor do aluguel inválido' });
    }

    // Preparar dados para criação
    const data = {
      nome: nome.trim(),
      tipo: tipo.trim(),
      endereco: endereco.trim(),
      numero: numero.trim(),
      bairro: bairro.trim(),
      cidade: cidade.trim(),
      estado: estado.trim(),
      cep: cep.trim(),
      valorAluguel: valorAluguelNum,
      status: status || 'disponivel',
    };

    // Adicionar campos opcionais se fornecidos
    if (complemento) data.complemento = complemento.trim();
    if (quartos) data.quartos = parseInt(quartos);
    if (banheiros) data.banheiros = parseInt(banheiros);
    if (area) data.area = parseFloat(area);

    const imovel = await prisma.imovel.create({
      data,
    });

    return res.status(201).json({
      message: 'Imóvel cadastrado com sucesso',
      imovel,
    });
  } catch (error) {
    console.error('Erro ao criar imóvel:', error);
    return res.status(500).json({ 
      error: 'Erro ao cadastrar imóvel',
      details: error.message 
    });
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
      complemento,
      bairro,
      cidade,
      estado,
      cep,
      quartos,
      banheiros,
      area,
      valorAluguel,
      status,
    } = req.body;

    const imovelExistente = await prisma.imovel.findUnique({
      where: { id },
    });

    if (!imovelExistente) {
      return res.status(404).json({ error: 'Imóvel não encontrado' });
    }

    // Preparar dados para atualização
    const data = {};
    
    if (nome !== undefined) data.nome = nome.trim();
    if (tipo !== undefined) data.tipo = tipo.trim();
    if (endereco !== undefined) data.endereco = endereco.trim();
    if (numero !== undefined) data.numero = numero.trim();
    if (complemento !== undefined) data.complemento = complemento ? complemento.trim() : null;
    if (bairro !== undefined) data.bairro = bairro.trim();
    if (cidade !== undefined) data.cidade = cidade.trim();
    if (estado !== undefined) data.estado = estado.trim();
    if (cep !== undefined) data.cep = cep.trim();
    if (quartos !== undefined) data.quartos = quartos ? parseInt(quartos) : null;
    if (banheiros !== undefined) data.banheiros = banheiros ? parseInt(banheiros) : null;
    if (area !== undefined) data.area = area ? parseFloat(area) : null;
    if (valorAluguel !== undefined) data.valorAluguel = parseFloat(valorAluguel);
    if (status !== undefined) data.status = status;

    const imovel = await prisma.imovel.update({
      where: { id },
      data,
    });

    return res.status(200).json({
      message: 'Imóvel atualizado com sucesso',
      imovel,
    });
  } catch (error) {
    console.error('Erro ao atualizar imóvel:', error);
    return res.status(500).json({ 
      error: 'Erro ao atualizar imóvel',
      details: error.message 
    });
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
