import express from 'express';
import {
  getImoveis,
  getImovelById,
  createImovel,
  updateImovel,
  deleteImovel,
} from '../controllers/imovelController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticate, getImoveis);
router.get('/:id', authenticate, getImovelById);
router.post('/', authenticate, authorize(['proprietario']), createImovel);
router.put('/:id', authenticate, authorize(['proprietario']), updateImovel);
router.delete('/:id', authenticate, authorize(['proprietario']), deleteImovel);

export default router;
