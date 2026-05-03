import express from 'express';
import {
  getContratos,
  getContratoById,
  createContrato,
  updateContrato,
  deleteContrato,
} from '../controllers/contratoController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticate, getContratos);
router.get('/:id', authenticate, getContratoById);
router.post('/', authenticate, authorize(['proprietario']), createContrato);
router.put('/:id', authenticate, authorize(['proprietario']), updateContrato);
router.delete('/:id', authenticate, authorize(['proprietario']), deleteContrato);

export default router;
