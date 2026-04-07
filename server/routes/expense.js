import express from 'express';
import {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
  getMonthlySummary 
} from '../controllers/expenseController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ➕ Add expense
router.post('/', protect, addExpense);

// 📥 Get all expenses
router.get('/', protect, getExpenses);

// ✏️ Update expense
router.put('/:id', protect, updateExpense);

// ❌ Delete expense
router.delete('/:id', protect, deleteExpense);

router.get('/summary/monthly', protect, getMonthlySummary);

export default router;