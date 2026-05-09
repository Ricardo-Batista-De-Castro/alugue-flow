import express from 'express';
import {
  getPessoas,
  getPessoaById,
  createPessoa,
  updatePessoa,
} from '../controllers/pessoaController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize(['proprietario']), getPessoas);
router.get('/:id', authenticate, getPessoaById);
router.post('/', authenticate, authorize(['proprietario']), createPessoa);
router.put('/:id', authenticate, authorize(['proprietario']), updatePessoa);

export default router;
