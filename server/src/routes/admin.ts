import express from 'express';
import { getDashboardData, getAllMatches, getAllTransactions } from '../controllers/adminController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get dashboard data
router.get('/dashboard', authenticateToken, requireAdmin, getDashboardData);

// Get all matches
router.get('/matches', authenticateToken, requireAdmin, getAllMatches);

// Get all transactions
router.get('/transactions', authenticateToken, requireAdmin, getAllTransactions);

export default router;