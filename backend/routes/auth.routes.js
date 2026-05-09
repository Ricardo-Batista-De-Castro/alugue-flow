import express from 'express';
import { register, login, loginProprietario, loginLocatario, me } from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Registro (apenas proprietários)
router.post('/register', register);

// Login unificado (detecta automaticamente o tipo)
router.post('/login', login);

// Login separado por tipo de usuário (mantido para compatibilidade)
router.post('/login/proprietario', loginProprietario);
router.post('/login/locatario', loginLocatario);

// Perfil do usuário autenticado
router.get('/me', authenticate, me);

export default router;
