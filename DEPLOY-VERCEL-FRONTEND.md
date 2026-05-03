# 🚀 Deploy do Frontend na Vercel - AlugueFlow

Este guia explica como fazer o deploy do frontend do AlugueFlow na Vercel.

## 📋 Pré-requisitos

- ✅ Backend deployado no Railway
- ✅ URL do backend disponível
- ✅ Conta na Vercel criada
- ✅ Repositório no GitHub

## 🎯 Passo a Passo

### 1. Acessar a Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em **"Add New Project"** ou **"Import Project"**

### 2. Importar o Repositório

1. Selecione o repositório do AlugueFlow
2. Clique em **"Import"**

### 3. Configurar o Projeto

#### Root Directory
Configure o **Root Directory** como: `frontend`

⚠️ **MUITO IMPORTANTE**: A Vercel precisa saber que o projeto está na pasta `frontend`

#### Framework Preset
A Vercel deve detectar automaticamente **Vite**

#### Build & Development Settings

Verifique se as configurações estão corretas:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. Configurar Variáveis de Ambiente

Antes de fazer o deploy, adicione a variável de ambiente:

Clique em **"Environment Variables"** e adicione:

**Name**: `VITE_API_URL`  
**Value**: `https://sua-url-do-backend.up.railway.app`

⚠️ **IMPORTANTE:**
- Substitua pela URL real do seu backend no Railway
- **NÃO** adicione barra `/` no final
- Exemplo: `https://alugueflow-backend-production.up.railway.app`

### 5. Deploy

1. Clique em **"Deploy"**
2. Aguarde o build completar (1-3 minutos)
3. Após o deploy, você receberá uma URL da Vercel

### 6. Atualizar CORS no Backend (Railway)

Agora que você tem a URL do frontend na Vercel, precisa adicioná-la no backend:

1. Acesse seu projeto no **Railway**
2. Abra o serviço do **Backend**
3. Vá em **Variables**
4. Adicione ou atualize a variável:

**Name**: `FRONTEND_URL`  
**Value**: `https://sua-url-do-frontend.vercel.app`

⚠️ **IMPORTANTE:**
- Use a URL completa fornecida pela Vercel
- **NÃO** adicione barra `/` no final
- O backend reiniciará automaticamente

---

## ✅ Verificação

### 1. Testar o Frontend
Acesse: `https://sua-url-do-frontend.vercel.app`

Você deve ver a página de login do AlugueFlow.

### 2. Testar Conexão com Backend

1. Abra o Console do navegador (F12)
2. Vá para a aba **Network**
3. Tente fazer login
4. Verifique se as requisições estão indo para o backend correto

### 3. Testar Login Completo

Use as credenciais do Supabase:
- Email: `admin@alugueflow.com` (ou outro que você criou)
- Senha: sua senha

Se tudo estiver correto, você será redirecionado para o dashboard! 🎉

---

## 🐛 Troubleshooting

### Erro de CORS

**Sintoma**: Erro no console: "Access to fetch blocked by CORS policy"

**Solução**:
1. Verifique se `FRONTEND_URL` está configurada no backend (Railway)
2. Confirme que a URL está correta (sem barra no final)
3. Reinicie o serviço do backend no Railway
4. Limpe o cache do navegador (Ctrl + Shift + R)

### Frontend não conecta ao Backend

**Sintoma**: Erro 404 ou Network Error

**Solução**:
1. Verifique se `VITE_API_URL` está configurada na Vercel
2. Confirme que a URL do backend está correta
3. Teste a URL do backend diretamente no navegador
4. Faça um redeploy do frontend na Vercel

### Build Failed na Vercel

**Sintoma**: Deploy falha com erro de build

**Solução**:
1. Verifique os logs de build na Vercel
2. Confirme que o **Root Directory** está como `frontend`
3. Verifique se todas as dependências estão no `package.json`
4. Certifique-se de que o projeto builda localmente (`npm run build`)

### Variável de Ambiente não funciona

**Sintoma**: Frontend usa localhost ao invés da URL do backend

**Solução**:
1. Variáveis de ambiente do Vite precisam começar com `VITE_`
2. Faça um **redeploy** após adicionar variáveis
3. Limpe o cache e faça hard refresh (Ctrl + Shift + R)

---

## 🔄 Atualizações Futuras

### Deploy Automático

A Vercel fará deploy automático sempre que você:
1. Fizer push para a branch principal (main/master)
2. Fazer merge de Pull Request

### Preview Deploys

A Vercel cria deploys de preview para:
- Cada Pull Request
- Cada branch que você criar

Isso permite testar mudanças antes de ir para produção!

---

## 📝 Checklist de Deploy

- [ ] Backend no Railway funcionando
- [ ] URL do backend copiada
- [ ] Projeto importado na Vercel
- [ ] Root Directory configurado como `frontend`
- [ ] VITE_API_URL configurada na Vercel
- [ ] Deploy concluído com sucesso
- [ ] FRONTEND_URL adicionada no backend (Railway)
- [ ] Frontend testado (página de login carrega)
- [ ] Conexão com backend testada (sem erros CORS)
- [ ] Login funcionando corretamente
- [ ] Dashboard carregando dados

---

## 🎨 Domínio Personalizado (Opcional)

Se você quiser usar um domínio próprio:

1. Vá em **Settings** > **Domains** na Vercel
2. Adicione seu domínio
3. Configure os DNS conforme instruções da Vercel
4. Atualize `FRONTEND_URL` no backend com o novo domínio

---

## 📊 Monitoramento

A Vercel oferece:
- **Analytics**: Visualize acessos e performance
- **Logs**: Veja logs em tempo real
- **Speed Insights**: Métricas de velocidade

Acesse pelo painel da Vercel!

---

## 🎉 Parabéns!

Seu AlugueFlow está completamente no ar! 🚀

- ✅ Backend: Railway
- ✅ Frontend: Vercel
- ✅ Banco de Dados: Supabase

Stack completa em produção! 🌟
