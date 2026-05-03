# 📋 Instruções de Instalação e Execução

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 16 ou superior)
- **PostgreSQL** (versão 12 ou superior)
- **npm** ou **yarn**

## 🗄️ Configuração do Banco de Dados

### 1. Criar o Banco de Dados

Acesse o PostgreSQL e crie o banco de dados:

```sql
CREATE DATABASE alugueflow;
```

### 2. Criar Usuário (Opcional)

Se desejar criar um usuário específico:

```sql
CREATE USER alugueflow_user WITH PASSWORD 'sua_senha_aqui';
GRANT ALL PRIVILEGES ON DATABASE alugueflow TO alugueflow_user;
```

## 🔧 Configuração do Backend

### 1. Navegar para a pasta do backend

```bash
cd backend
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
copy .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/alugueflow"
JWT_SECRET="sua_chave_secreta_muito_segura_aqui"
PORT=3000
```

**Importante:** 
- Substitua `usuario` e `senha` pelas credenciais do PostgreSQL
- Gere uma chave JWT segura (pode usar um gerador online ou executar: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

### 4. Executar as migrações do Prisma

```bash
npx prisma migrate dev
```

Este comando irá:
- Criar todas as tabelas no banco de dados
- Gerar o Prisma Client

### 5. (Opcional) Visualizar o banco de dados

Para abrir o Prisma Studio e visualizar os dados:

```bash
npx prisma studio
```

## 🎨 Configuração do Frontend

### 1. Abrir um novo terminal e navegar para a pasta do frontend

```bash
cd frontend
```

### 2. Instalar as dependências

```bash
npm install
```

## 🚀 Executando a Aplicação

### 1. Iniciar o Backend

Em um terminal, na pasta `backend`:

```bash
npm run dev
```

O servidor backend estará rodando em: `http://localhost:3000`

### 2. Iniciar o Frontend

Em outro terminal, na pasta `frontend`:

```bash
npm run dev
```

O frontend estará rodando em: `http://localhost:5173`

## 👤 Primeiro Acesso

1. Acesse `http://localhost:5173` no navegador
2. Clique em "Cadastre-se"
3. Preencha os dados:
   - **Nome**: Seu nome
   - **Email**: seu@email.com
   - **Senha**: sua senha segura
   - **Telefone**: (11) 99999-9999
   - **Tipo**: Selecione "Proprietário" para ter acesso completo ao sistema
4. Faça login com as credenciais criadas

## 📁 Estrutura de Funcionalidades

### Para Proprietários:

1. **Dashboard**: Visualize estatísticas gerais, próximos vencimentos e contratos ativos
2. **Imóveis**: Cadastre e gerencie seus imóveis
3. **Inquilinos**: Cadastre e gerencie inquilinos
4. **Contratos**: Crie e gerencie contratos de aluguel

### Para Inquilinos:

1. **Dashboard**: Visualize as informações do seu contrato e imóvel alugado

## 🔍 Testando o Sistema

### Fluxo completo de teste:

1. **Cadastrar um imóvel**:
   - Acesse "Imóveis"
   - Clique em "Novo Imóvel"
   - Preencha todos os dados
   - Salve

2. **Cadastrar um inquilino**:
   - Acesse "Inquilinos"
   - Clique em "Novo Inquilino"
   - Preencha todos os dados
   - Salve

3. **Criar um contrato**:
   - Acesse "Contratos"
   - Clique em "Novo Contrato"
   - Selecione o imóvel e inquilino cadastrados
   - Preencha as datas e valores
   - Salve

4. **Verificar o Dashboard**:
   - Volte ao Dashboard
   - Veja as estatísticas atualizadas

## 🛠️ Comandos Úteis

### Backend

```bash
# Executar em modo desenvolvimento
npm run dev

# Resetar banco de dados
npx prisma migrate reset

# Visualizar banco de dados
npx prisma studio

# Gerar Prisma Client
npx prisma generate
```

### Frontend

```bash
# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview
```

## ⚠️ Solução de Problemas

### Erro de conexão com o banco de dados

- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`
- Teste a conexão: `npx prisma db pull`

### Porta já em uso

Se a porta 3000 ou 5173 já estiver em uso:

- Backend: Altere a porta no arquivo `.env`
- Frontend: Altere a porta no `vite.config.js`

### Erro de CORS

- Certifique-se de que o backend está rodando em `http://localhost:3000`
- Verifique se a configuração do proxy no `vite.config.js` está correta

### Erro de autenticação

- Verifique se o `JWT_SECRET` está configurado no `.env`
- Limpe o localStorage do navegador: `localStorage.clear()`

## 📚 Tecnologias Utilizadas

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT para autenticação
- bcryptjs para hash de senhas

### Frontend
- React
- Vite
- React Router
- Axios
- Tailwind CSS

## 🔐 Segurança

- Senhas são criptografadas com bcrypt
- Autenticação JWT com tokens
- Validação de dados no backend
- Middleware de autenticação protege rotas privadas

## 📝 Notas Importantes

1. **Ambiente de Desenvolvimento**: Este setup é para desenvolvimento. Para produção, considere:
   - Usar variáveis de ambiente seguras
   - Configurar HTTPS
   - Adicionar rate limiting
   - Implementar logs
   - Configurar backup do banco de dados

2. **Dados Sensíveis**: Nunca commite o arquivo `.env` para o repositório

3. **Backups**: Configure backups regulares do banco de dados PostgreSQL

## 🆘 Suporte

Para problemas ou dúvidas:
1. Verifique se todos os pré-requisitos estão instalados
2. Confirme que as variáveis de ambiente estão corretas
3. Verifique os logs do terminal para mensagens de erro
4. Certifique-se de que o banco de dados está rodando

---

✨ Sistema desenvolvido para gestão de aluguéis residenciais
