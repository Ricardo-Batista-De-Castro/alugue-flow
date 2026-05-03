# 🔄 Instruções para Reiniciar o Backend

## ⚠️ Problema Identificado

O backend está rodando e bloqueando arquivos do Prisma, impedindo a regeneração do cliente.

## 📝 Passos para Corrigir

### 1. Parar os servidores backend

No Visual Studio Code, há **3 terminais rodando o backend**:

1. Pressione `Ctrl + C` em cada terminal que está executando `npm run dev` no backend
2. Ou feche todos os terminais backend

### 2. Regenerar o Prisma Client

Após parar os servidores, execute:

```bash
npm --prefix backend run prisma:generate
```

### 3. Reiniciar o backend

```bash
npm --prefix backend run dev
```

## ✅ O que foi corrigido

- ✅ Schema do Prisma ajustado para usar as tabelas existentes no Supabase:
  - `Usuario` → `User`
  - `Imovel` → `Imovel`
  - `Inquilino` → `Inquilino` 
  - `Contrato` → `Contrato`

## 🎯 Após reiniciar

O sistema estará funcionando corretamente:
- Backend na porta 3001
- Frontend na porta 3000
- Conectado ao Supabase com as tabelas corretas

## 📱 Para testar

Acesse http://localhost:3000 e tente fazer login com o usuário que está no banco.
