import prisma from '../config/database.js';

export const getDashboard = async (req, res) => {
  try {
    if (req.user.tipo === 'proprietario') {
      // Dashboard do proprietário
      const totalImoveis = await prisma.imovel.count();
      const imoveisDisponiveis = await prisma.imovel.count({
        where: { status: 'disponivel' },
      });
      const imoveisAlugados = await prisma.imovel.count({
        where: { status: 'alugado' },
      });
      const totalInquilinos = await prisma.inquilino.count();
      const contratosAtivos = await prisma.contrato.count({
        where: { status: 'ativo' },
      });
      const contratosVencidos = await prisma.contrato.count({
        where: { status: 'vencido' },
      });

      // Calcular receita mensal total
      const contratos = await prisma.contrato.findMany({
        where: { status: 'ativo' },
        select: {
          valorAluguel: true,
        },
      });

      const receitaMensal = contratos.reduce((total, contrato) => {
        return total + contrato.valorAluguel;
      }, 0);

      // Buscar contratos próximos do vencimento (próximos 30 dias)
      const hoje = new Date();
      const proximoMes = new Date();
      proximoMes.setDate(hoje.getDate() + 30);

      const contratosVencendo = await prisma.contrato.findMany({
        where: {
          status: 'ativo',
          dataVencimento: {
            gte: hoje,
            lte: proximoMes,
          },
        },
        include: {
          imovel: {
            select: {
              nome: true,
              endereco: true,
            },
          },
          inquilino: {
            select: {
              nome: true,
              telefone: true,
            },
          },
        },
        orderBy: {
          dataVencimento: 'asc',
        },
      });

      // Últimos imóveis cadastrados
      const ultimosImoveis = await prisma.imovel.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      });

      // Últimos inquilinos cadastrados
      const ultimosInquilinos = await prisma.inquilino.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json({
        resumo: {
          totalImoveis,
          imoveisDisponiveis,
          imoveisAlugados,
          totalInquilinos,
          contratosAtivos,
          contratosVencidos,
          receitaMensal,
        },
        contratosVencendo,
        ultimosImoveis,
        ultimosInquilinos,
      });
    } else {
      // Dashboard do inquilino
      const inquilino = await prisma.inquilino.findFirst({
        where: { usuarioId: req.user.id },
        include: {
          contratos: {
            where: { status: 'ativo' },
            include: {
              imovel: true,
            },
          },
        },
      });

      if (!inquilino) {
        return res.status(404).json({ error: 'Inquilino não encontrado' });
      }

      const contratoAtivo = inquilino.contratos[0] || null;

      let diasAteVencimento = null;
      if (contratoAtivo) {
        const hoje = new Date();
        const vencimento = new Date(contratoAtivo.dataVencimento);
        const diffTime = vencimento.getTime() - hoje.getTime();
        diasAteVencimento = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      return res.status(200).json({
        inquilino: {
          nome: inquilino.nome,
          cpf: inquilino.cpf,
          telefone: inquilino.telefone,
          email: inquilino.email,
          endereco: inquilino.endereco,
        },
        contratoAtivo,
        diasAteVencimento,
      });
    }
  } catch (error) {
    console.error('Erro ao buscar dashboard:', error);
    return res.status(500).json({ error: 'Erro ao buscar dados do dashboard' });
  }
};
