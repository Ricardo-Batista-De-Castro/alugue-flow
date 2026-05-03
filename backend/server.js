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

// Configuração de CORS - IMPORTANTE: deve vir ANTES de outros middlewares
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200,
  maxAge: 86400
}));

// Handler explícito para preflight requests
app.options('*', cors());

// Middleware adicional para garantir headers CORS em todas as respostas
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
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
