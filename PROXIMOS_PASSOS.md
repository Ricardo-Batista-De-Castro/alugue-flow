# 🚀 Próximos Passos - Configuração com Supabase

## ✅ O que já foi feito:
- ✔️ Todas as dependências do backend instaladas
- ✔️ Todas as dependências do frontend instaladas (Vite, Tailwind, React Router, Axios)
- ✔️ Arquivo `.env` criado com valores padrão

## 📋 Configuração do Banco de Dados (Supabase)

### 1. Criar um Projeto no Supabase

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Faça login na sua conta
3. Clique em **"New Project"**
4. Preencha:
   - **Name**: `alugueflow` (ou o nome que preferir)
   - **Database Password**: Crie uma senha forte e **ANOTE**
   - **Region**: Escolha o mais próximo (ex: South America - São Paulo)
5. Clique em **"Create new project"**
6. Aguarde alguns minutos enquanto o projeto é criado

### 2. Obter a Connection String

1. No dashboard do projeto criado, vá em **Settings** (ícone de engrenagem na barra lateral)
2. Clique em **Database** no menu lateral
3. Role até a seção **"Connection string"**
4. Selecione a aba **"URI"**
5. Copie a string que tem este formato:
   ```
   postgresql://postgres.[ref]:[SUA-SENHA]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
   ```
6. **IMPORTANTE**: Substitua `[SUA-SENHA]` pela senha que você criou no passo 1

### 3. Configurar o arquivo .env do Backend

Edite o arquivo `backend/.env` e atualize a `DATABASE_URL`:

```env
DATABASE_URL="postgresql://postgres.[ref]:[SUA-SENHA]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"
JWT_SECRET="sua_chave_secreta_muito_segura_mude_isso_em_producao_1234567890"
PORT=3000
```

**Dica**: Cole a connection string exata que você copiou do Supabase, apenas certifique-se de que a senha está preenchida.

### 4. Executar as Migrações do Prisma

No terminal, na pasta raiz do projeto:

```bash
cd backend
npx prisma migrate dev --name init
```

Isso irá criar todas as tabelas no seu banco de dados Supabase:
- users (usuários)
- imoveis (imóveis)
- inquilinos (inquilinos)
- contratos (contratos de aluguel)

### 5. (Opcional) Visualizar o Banco de Dados

Você pode visualizar as tabelas criadas de duas formas:

**Opção A - Supabase Dashboard:**
- No seu projeto Supabase, vá em **Table Editor**
- Você verá todas as tabelas criadas

**Opção B - Prisma Studio:**
```bash
cd backend
npx prisma studio
```
Isso abre uma interface visual em http://localhost:5555

### 6. Iniciar o Backend

No terminal, na pasta backend:

```bash
cd backend
npm run dev
```

Você deve ver:
```
🚀 Servidor rodando na porta 3000
✅ Banco de dados conectado
```

### 7. Iniciar o Frontend

Abra um **NOVO terminal**, na pasta raiz do projeto:

```bash
cd frontend
npm run dev
```

O frontend estará em: http://localhost:5173

### 8. Acessar a Aplicação

1. Abra o navegador em: **http://localhost:5173**
2. Clique em **"Cadastre-se"**
3. Preencha os dados e selecione tipo **"Proprietário"**
4. Faça login e explore o sistema! 🎉

## 🎯 Resumo dos Comandos:

```bash
# 1. Execute as migrações (apenas uma vez)
cd backend
npx prisma migrate dev --name init

# 2. Terminal 1 - Backend (mantenha rodando)
cd backend
npm run dev

# 3. Terminal 2 - Frontend (novo terminal, mantenha rodando)
cd frontend
npm run dev

# 4. Abra no navegador
# http://localhost:5173
```

## 📦 Dependências Instaladas:

### Backend:
- express - Framework web
- @prisma/client - ORM para banco de dados
- bcryptjs - Criptografia de senhas
- jsonwebtoken - Autenticação JWT
- cors - Permitir requisições do frontend
- dotenv - Variáveis de ambiente

### Frontend:
- react - Biblioteca UI
- vite - Build tool e dev server
- tailwindcss - Framework CSS
- axios - Cliente HTTP
- react-router-dom - Roteamento
- react-dom - React para web

## 🔧 Comandos Úteis:

```bash
# Ver dados do banco visualmente (Prisma Studio)
cd backend
npx prisma studio

# Regenerar o Prisma Client (se modificar o schema)
cd backend
npx prisma generate

# Ver logs do banco no Supabase
# Acesse o dashboard → Logs → Database

# Build do frontend para produção
cd frontend
npm run build
```

## 🚀 Deploy (quando estiver pronto):

### Backend no Railway:

1. Conecte seu repositório ao Railway
2. Configure a variável de ambiente `DATABASE_URL` com a mesma string do Supabase
3. Configure `JWT_SECRET` com uma chave segura
4. O Railway detecta automaticamente que é um projeto Node.js

### Frontend na Vercel ou Netlify:

1. Conecte seu repositório
2. Configure:
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Environment Variable**: `VITE_API_URL` = URL do seu backend no Railway

---

## ❓ Troubleshooting:

### Erro: "P1001: Can't reach database server"
- Verifique se a `DATABASE_URL` está correta no `.env`
- Confirme que substituiu `[SUA-SENHA]` pela senha real
- Verifique se o projeto Supabase está ativo (não pausado)

### Erro: "Environment variable not found: DATABASE_URL"
- Certifique-se de estar na pasta `backend` ao executar comandos
- Verifique se o arquivo `.env` existe e tem o conteúdo correto

### Backend não conecta ao banco:
- No Supabase, verifique se o projeto está "Active" (não "Paused")
- Teste a conexão usando o Prisma Studio: `npx prisma studio`

---

**Pronto! Seu sistema está configurado com Supabase e pronto para uso!** 🚀
