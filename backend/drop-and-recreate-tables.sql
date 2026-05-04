-- Script para dropar e recriar TODAS as tabelas com nomes em minúsculas
-- AlugueFlow - Correção completa de nomes de tabelas

-- 1. Dropar todas as tabelas existentes (na ordem correta devido às foreign keys)
DROP TABLE IF EXISTS "Notificacao" CASCADE;
DROP TABLE IF EXISTS "Manutencao" CASCADE;
DROP TABLE IF EXISTS "Pagamento" CASCADE;
DROP TABLE IF EXISTS "Documento" CASCADE;
DROP TABLE IF EXISTS "Contrato" CASCADE;
DROP TABLE IF EXISTS "Imovel" CASCADE;
DROP TABLE IF EXISTS "Inquilino" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "Usuario" CASCADE;

-- Também dropar as versões antigas caso existam
DROP TABLE IF EXISTS "notificacao" CASCADE;
DROP TABLE IF EXISTS "manutencao" CASCADE;
DROP TABLE IF EXISTS "pagamento" CASCADE;
DROP TABLE IF EXISTS "documento" CASCADE;
DROP TABLE IF EXISTS "contrato" CASCADE;
DROP TABLE IF EXISTS "imovel" CASCADE;
DROP TABLE IF EXISTS "inquilino" CASCADE;
DROP TABLE IF EXISTS "usuario" CASCADE;

-- 2. Criar tabelas com nomes completamente em minúsculas

-- Tabela: usuario
CREATE TABLE "usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- Tabela: imovel
CREATE TABLE "imovel" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "quartos" INTEGER,
    "banheiros" INTEGER,
    "area" DOUBLE PRECISION,
    "valorAluguel" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'disponivel',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "imovel_pkey" PRIMARY KEY ("id")
);

-- Tabela: inquilino
CREATE TABLE "inquilino" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT,
    "dataNascimento" TIMESTAMP(3),
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profissao" TEXT,
    "rendaMensal" DOUBLE PRECISION,
    "usuarioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inquilino_pkey" PRIMARY KEY ("id")
);

-- Tabela: contrato
CREATE TABLE "contrato" (
    "id" TEXT NOT NULL,
    "imovelId" TEXT NOT NULL,
    "inquilinoId" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "valorAluguel" DOUBLE PRECISION NOT NULL,
    "diaVencimento" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contrato_pkey" PRIMARY KEY ("id")
);

-- Tabela: documento
CREATE TABLE "documento" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "contratoId" TEXT,
    "inquilinoId" TEXT,
    "imovelId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documento_pkey" PRIMARY KEY ("id")
);

-- Tabela: pagamento
CREATE TABLE "pagamento" (
    "id" TEXT NOT NULL,
    "contratoId" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "dataPagamento" TIMESTAMP(3),
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "formaPagamento" TEXT,
    "comprovante" TEXT,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagamento_pkey" PRIMARY KEY ("id")
);

-- Tabela: manutencao
CREATE TABLE "manutencao" (
    "id" TEXT NOT NULL,
    "imovelId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "prioridade" TEXT NOT NULL DEFAULT 'media',
    "dataAbertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataConclusao" TIMESTAMP(3),
    "valor" DOUBLE PRECISION,
    "responsavel" TEXT,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manutencao_pkey" PRIMARY KEY ("id")
);

-- Tabela: notificacao
CREATE TABLE "notificacao" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "dataLida" TIMESTAMP(3),
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notificacao_pkey" PRIMARY KEY ("id")
);

-- 3. Criar índices únicos
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");
CREATE UNIQUE INDEX "inquilino_cpf_key" ON "inquilino"("cpf");
CREATE UNIQUE INDEX "inquilino_email_key" ON "inquilino"("email");
CREATE UNIQUE INDEX "inquilino_usuarioId_key" ON "inquilino"("usuarioId");

-- 4. Criar índices para melhorar performance
CREATE INDEX "contrato_imovelId_idx" ON "contrato"("imovelId");
CREATE INDEX "contrato_inquilinoId_idx" ON "contrato"("inquilinoId");
CREATE INDEX "documento_contratoId_idx" ON "documento"("contratoId");
CREATE INDEX "documento_inquilinoId_idx" ON "documento"("inquilinoId");
CREATE INDEX "documento_imovelId_idx" ON "documento"("imovelId");
CREATE INDEX "pagamento_contratoId_idx" ON "pagamento"("contratoId");
CREATE INDEX "pagamento_dataVencimento_idx" ON "pagamento"("dataVencimento");
CREATE INDEX "manutencao_imovelId_idx" ON "manutencao"("imovelId");
CREATE INDEX "manutencao_status_idx" ON "manutencao"("status");
CREATE INDEX "notificacao_usuarioId_idx" ON "notificacao"("usuarioId");
CREATE INDEX "notificacao_lida_idx" ON "notificacao"("lida");

-- 5. Adicionar foreign keys
ALTER TABLE "inquilino" ADD CONSTRAINT "inquilino_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "contrato" ADD CONSTRAINT "contrato_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imovel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "contrato" ADD CONSTRAINT "contrato_inquilinoId_fkey" FOREIGN KEY ("inquilinoId") REFERENCES "inquilino"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "documento" ADD CONSTRAINT "documento_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "contrato"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "documento" ADD CONSTRAINT "documento_inquilinoId_fkey" FOREIGN KEY ("inquilinoId") REFERENCES "inquilino"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "documento" ADD CONSTRAINT "documento_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imovel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "pagamento" ADD CONSTRAINT "pagamento_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "contrato"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "manutencao" ADD CONSTRAINT "manutencao_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imovel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notificacao" ADD CONSTRAINT "notificacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Script executado com sucesso!
-- Todas as tabelas foram recriadas em minúsculas
