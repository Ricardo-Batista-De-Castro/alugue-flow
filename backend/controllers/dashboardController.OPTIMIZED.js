import prisma from '../config/database.js';

export const getDashboard = async (req, res) => {
  try {
    if (req.user.tipo === 'proprietario') {
      // ✅ OTIMIZADO: Dashboard do proprietário
      // Todas as queries em paralelo usando Promise.all
      const [
        totalImoveis,
        imoveisDisponiveis,
        imoveisAlugados,
        totalInquilinos,
        contratosAtivos,
        contratosVencidos,
        receitaMensalAggregate,
        contratosVencendo,
        ultimosImoveis,
        ultimosInquilinos,
      ] = await Promise.all([
        // Contagens em paralelo
        prisma.imovel.count(),
        prisma.imovel.count({ where: { status: 'disponivel' } }),
        prisma.imovel.count({ where: { status: 'alugado' } }),
        prisma.inquilino.count(),
        prisma.contrato.count({ where: { status: 'ativo' } }),
        prisma.contrato.count({ where: { status: 'vencido' } }),
        
        // Agregação no banco em vez de buscar todos e somar
        prisma.contrato.aggregate({
          where: { status: 'ativo' },
          _sum: { valorAluguel: true },
        }),
        
        // Buscar contratos para vencimento (limitado a 20)
        prisma.contrato.findMany({
          where: { status: 'ativo' },
          take: 20, // Limitar quantidade para não trazer todos
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
          orderBy: { diaVencimento: 'asc' },
        }),
        
        // Últimos registros
        prisma.imovel.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
        }),
        
        prisma.inquilino.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      // Calcular receita mensal do aggregate
      const receitaMensal = receitaMensalAggregate._sum.valorAluguel || 0;

      // Filtrar contratos que vencem nos próximos 30 dias
      const hoje = new Date();
      const diaAtual = hoje.getDate();
      const mesAtual = hoje.getMonth();
      const anoAtual = hoje.getFullYear();
      
      const contratosVencendoFiltrados = contratosVencendo
        .map(contrato => {
          const diaVencimento = contrato.diaVencimento;
          
          // Calcular a próxima data de vencimento
          let dataVencimento;
          if (diaVencimento >= diaAtual) {
            // Vencimento é neste mês
            dataVencimento = new Date(anoAtual, mesAtual, diaVencimento);
          } else {
            // Vencimento é no próximo mês
            dataVencimento = new Date(anoAtual, mesAtual + 1, diaVencimento);
          }
          
          const diasRestantes = Math.ceil((dataVencimento - hoje) / (1000 * 60 * 60 * 24));
          
          return {
            ...contrato,
            dataVencimento: dataVencimento.toISOString(),
            diasRestantes,
          };
        })
        .filter(contrato => contrato.diasRestantes <= 30 && contrato.diasRestantes >= 0)
        .sort((a, b) => a.diasRestantes - b.diasRestantes)
        .slice(0, 10); // Limitar a 10 contratos na resposta

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
      // ✅ OTIMIZADO: Dashboard do inquilino
      const inquilino = await prisma.inquilino.findFirst({
        where: { usuarioId: req.user.id },
        include: {
          contratos: {
            where: { status: 'ativo' },
            take: 1, // Só precisa do primeiro contrato ativo
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
