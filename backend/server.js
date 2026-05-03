import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import imovelRoutes from './routes/imovel.routes.js';
import inquilinoRoutes from './routes/inquilino.routes.js';
import contratoRoutes from './routes/contrato.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware CORS manual - mais controle sobre headers
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Log para debug
  console.log('📡 Request from origin:', origin);
  console.log('🔍 Method:', req.method);
  console.log('🛣️ Path:', req.path);
  
  // Permite todas as origens em produção (simplificado)
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  // Responde imediatamente para OPTIONS
  if (req.method === 'OPTIONS') {
    console.log('✅ Preflight request handled');
    return res.status(204).end();
  }
  
  next();
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/imoveis', imovelRoutes);
app.use('/api/inquilinos', inquilinoRoutes);
app.use('/api/contratos', contratoRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API AlugueFlow - Sistema de Gestão de Aluguéis' });
});

// Tratamento de erro 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Tratamento global de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 API disponível em http://localhost:${PORT}`);
});
