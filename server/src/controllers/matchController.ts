import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import logger from '../utils/logger.js';

// Get user's match history
export const getUserMatches = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated' 
      });
    }
    
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { userId },
          { matchedWith: userId }
        ]
      },
      orderBy: { startTime: 'desc' }
    });
    
    return res.status(200).json(matches);
  } catch (error) {
    logger.error(`Error fetching match history for user ${req.user?.id}:`, error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch match history' 
    });
  }
};

// Get specific match by ID
export const getMatchById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated' 
      });
    }
    
    const match = await prisma.match.findUnique({
      where: { id }
    });
    
    if (!match) {
      return res.status(404).json({ 
        success: false, 
        message: 'Match not found' 
      });
    }
    
    // Check if user is part of this match
    if (match.userId !== userId && match.matchedWith !== userId && !req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized to access this match' 
      });
    }
    
    return res.status(200).json(match);
  } catch (error) {
    logger.error(`Error fetching match ${req.params.id}:`, error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch match' 
    });
  }
};

// Get all fake videos (admin only)
export const getFakeVideos = async (req: Request, res: Response) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }
    
    const fakeVideos = await prisma.fakeVideo.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return res.status(200).json(fakeVideos);
  } catch (error) {
    logger.error('Error fetching fake videos:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch fake videos' 
    });
  }
};