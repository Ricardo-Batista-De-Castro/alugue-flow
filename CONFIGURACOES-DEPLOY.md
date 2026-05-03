# ⚙️ Configurações de Deploy - AlugueFlow

Resumo completo das configurações necessárias para o deploy.

---

## 🎯 Arquitetura de Deploy

```
┌─────────────────┐
│   SUPABASE      │ ← Banco de Dados PostgreSQL
│   (Database)    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│    RAILWAY      │ ← Backend (Node.js/Express)
│   (Backend)     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│    VERCEL       │ ← Frontend (React/Vite)
│   (Frontend)    │
└─────────────────┘
```

---

## 📦 1. BACKEND - Railway

### Configurações do Serviço
- **Root Directory**: `backend`
- **Build Command**: `npm install && npx prisma generate`
- **Start Command**: `node server.js`

### Variáveis de Ambiente

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `DATABASE_URL` | URL do Supabase | Connection string do banco PostgreSQL |
| `JWT_SECRET` | String aleatória | Chave secreta para JWT (min 32 caracteres) |
| `PORT` | `$PORT` | Porta do servidor (Railway define automaticamente) |
| `NODE_ENV` | `production` | Ambiente de execução |
| `FRONTEND_URL` | URL da Vercel | URL do frontend para CORS |

### Exemplo de Valores:
```env
DATABASE_URL=postgresql://postgres.xxx:senha@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
JWT_SECRET=sua_chave_secreta_aqui_minimo_32_caracteres
PORT=$PORT
NODE_ENV=production
FRONTEND_URL=https://alugueflow.vercel.app
```

### Como obter DATABASE_URL do Supabase:
1. Acesse seu projeto no Supabase
2. Vá em **Settings** > **Database**
3. Role até **Connection String**
4. Selecione a aba **Connection Pooling**
5. Escolha **Mode: Transaction**
6. Copie a string e substitua `[YOUR-PASSWORD]` pela senha do banco

---

## 🎨 2. FRONTEND - Vercel

### Configurações do Projeto
- **Root Directory**: `frontend`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Variáveis de Ambiente

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `VITE_API_URL` | URL do Railway | URL do backend para requisições API |

### Exemplo de Valores:
```env
VITE_API_URL=https://alugueflow-backend-production.up.railway.app
```

⚠️ **IMPORTANTE**: 
- **NÃO** adicione barra `/` no final das URLs
- Variáveis do Vite **DEVEM** começar com `VITE_`

---

## 🗄️ 3. BANCO DE DADOS - Supabase

### Tabelas Criadas
```sql
✅ User (usuários do sistema)
✅ Tenant (inquilinos)
✅ Property (imóveis)
✅ Contract (contratos)
✅ Payment (pagamentos)
```

### Usuário Administrador
Crie pelo SQL Editor do Supabase:

```sql
INSERT INTO "User" (email, name, password, role)
VALUES (
  'admin@alugueflow.com',
  'Administrador',
  '$2b$10$...',  -- Use bcrypt para gerar o hash
  'ADMIN'
);
```

Para gerar o hash da senha, use:
```bash
node -e "console.log(require('bcrypt').hashSync('SuaSenha123', 10))"
```

---

## 🔄 Ordem de Deploy

### 1️⃣ Primeiro: Supabase (Banco de Dados)
- Criar projeto
- Executar migrations do Prisma
- Criar usuário administrador

### 2️⃣ Segundo: Railway (Backend)
- Configurar Root Directory: `backend`
- Adicionar todas as variáveis de ambiente
- Deploy automático após push

### 3️⃣ Terceiro: Vercel (Frontend)
- Configurar Root Directory: `frontend`
- Adicionar `VITE_API_URL` com URL do Railway
- Deploy automático após push

### 4️⃣ Quarto: Atualizar CORS
- Adicionar `FRONTEND_URL` no Railway
- Usar URL gerada pela Vercel
- Backend reiniciará automaticamente

---

## 🧪 Como Testar

### Teste 1: Backend
```bash
# Acessar URL do Railway no navegador
https://seu-backend.up.railway.app

# Deve retornar:
{
  "message": "API AlugueFlow - Sistema de Gestão de Aluguéis"
}
```

### Teste 2: Frontend
```bash
# Acessar URL da Vercel no navegador
https://seu-frontend.vercel.app

# Deve mostrar:
- Página de login do AlugueFlow
- Formulário de email e senha
```

### Teste 3: Conexão Completa
1. Abra o frontend na Vercel
2. Abra DevTools (F12) > Console
3. Tente fazer login
4. Verifique se não há erros de CORS
5. Login bem-sucedido = redirecionamento para dashboard

---

## 🐛 Troubleshooting

### Erro: CORS Policy

**Problema**: `Access to fetch at 'https://backend...' has been blocked by CORS policy`

**Solução**:
1. Verificar se `FRONTEND_URL` está configurada no Railway
2. Confirmar que a URL está **sem barra no final**
3. Reiniciar o serviço do backend no Railway
4. Limpar cache do navegador (Ctrl + Shift + R)

### Erro: Network Error

**Problema**: Frontend não consegue conectar ao backend

**Solução**:
1. Verificar se `VITE_API_URL` está configurada na Vercel
2. Testar a URL do backend diretamente no navegador
3. Verificar se o backend está rodando (Railway Logs)
4. Fazer redeploy do frontend

### Erro: 401 Unauthorized

**Problema**: Login retorna erro 401

**Solução**:
1. Verificar se o usuário existe no Supabase
2. Confirmar que a senha está correta
3. Verificar se `JWT_SECRET` está configurado no Railway
4. Checar logs do backend para mais detalhes

### Erro: Database Connection

**Problema**: Backend não conecta ao banco

**Solução**:
1. Verificar se `DATABASE_URL` está correta
2. Confirmar que o Prisma Client foi gerado (`npx prisma generate`)
3. Verificar se as migrations foram aplicadas
4. Testar conexão direta com o banco pelo Supabase

---

## 📝 Checklist Completo

### Supabase
- [ ] Projeto criado
- [ ] Migrations executadas
- [ ] Usuário admin criado
- [ ] DATABASE_URL copiada

### Railway (Backend)
- [ ] Serviço criado
- [ ] Root Directory: `backend`
- [ ] DATABASE_URL configurada
- [ ] JWT_SECRET configurada
- [ ] PORT=$PORT configurada
- [ ] NODE_ENV=production configurada
- [ ] Deploy concluído
- [ ] URL do backend copiada
- [ ] Backend testado (retorna JSON)
- [ ] FRONTEND_URL adicionada

### Vercel (Frontend)
- [ ] Projeto importado
- [ ] Root Directory: `frontend`
- [ ] VITE_API_URL configurada
- [ ] Deploy concluído
- [ ] URL do frontend copiada
- [ ] Frontend testado (página carrega)

### Testes Finais
- [ ] Login funciona sem erros
- [ ] Dashboard carrega corretamente
- [ ] Não há erros de CORS
- [ ] Dados são salvos no banco
- [ ] Navegação entre páginas funciona

---

## 🎉 Deploy Completo!

Quando todos os itens acima estiverem ✅, seu sistema está 100% operacional em produção!

**Stack Final:**
- ☁️ **Backend**: Railway
- 🌐 **Frontend**: Vercel  
- 🗄️ **Database**: Supabase

**Deploy automático configurado para ambos os serviços!** 🚀
