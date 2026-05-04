# Análise de Performance - Alugue Flow

## Problemas Identificados

### 1. **Configuração do Banco de Dados (CRÍTICO)**
- ❌ Sem connection pooling configurado
- ❌ Sem timeout definido
- ❌ Logs insuficientes para debug
- ❌ Sem statement_timeout no PostgreSQL

### 2. **Índices Faltantes no Schema (CRÍTICO)**
- ❌ Campo `status` no model `Imovel` (filtrado frequentemente)
- ❌ Campo `status` no model `Contrato` (WHERE em todas as queries)
- ❌ Campo `createdAt` não indexado (usado em ORDER BY)
- ❌ Campo `tipo` no model `Usuario` (filtros por tipo)

### 3. **Queries Ineficientes (ALTO IMPACTO)**
- ❌ Nenhuma paginação implementada (retorna TODOS os registros)
- ❌ Query extra no `getContratos` para inquilinos (findFirst desnecessário)
- ❌ Includes aninhados sem necessidade em algumas rotas

### 4. **Connection Pool (MÉDIO IMPACTO)**
- ❌ Usando valores default do Prisma
- ❌ Sem configuração de min/max connections
- ❌ Sem retry logic

## Impacto Estimado

Com banco em produção (Supabase/Railway):
- **Latência de rede**: +50-150ms
- **Sem índices**: +500-2000ms por query
- **Sem paginação**: +200-1000ms (dependendo do volume)
- **Connection pool inadequado**: +100-500ms

**Total**: 2,5s+ de latência (exatamente o que está acontecendo!)

## Soluções Propostas

### 1. Adicionar Índices ao Schema
```prisma
model Imovel {
  // ... campos existentes
  @@index([status])
  @@index([createdAt])
  @@index([cidade, estado]) // Para filtros por localização
}

model Contrato {
  // ... campos existentes
  @@index([status])
  @@index([createdAt])
  @@index([dataInicio, dataFim]) // Para buscar contratos por período
}

model Usuario {
  // ... campos existentes
  @@index([tipo])
}

model Inquilino {
  // ... campos existentes
  @@index([createdAt])
}
```

### 2. Otimizar Configuração do Prisma
```javascript
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Connection pooling
  connectionLimit: 10, // Ajustar conforme necessidade
});

// Adicionar middleware para logging de queries lentas
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  const queryTime = after - before;
  
  if (queryTime > 1000) { // Queries > 1s
    console.warn(`Slow query detected: ${params.model}.${params.action} took ${queryTime}ms`);
  }
  
  return result;
});
```

### 3. Implementar Paginação
```javascript
export const getImoveis = async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const skip = (page - 1) * limit;

  const [imoveis, total] = await Promise.all([
    prisma.imovel.findMany({
      where: status ? { status } : undefined,
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        contratos: {
          where: { status: 'ativo' },
          include: {
            inquilino: {
              select: { nome: true, telefone: true },
            },
          },
        },
      },
    }),
    prisma.imovel.count({
      where: status ? { status } : undefined,
    }),
  ]);

  return res.json({
    imoveis,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
};
```

### 4. Otimizar Query de Contratos
```javascript
// ANTES: 2 queries separadas para inquilinos
const inquilino = await prisma.inquilino.findFirst({ ... });
const contratos = await prisma.contrato.findMany({ ... });

// DEPOIS: 1 query com WHERE condicional
const contratos = await prisma.contrato.findMany({
  where: req.user.tipo === 'inquilino' 
    ? {
        inquilino: {
          usuarioId: req.user.id
        }
      }
    : undefined,
  // ...
});
```

### 5. Adicionar Connection String Otimizada
```env
# DATABASE_URL com parâmetros de performance
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=10&pool_timeout=30&statement_cache_size=100"
```

## Prioridade de Implementação

1. **🔴 URGENTE** - Adicionar índices (maior impacto)
2. **🔴 URGENTE** - Implementar paginação
3. **🟡 IMPORTANTE** - Otimizar config do Prisma
4. **🟡 IMPORTANTE** - Otimizar query de contratos
5. **🟢 RECOMENDADO** - Middleware de logging

## Ganho Esperado

Após implementação:
- ✅ Redução de 2,5s para ~300-500ms
- ✅ Melhoria de 80-85% na performance
- ✅ Escalabilidade para milhares de registros
