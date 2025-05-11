import express from 'express';
import { getBalance, getPackages, getTransactions, purchaseCoins, useCoins, addCoins } from '../controllers/coinController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user's coin balance
router.get('/balance', authenticateToken, getBalance);

// Get available coin packages
router.get('/packages', getPackages);

// Get user's transaction history
router.get('/transactions', authenticateToken, getTransactions);

// Purchase coins
router.post('/purchase', authenticateToken, purchaseCoins);

// Use coins
router.post('/use', authenticateToken, useCoins);

// Add coins (admin only)
router.post('/admin/add', authenticateToken, requireAdmin, addCoins);

export default router;