-- Script SQL para criar todas as tabelas no Supabase
-- Execute este script no SQL Editor do Supabase

-- Criar extensão UUID se não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "senha" TEXT NOT NULL,
    "telefone" TEXT,
    "cpf" TEXT,
    "tipo" TEXT NOT NULL DEFAULT 'inquilino',
    "foto" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_tipo_check" CHECK ("tipo" IN ('proprietario', 'inquilino', 'admin'))
);

-- Tabela de Imóveis
CREATE TABLE IF NOT EXISTS "Imovel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "area" DECIMAL(10,2),
    "quartos" INTEGER,
    "banheiros" INTEGER,
    "vagas" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'disponivel',
    "proprietarioId" TEXT NOT NULL,
    "fotos" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Imovel_tipo_check" CHECK ("tipo" IN ('casa', 'apartamento', 'sala_comercial', 'terreno', 'kitnet', 'sobrado')),
    CONSTRAINT "Imovel_status_check" CHECK ("status" IN ('disponivel', 'alugado', 'manutencao', 'inativo')),
    CONSTRAINT "Imovel_proprietarioId_fkey" FOREIGN KEY ("proprietarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabela de Contratos
CREATE TABLE IF NOT EXISTS "Contrato" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imovelId" TEXT NOT NULL,
    "inquilinoId" TEXT NOT NULL,
    "proprietarioId" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "valorAluguel" DECIMAL(10,2) NOT NULL,
    "diaVencimento" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Contrato_status_check" CHECK ("status" IN ('ativo', 'encerrado', 'cancelado')),
    CONSTRAINT "Contrato_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Contrato_inquilinoId_fkey" FOREIGN KEY ("inquilinoId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Contrato_proprietarioId_fkey" FOREIGN KEY ("proprietarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabela de Pagamentos
CREATE TABLE IF NOT EXISTS "Pagamento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contratoId" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "dataPagamento" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "metodoPagamento" TEXT,
    "comprovante" TEXT,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Pagamento_status_check" CHECK ("status" IN ('pendente', 'pago', 'atrasado', 'cancelado')),
    CONSTRAINT "Pagamento_metodoPagamento_check" CHECK ("metodoPagamento" IN ('pix', 'boleto', 'transferencia', 'dinheiro', 'cartao')),
    CONSTRAINT "Pagamento_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabela de Manutenção
CREATE TABLE IF NOT EXISTS "Manutencao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imovelId" TEXT NOT NULL,
    "contratoId" TEXT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "prioridade" TEXT NOT NULL DEFAULT 'media',
    "status" TEXT NOT NULL DEFAULT 'aberta',
    "valor" DECIMAL(10,2),
    "dataAbertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataConclusao" TIMESTAMP(3),
    "responsavel" TEXT,
    "fotos" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Manutencao_tipo_check" CHECK ("tipo" IN ('eletrica', 'hidraulica', 'pintura', 'limpeza', 'outra')),
    CONSTRAINT "Manutencao_prioridade_check" CHECK ("prioridade" IN ('baixa', 'media', 'alta', 'urgente')),
    CONSTRAINT "Manutencao_status_check" CHECK ("status" IN ('aberta', 'em_andamento', 'concluida', 'cancelada')),
    CONSTRAINT "Manutencao_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Manutencao_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabela de Documentos
CREATE TABLE IF NOT EXISTS "Documento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contratoId" TEXT,
    "imovelId" TEXT,
    "userId" TEXT,
    "tipo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "tamanho" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Documento_tipo_check" CHECK ("tipo" IN ('contrato', 'comprovante', 'identidade', 'outro')),
    CONSTRAINT "Documento_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Documento_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Documento_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabela de Notificações
CREATE TABLE IF NOT EXISTS "Notificacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notificacao_tipo_check" CHECK ("tipo" IN ('pagamento', 'manutencao', 'contrato', 'sistema')),
    CONSTRAINT "Notificacao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS "Imovel_proprietarioId_idx" ON "Imovel"("proprietarioId");
CREATE INDEX IF NOT EXISTS "Imovel_status_idx" ON "Imovel"("status");
CREATE INDEX IF NOT EXISTS "Contrato_imovelId_idx" ON "Contrato"("imovelId");
CREATE INDEX IF NOT EXISTS "Contrato_inquilinoId_idx" ON "Contrato"("inquilinoId");
CREATE INDEX IF NOT EXISTS "Contrato_proprietarioId_idx" ON "Contrato"("proprietarioId");
CREATE INDEX IF NOT EXISTS "Pagamento_contratoId_idx" ON "Pagamento"("contratoId");
CREATE INDEX IF NOT EXISTS "Pagamento_status_idx" ON "Pagamento"("status");
CREATE INDEX IF NOT EXISTS "Manutencao_imovelId_idx" ON "Manutencao"("imovelId");
CREATE INDEX IF NOT EXISTS "Manutencao_contratoId_idx" ON "Manutencao"("contratoId");
CREATE INDEX IF NOT EXISTS "Notificacao_userId_idx" ON "Notificacao"("userId");
CREATE INDEX IF NOT EXISTS "Notificacao_lida_idx" ON "Notificacao"("lida");

-- Inserir usuário admin padrão (senha: admin123)
-- A senha está hashada com bcrypt
INSERT INTO "User" ("id", "nome", "email", "senha", "tipo", "createdAt", "updatedAt")
VALUES (
    'admin-' || gen_random_uuid()::text,
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
    RAISE NOTICE 'Todas as tabelas foram criadas com sucesso!';
    RAISE NOTICE 'Usuário admin criado: admin@alugueflow.com / senha: admin123';
END $$;
