# 🚀 Deploy no Railway - AlugueFlow

Este guia explica como fazer o deploy completo do sistema AlugueFlow no Railway.

## 📋 Pré-requisitos

- ✅ Conta no Railway criada
- ✅ Repositório conectado ao Railway
- ✅ Banco de dados Supabase configurado
- ✅ URL do banco de dados (DATABASE_URL) disponível

## 🎯 Estrutura do Deploy

O projeto será deployado em **2 serviços separados** no Railway:
1. **Backend** (API Node.js/Express)
2. **Frontend** (React/Vite)

---

## 🔧 Configuração do Backend

### 1. Criar Serviço do Backend no Railway

1. Acesse seu projeto no Railway
2. Clique em **"+ New Service"**
3. Selecione o repositório conectado
4. Configure o **Root Directory**: `backend`

### 2. Configurar Variáveis de Ambiente

No painel do Railway, adicione as seguintes variáveis:

```env
DATABASE_URL=sua_url_do_supabase_aqui
JWT_SECRET=seu_segredo_jwt_aqui
PORT=$PORT
NODE_ENV=production
```

**⚠️ IMPORTANTE:**
- `DATABASE_URL`: Copie do seu projeto Supabase (Settings > Database > Connection String)
- `JWT_SECRET`: Use uma string aleatória segura (ex: gerada com `openssl rand -base64 32`)
- `PORT`: Deixe como `$PORT` (Railway define automaticamente)

### 3. Configurar Build e Start

O Railway detectará automaticamente o Node.js. Verifique se está usando:

- **Build Command**: `npm run build`
- **Start Command**: `npm start`

### 4. Deploy

Clique em **"Deploy"** e aguarde o build completar.

Após o deploy, copie a **URL do backend** (algo como: `https://seu-app.up.railway.app`)

---

## 🎨 Configuração do Frontend

### 1. Criar Serviço do Frontend no Railway

1. No mesmo projeto, clique em **"+ New Service"** novamente
2. Selecione o mesmo repositório
3. Configure o **Root Directory**: `frontend`

### 2. Configurar Variáveis de Ambiente

No painel do Railway, adicione:

```env
VITE_API_URL=https://sua-url-do-backend.up.railway.app
NODE_ENV=production
```

**⚠️ IMPORTANTE:**
- Substitua `https://sua-url-do-backend.up.railway.app` pela URL real do backend que você copiou
- **NÃO** adicione barra `/` no final da URL

### 3. Configurar Build e Start

- **Build Command**: `npm run build`
- **Start Command**: `npm run preview`

### 4. Deploy

Clique em **"Deploy"** e aguarde o build completar.

---

## 🔄 Atualizar CORS no Backend

Após obter a URL do frontend no Railway, você precisa adicioná-la nas variáveis de ambiente do backend:

1. Volte ao serviço do **Backend** no Railway
2. Adicione uma nova variável:

```env
FRONTEND_URL=https://sua-url-do-frontend.up.railway.app
```

3. O backend reiniciará automaticamente

---

## ✅ Verificação Final

### 1. Testar o Backend
Acesse: `https://sua-url-do-backend.up.railway.app`

Você deve ver:
```json
{
  "message": "API AlugueFlow - Sistema de Gestão de Aluguéis"
}
```

### 2. Testar o Frontend
Acesse: `https://sua-url-do-frontend.up.railway.app`

Você deve ver a página de login do AlugueFlow.

### 3. Testar Login

Use as credenciais que você criou no Supabase:
- Email: `admin@alugueflow.com` (ou outro que você criou)
- Senha: sua senha

---

## 🐛 Troubleshooting

### Erro de CORS

Se você receber erro de CORS:
1. Verifique se a variável `FRONTEND_URL` está correta no backend
2. Certifique-se de que não há barra `/` no final da URL
3. Reinicie o serviço do backend

### Erro 500 no Backend

1. Acesse os **Logs** do backend no Railway
2. Verifique se o `DATABASE_URL` está correto
3. Confirme que o Prisma foi gerado corretamente

### Frontend não conecta ao Backend

1. Verifique se `VITE_API_URL` está correto no frontend
2. Confirme que a URL do backend está acessível
3. Reinicie o serviço do frontend

### Build Failed

1. Verifique os logs de build no Railway
2. Certifique-se de que todas as dependências estão no `package.json`
3. Confirme que o Root Directory está correto

---

## 📝 Checklist de Deploy

- [ ] Backend deployado no Railway
- [ ] Variáveis de ambiente configuradas no backend
- [ ] URL do backend copiada
- [ ] Frontend deployado no Railway
- [ ] VITE_API_URL configurada com URL do backend
- [ ] FRONTEND_URL adicionada no backend
- [ ] Backend testado (rota /)
- [ ] Frontend testado (página de login)
- [ ] Login funcionando corretamente
- [ ] Dashboard carregando dados

---

## 🔄 Atualizações Futuras

Sempre que você fizer push para o GitHub:
1. Railway detectará automaticamente as mudanças
2. Fará o build e deploy automaticamente
3. Seus serviços serão atualizados

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no painel do Railway
2. Confirme todas as variáveis de ambiente
3. Teste as URLs individualmente

---

## 🎉 Parabéns!

Seu sistema AlugueFlow está no ar! 🚀

Acesse o frontend e comece a usar o sistema de gestão de aluguéis.
