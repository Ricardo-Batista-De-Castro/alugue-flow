-- ============================================================================
-- Script SQL Completo para Criar Todo o Banco de Dados
-- Execute este script no Supabase SQL Editor
-- ============================================================================

-- Remover tabelas existentes (se necessário - CUIDADO: isso apaga todos os dados!)
-- Descomente as linhas abaixo apenas se quiser recriar tudo do zero
DROP TABLE IF EXISTS "pagamento" CASCADE;
DROP TABLE IF EXISTS "contrato" CASCADE;
DROP TABLE IF EXISTS "inquilino" CASCADE;
DROP TABLE IF EXISTS "imovel" CASCADE;
DROP TABLE IF EXISTS "usuario" CASCADE;

-- ============================================================================
-- TABELA: usuario
-- ============================================================================
CREATE TABLE IF NOT EXISTS "usuario" (
    "id" TEXT PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "senha" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- ============================================================================
-- TABELA: imovel
-- ============================================================================
CREATE TABLE IF NOT EXISTS "imovel" (
    "id" TEXT PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "quartos" INTEGER,
    "banheiros" INTEGER,
    "garagens" INTEGER,
    "area" DOUBLE PRECISION,
    "valorAluguel" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'disponivel',
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- ============================================================================
-- TABELA: inquilino
-- ============================================================================
CREATE TABLE IF NOT EXISTS "inquilino" (
    "id" TEXT PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL UNIQUE,
    "rg" TEXT,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "profissao" TEXT,
    "rendaMensal" DOUBLE PRECISION,
    "endereco" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "usuarioId" TEXT UNIQUE
);

-- ============================================================================
-- TABELA: contrato
-- ============================================================================
CREATE TABLE IF NOT EXISTS "contrato" (
    "id" TEXT PRIMARY KEY,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "valorAluguel" DOUBLE PRECISION NOT NULL,
    "diaVencimento" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imovelId" TEXT NOT NULL,
    "inquilinoId" TEXT NOT NULL
);

-- ============================================================================
-- TABELA: pagamento
-- ============================================================================
CREATE TABLE IF NOT EXISTS "pagamento" (
    "id" TEXT PRIMARY KEY,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "dataPagamento" TIMESTAMP(3),
    "valorPago" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contratoId" TEXT NOT NULL
);

-- ============================================================================
-- FOREIGN KEYS (Chaves Estrangeiras)
-- ============================================================================

-- Inquilino -> Usuario
ALTER TABLE "inquilino" 
DROP CONSTRAINT IF EXISTS "inquilino_usuarioId_fkey";

ALTER TABLE "inquilino" 
ADD CONSTRAINT "inquilino_usuarioId_fkey" 
FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") 
ON DELETE SET NULL ON UPDATE CASCADE;

-- Contrato -> Imovel
ALTER TABLE "contrato" 
DROP CONSTRAINT IF EXISTS "contrato_imovelId_fkey";

ALTER TABLE "contrato" 
ADD CONSTRAINT "contrato_imovelId_fkey" 
FOREIGN KEY ("imovelId") REFERENCES "imovel"("id") 
ON DELETE RESTRICT ON UPDATE CASCADE;

-- Contrato -> Inquilino
ALTER TABLE "contrato" 
DROP CONSTRAINT IF EXISTS "contrato_inquilinoId_fkey";

ALTER TABLE "contrato" 
ADD CONSTRAINT "contrato_inquilinoId_fkey" 
FOREIGN KEY ("inquilinoId") REFERENCES "inquilino"("id") 
ON DELETE RESTRICT ON UPDATE CASCADE;

-- Pagamento -> Contrato
ALTER TABLE "pagamento" 
DROP CONSTRAINT IF EXISTS "pagamento_contratoId_fkey";

ALTER TABLE "pagamento" 
ADD CONSTRAINT "pagamento_contratoId_fkey" 
FOREIGN KEY ("contratoId") REFERENCES "contrato"("id") 
ON DELETE RESTRICT ON UPDATE CASCADE;

-- ============================================================================
-- ÍNDICES DE PERFORMANCE
-- ============================================================================

-- Índices para IMOVEL
CREATE INDEX IF NOT EXISTS "imovel_status_idx" 
ON "imovel"("status");

-- Índices para CONTRATO
CREATE INDEX IF NOT EXISTS "contrato_imovelId_idx" 
ON "contrato"("imovelId");

CREATE INDEX IF NOT EXISTS "contrato_inquilinoId_idx" 
ON "contrato"("inquilinoId");

CREATE INDEX IF NOT EXISTS "contrato_status_idx" 
ON "contrato"("status");

CREATE INDEX IF NOT EXISTS "contrato_imovelId_status_idx" 
ON "contrato"("imovelId", "status");

CREATE INDEX IF NOT EXISTS "contrato_inquilinoId_status_idx" 
ON "contrato"("inquilinoId", "status");

-- Índices para PAGAMENTO
CREATE INDEX IF NOT EXISTS "pagamento_contratoId_idx" 
ON "pagamento"("contratoId");

CREATE INDEX IF NOT EXISTS "pagamento_dataVencimento_idx" 
ON "pagamento"("dataVencimento");

CREATE INDEX IF NOT EXISTS "pagamento_status_idx" 
ON "pagamento"("status");

CREATE INDEX IF NOT EXISTS "pagamento_contratoId_status_idx" 
ON "pagamento"("contratoId", "status");

-- ============================================================================
-- VERIFICAÇÃO: Listar todas as tabelas criadas
-- ============================================================================
SELECT 
    tablename as "Tabela",
    schemaname as "Schema"
FROM 
    pg_tables 
WHERE 
    schemaname = 'public'
    AND tablename IN ('usuario', 'imovel', 'inquilino', 'contrato', 'pagamento')
ORDER BY 
    tablename;

-- ============================================================================
-- VERIFICAÇÃO: Listar todos os índices criados
-- ============================================================================
SELECT 
    tablename as "Tabela", 
    indexname as "Índice", 
    indexdef as "Definição"
FROM 
    pg_indexes 
WHERE 
    schemaname = 'public' 
    AND tablename IN ('usuario', 'imovel', 'inquilino', 'contrato', 'pagamento')
ORDER BY 
    tablename, 
    indexname;

-- ============================================================================
-- VERIFICAÇÃO: Listar todas as foreign keys criadas
-- ============================================================================
SELECT
    tc.table_name as "Tabela Origem", 
    kcu.column_name as "Coluna", 
    ccu.table_name as "Tabela Destino",
    ccu.column_name as "Coluna Destino"
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE 
    tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_schema = 'public'
    AND tc.table_name IN ('usuario', 'imovel', 'inquilino', 'contrato', 'pagamento')
ORDER BY 
    tc.table_name;

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================

-- RESULTADO ESPERADO:
-- ✅ 5 tabelas criadas: usuario, imovel, inquilino, contrato, pagamento
-- ✅ 4 foreign keys configuradas
-- ✅ 10 índices de performance criados
-- ✅ Todas as colunas do schema.prisma incluídas
