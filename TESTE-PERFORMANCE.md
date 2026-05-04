# Teste de Performance - AlugueFlow

## ✅ Otimizações Aplicadas

### 1. Schema do Banco de Dados (Prisma)
- ✅ Adicionados índices para campos frequentemente consultados
- ✅ Índices compostos para queries complexas
- ✅ Índice único para email de usuário

### 2. Configuração do Banco de Dados
- ✅ Middleware para detectar queries lentas (> 1000ms)
- ✅ Logs configurados por ambiente
- ✅ Graceful shutdown implementado

### 3. Controllers Otimizados
- ✅ Paginação implementada em `getImoveis`
- ✅ Paginação implementada em `getContratos`
- ✅ Select específico de campos (reduz dados transferidos)
- ✅ Uso de `Promise.all` para queries paralelas

## 🧪 Como Testar

### 1. Aplicar as Mudanças no Schema

```bash
cd backend
npx prisma migrate dev --name add_performance_indexes
```

### 2. Reiniciar o Servidor

```bash
npm run dev
```

### 3. Testar a API com Paginação

#### Listar Imóveis com Paginação

```bash
# Página 1, 10 itens por página
curl http://localhost:3000/api/imoveis?page=1&limit=10

# Página 2, 5 itens por página
curl http://localhost:3000/api/imoveis?page=2&limit=5

# Filtrar por status
curl http://localhost:3000/api/imoveis?status=disponivel&page=1&limit=10
```

**Resposta esperada:**
```json
{
  "imoveis": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

#### Listar Contratos com Paginação

```bash
# Página 1, 10 itens por página
curl -H "Authorization: Bearer SEU_TOKEN" \
  http://localhost:3000/api/contratos?page=1&limit=10

# Filtrar por status
curl -H "Authorization: Bearer SEU_TOKEN" \
  http://localhost:3000/api/contratos?status=ativo&page=1&limit=10
```

**Resposta esperada:**
```json
{
  "contratos": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 30,
    "pages": 3
  }
}
```

### 4. Monitorar Queries Lentas

Observe o console do servidor. Quando uma query demorar mais de 1 segundo, você verá:

```
⚠️ Slow query detected: Imovel.findMany took 1250ms
```

### 5. Testar Performance com Volume de Dados

Para testar com mais dados, você pode criar um script de seed:

```javascript
// prisma/seed-performance.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criar 100 imóveis
  for (let i = 0; i < 100; i++) {
    await prisma.imovel.create({
      data: {
        nome: `Imóvel Teste ${i}`,
        tipo: 'apartamento',
        endereco: `Rua Teste ${i}`,
        numero: `${i}`,
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01000-000',
        valorAluguel: 1000 + i * 10,
        status: i % 2 === 0 ? 'disponivel' : 'alugado',
      },
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Execute:
```bash
node prisma/seed-performance.js
```

## 📊 Métricas Esperadas

### Antes das Otimizações
- Query sem paginação: ~800ms para 100 registros
- Sem índices: full table scan
- Transferência de dados desnecessários

### Depois das Otimizações
- Query com paginação: ~50-100ms para 10 registros
- Com índices: busca otimizada por chave
- Apenas campos necessários são transferidos
- Queries paralelas reduzem tempo total

## 🎯 Benefícios Esperados

1. **Redução de Latência**: 80-90% mais rápido com paginação
2. **Menor Uso de Memória**: Apenas dados necessários são carregados
3. **Escalabilidade**: Sistema suporta milhares de registros
4. **Monitoramento**: Identificação automática de queries lentas
5. **UX Melhorado**: Respostas mais rápidas para o usuário

## 🔍 Verificar Índices no Banco

Para verificar se os índices foram criados corretamente:

```sql
-- PostgreSQL
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename IN ('Usuario', 'Imovel', 'Contrato', 'Inquilino');
```

## 📝 Próximos Passos (Opcionais)

1. **Cache**: Implementar Redis para cachear queries frequentes
2. **CDN**: Usar CDN para imagens de imóveis
3. **Lazy Loading**: Carregar dados sob demanda no frontend
4. **Connection Pooling**: Configurar pool de conexões do Prisma
5. **Query Optimization**: Analisar e otimizar queries mais complexas

## ⚠️ Notas Importantes

- A paginação é **obrigatória** para listagens
- Valores padrão: `page=1`, `limit=10`
- Índices devem ser mantidos atualizados
- Monitorar logs para identificar gargalos
- Fazer backup antes de aplicar migrations
