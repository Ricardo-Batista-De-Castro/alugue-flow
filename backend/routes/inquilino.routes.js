import express from 'express';
import {
  getInquilinos,
  getInquilinoById,
  createInquilino,
  updateInquilino,
  deleteInquilino,
} from '../controllers/inquilinoController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize(['proprietario']), getInquilinos);
router.get('/:id', authenticate, getInquilinoById);
router.post('/', authenticate, authorize(['proprietario']), createInquilino);
router.put('/:id', authenticate, authorize(['proprietario']), updateInquilino);
router.delete('/:id', authenticate, authorize(['proprietario']), deleteInquilino);

export default router;
