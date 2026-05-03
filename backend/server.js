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

// Configuração de CORS para produção e desenvolvimento
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL
    ].filter(Boolean); // Remove undefined values
    
    // Permitir requisições sem origin (como mobile apps ou curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || !process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// Middlewares
app.use(cors(corsOptions));
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
