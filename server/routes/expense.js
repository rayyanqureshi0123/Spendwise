import express from 'express';
import {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
  getMonthlySummary,
  getYearlySummary,
  getCategorySummary
  
} from '../controllers/expenseController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/', protect, addExpense);


router.get('/', protect, getExpenses);

router.put('/:id', protect, updateExpense);


router.delete('/:id', protect, deleteExpense);

router.get('/summary/monthly', protect, getMonthlySummary);

router.get('/summary/yearly', protect, getYearlySummary);

router.get('/summary/category', protect, getCategorySummary);

export default router;