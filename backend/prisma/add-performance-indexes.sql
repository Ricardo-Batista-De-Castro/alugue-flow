-- Script para adicionar índices de performance no banco de dados
-- Execute este script diretamente no Supabase SQL Editor

-- Índices para a tabela Imovel
CREATE INDEX IF NOT EXISTS "imovel_status_idx" ON "imovel"("status");

-- Índices para a tabela Contrato
CREATE INDEX IF NOT EXISTS "contrato_imovelId_idx" ON "contrato"("imovelId");
CREATE INDEX IF NOT EXISTS "contrato_inquilinoId_idx" ON "contrato"("inquilinoId");
CREATE INDEX IF NOT EXISTS "contrato_status_idx" ON "contrato"("status");
CREATE INDEX IF NOT EXISTS "contrato_imovelId_status_idx" ON "contrato"("imovelId", "status");
CREATE INDEX IF NOT EXISTS "contrato_inquilinoId_status_idx" ON "contrato"("inquilinoId", "status");

-- Índices para a tabela Pagamento
CREATE INDEX IF NOT EXISTS "pagamento_contratoId_idx" ON "pagamento"("contratoId");
CREATE INDEX IF NOT EXISTS "pagamento_dataVencimento_idx" ON "pagamento"("dataVencimento");
CREATE INDEX IF NOT EXISTS "pagamento_status_idx" ON "pagamento"("status");
CREATE INDEX IF NOT EXISTS "pagamento_contratoId_status_idx" ON "pagamento"("contratoId", "status");

-- Verificar índices criados
SELECT 
    tablename, 
    indexname, 
    indexdef 
FROM 
    pg_indexes 
WHERE 
    schemaname = 'public' 
    AND tablename IN ('imovel', 'contrato', 'pagamento')
ORDER BY 
    tablename, 
    indexname;
