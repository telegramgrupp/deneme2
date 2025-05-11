import express from 'express';
import { getUserMatches, getMatchById, getFakeVideos } from '../controllers/matchController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user's match history
router.get('/', authenticateToken, getUserMatches);

// Get match by ID
router.get('/:id', authenticateToken, getMatchById);

// Get all fake videos (admin only)
router.get('/fake/videos', authenticateToken, requireAdmin, getFakeVideos);

export default router;