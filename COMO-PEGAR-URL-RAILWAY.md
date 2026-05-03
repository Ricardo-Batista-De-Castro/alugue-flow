# 🔗 Como Pegar a URL Correta do Backend no Railway

## ❌ URL ERRADA (Painel do Railway)
```
https://railway.com/project/bec9944a-296e-4326-b569-a1a516ed0e0d?environmentId=...
```
**Isso é o dashboard/painel do Railway, NÃO é a URL do seu backend!**

---

## ✅ Como Pegar a URL CORRETA

### Passo 1: Acessar o Dashboard do Railway
Você já está lá! Use a URL que você mencionou para acessar o projeto.

### Passo 2: Clicar no Serviço Backend
No painel do Railway, você verá um card/box com o nome do seu serviço backend.
**Clique nele**.

### Passo 3: Procurar por "Deployment" ou "Settings"
Dentro do serviço, procure pela seção **"Settings"** ou **"Deployments"**.

### Passo 4: Encontrar a URL Pública
Você vai ver algo como:

**Public Domain** ou **Domains**:
```
https://seu-projeto-production.up.railway.app
```

OU

```
https://web-production-xxxx.up.railway.app
```

---

## 🎯 A URL Correta Será Algo Assim:

```
https://[nome-do-projeto]-production.up.railway.app
```

ou

```
https://web-production-[hash].up.railway.app
```

**Exemplos reais:**
- `https://alugueflow-backend-production.up.railway.app`
- `https://web-production-a1b2c3.up.railway.app`
- `https://backend-production-4d5e6f.up.railway.app`

---

## ✅ Como Testar se a URL Está Correta

### Método 1: Acessar no Navegador
Cole a URL no navegador. Você deve ver:

```json
{
  "message": "API AlugueFlow - Sistema de Gestão de Aluguéis"
}
```

### Método 2: Verificar se Termina com Railway
A URL correta **SEMPRE** termina com:
- `.up.railway.app`
- `.railway.app`

### Método 3: Não Contém "railway.com/project"
Se a URL tem `railway.com/project/`, **NÃO é a URL correta**!

---

## 🔍 Onde Encontrar no Railway (Visual)

```
Dashboard do Railway
│
├─ [Seu Projeto]
│  │
│  ├─ 📦 backend (← Clique aqui!)
│  │  │
│  │  ├─ Settings
│  │  │  └─ Domains/Public Domain (← URL está aqui!)
│  │  │     └─ https://web-production-xxxx.up.railway.app
│  │  │
│  │  └─ Variables
│  │     └─ DATABASE_URL, JWT_SECRET, etc.
│
└─ ...
```

---

## 📝 Depois de Pegar a URL Correta

Use essa URL em **DOIS lugares**:

### 1. Na Vercel (Frontend)
**Variável de Ambiente:**
- **Name**: `VITE_API_URL`
- **Value**: `https://sua-url-correta.up.railway.app`

### 2. Para Testar
Cole no navegador e veja se retorna o JSON da API.

---

## ⚠️ IMPORTANTE

- ✅ URL termina com `.up.railway.app` ou `.railway.app`
- ✅ URL retorna JSON quando acessada
- ✅ **NÃO** adicione barra `/` no final
- ❌ **NÃO** use a URL do painel (`railway.com/project/...`)
- ❌ **NÃO** use URL local (`localhost`)

---

## 🎯 Exemplo Completo

### URL ERRADA:
```
❌ https://railway.com/project/bec9944a-296e-4326-b569...
❌ http://localhost:3000
❌ https://alugueflow.up.railway.app/
```
(última tem barra no final - também errado!)

### URL CORRETA:
```
✅ https://alugueflow-production.up.railway.app
✅ https://web-production-a1b2c3.up.railway.app
✅ https://backend-production-4d5e6f.up.railway.app
```

---

## 🚀 Próximos Passos

1. [ ] Acessar o serviço backend no Railway
2. [ ] Encontrar a seção "Settings" ou "Domains"
3. [ ] Copiar a URL pública (`.up.railway.app`)
4. [ ] Testar no navegador (deve retornar JSON)
5. [ ] Usar essa URL na variável `VITE_API_URL` da Vercel
6. [ ] Fazer deploy na Vercel
7. [ ] Pegar URL da Vercel
8. [ ] Adicionar `FRONTEND_URL` no Railway

---

## ❓ Ainda com Dúvida?

A URL correta do backend:
- ✅ É gerada automaticamente pelo Railway
- ✅ É diferente da URL do dashboard
- ✅ Termina com `.up.railway.app`
- ✅ Retorna JSON quando acessada
- ✅ É a que você usa para fazer requisições API

**Procure por "Public Domain" ou "Domains" dentro do serviço backend no Railway!** 🎯
