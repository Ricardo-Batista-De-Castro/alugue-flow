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
          diaVencimento: 'asc',
        },
      });

      // Filtrar contratos que vencem nos próximos 30 dias
      const diaAtual = hoje.getDate();
      const contratosVencendoFiltrados = contratosVencendo.filter(contrato => {
        const diaVencimento = contrato.diaVencimento;
        const diasRestantes = diaVencimento >= diaAtual 
          ? diaVencimento - diaAtual 
          : (30 - diaAtual) + diaVencimento;
        return diasRestantes <= 30;
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
        contratosVencendo: contratosVencendoFiltrados,
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
        const diaAtual = hoje.getDate();
        const diaVencimento = contratoAtivo.diaVencimento;
        
        if (diaVencimento >= diaAtual) {
          diasAteVencimento = diaVencimento - diaAtual;
        } else {
          // Vencimento é no próximo mês
          const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
          diasAteVencimento = (ultimoDiaMes - diaAtual) + diaVencimento;
        }
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
