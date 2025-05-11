import express from 'express';
import { getAllUsers, getUserById, banUser, unbanUser, deleteUser } from '../controllers/userController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, requireAdmin, getAllUsers);

// Get user by ID
router.get('/:id', authenticateToken, getUserById);

// Ban user (admin only)
router.put('/:id/ban', authenticateToken, requireAdmin, banUser);

// Unban user (admin only)
router.put('/:id/unban', authenticateToken, requireAdmin, unbanUser);

// Delete user (admin only)
router.delete('/:id', authenticateToken, requireAdmin, deleteUser);

export default router;