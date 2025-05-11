import express from 'express';
import { adminLogin, verifyToken } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin login
router.post('/admin/login', adminLogin);

// Verify token
router.get('/verify', authenticateToken, verifyToken);

export default router;