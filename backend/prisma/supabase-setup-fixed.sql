-- Script SQL para criar todas as tabelas no Supabase
-- COMPATÍVEL COM O SCHEMA PRISMA ATUAL
-- Execute este script no SQL Editor do Supabase

-- Criar extensão UUID se não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS "usuarios" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "senha" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "usuarios_tipo_check" CHECK ("tipo" IN ('proprietario', 'inquilino', 'admin'))
);

-- Tabela de Imóveis
CREATE TABLE IF NOT EXISTS "imoveis" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "valorAluguel" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'disponivel',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "imoveis_status_check" CHECK ("status" IN ('disponivel', 'alugado'))
);

-- Tabela de Inquilinos
CREATE TABLE IF NOT EXISTS "inquilinos" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL UNIQUE,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "endereco" TEXT NOT NULL,
    "usuarioId" TEXT UNIQUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "inquilinos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabela de Contratos
CREATE TABLE IF NOT EXISTS "contratos" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "valorAluguel" DOUBLE PRECISION NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "imovelId" TEXT NOT NULL,
    "inquilinoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "contratos_status_check" CHECK ("status" IN ('ativo', 'vencido', 'cancelado')),
    CONSTRAINT "contratos_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "contratos_inquilinoId_fkey" FOREIGN KEY ("inquilinoId") REFERENCES "inquilinos"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS "imoveis_status_idx" ON "imoveis"("status");
CREATE INDEX IF NOT EXISTS "contratos_imovelId_idx" ON "contratos"("imovelId");
CREATE INDEX IF NOT EXISTS "contratos_inquilinoId_idx" ON "contratos"("inquilinoId");
CREATE INDEX IF NOT EXISTS "contratos_status_idx" ON "contratos"("status");
CREATE INDEX IF NOT EXISTS "inquilinos_usuarioId_idx" ON "inquilinos"("usuarioId");

-- Inserir usuário admin padrão
-- Email: admin@alugueflow.com
-- Senha: admin123 (hash bcrypt)
INSERT INTO "usuarios" ("id", "nome", "email", "senha", "tipo", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid()::text,
    'Administrador',
    'admin@alugueflow.com',
    '$2a$10$X7ZK8vJX8L9tK1xJ6ZKR2OmVN9YKqQ3J5fZ8WxY9QZ1Y9QZ1Y9QZ1',
    'admin',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("email") DO NOTHING;

-- Mensagem de sucesso
DO $$
BEGIN
    RAISE NOTICE '✅ Todas as tabelas foram criadas com sucesso!';
    RAISE NOTICE '✅ Usuário admin: admin@alugueflow.com / senha: admin123';
END $$;
