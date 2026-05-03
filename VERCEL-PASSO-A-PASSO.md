# 🎯 Vercel - Guia Visual Passo a Passo

## ⚠️ IMPORTANTE: Deploy APENAS do Frontend

O backend já está no Railway! Na Vercel, vamos fazer deploy **APENAS do FRONTEND**.

---

## 📸 O que você está vendo

A Vercel detectou que seu repositório tem duas pastas:
- 📁 `backend` (Express) 
- 📁 `frontend` (Vite)

E está oferecendo fazer deploy de ambos. **MAS NÃO FAÇA ISSO!**

---

## ✅ Como Proceder

### Opção 1: Desmarcar o Backend (RECOMENDADO)

Na tela que você está vendo:

1. **Clique no checkbox do `backend`** para desmarcá-lo
2. Deixe **APENAS o `frontend` marcado**
3. Continue o processo

### Opção 2: Ignorar a Sugestão de Multiple Services

Se a Vercel insistir em multiple services:

1. **Ignore o aviso** sobre `vercel.json required`
2. Role para baixo até **"Root Directory"**
3. Configure **Root Directory** como: `frontend`
4. Isso fará a Vercel ignorar a pasta backend completamente

---

## 🔧 Configuração Correta

Após escolher o frontend, configure:

### 1. Root Directory
```
frontend
```
⚠️ **CRÍTICO**: Isso diz à Vercel para olhar apenas dentro da pasta frontend!

### 2. Framework Preset
A Vercel deve detectar automaticamente: **Vite**

### 3. Build Settings
Devem aparecer automaticamente:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. Environment Variables
Adicione ANTES de fazer deploy:

**Name**: `VITE_API_URL`  
**Value**: `https://sua-url-do-backend.up.railway.app`

(Pegue a URL do backend no Railway)

⚠️ **NÃO** adicione barra `/` no final!

---

## 🚀 Depois de Configurar

1. Clique em **"Deploy"**
2. Aguarde o build (1-3 minutos)
3. Você receberá uma URL: `https://seu-projeto.vercel.app`

---

## 🔄 Atualizar CORS no Backend

Após receber a URL da Vercel:

1. Vá no **Railway**
2. Abra o serviço do **Backend**
3. Vá em **Variables**
4. Adicione ou atualize:

**Name**: `FRONTEND_URL`  
**Value**: `https://seu-projeto.vercel.app`

(Use a URL que a Vercel gerou, **SEM** barra no final)

---

## 🎯 Resultado Final

```
┌─────────────┐
│  SUPABASE   │ ← Banco de Dados
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   RAILWAY   │ ← Backend (Express/Node.js)
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   VERCEL    │ ← Frontend (React/Vite) ← APENAS ISSO!
└─────────────┘
```

---

## ❌ O que NÃO fazer

- ❌ **NÃO** faça deploy do backend na Vercel
- ❌ **NÃO** marque múltiplos serviços
- ❌ **NÃO** deixe Root Directory vazio
- ❌ **NÃO** esqueça de adicionar `VITE_API_URL`

---

## ✅ Checklist Rápido

- [ ] Desmarquei o backend (ou configurei Root Directory como `frontend`)
- [ ] Root Directory está como `frontend`
- [ ] Framework detectado: Vite
- [ ] `VITE_API_URL` adicionada com URL do Railway
- [ ] URL **SEM** barra no final
- [ ] Cliquei em Deploy
- [ ] Deploy concluído com sucesso
- [ ] Copiei a URL gerada pela Vercel
- [ ] Adicionei `FRONTEND_URL` no backend (Railway)

---

## 🎉 Pronto!

Após seguir esses passos, seu frontend estará no ar na Vercel, conectado ao backend no Railway! 🚀
