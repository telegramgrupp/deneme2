import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import logger from '../utils/logger.js';

// Get all users (for admin)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        coins: true
      }
    });
    
    // Map to desired format
    const formattedUsers = users.map(user => ({
      id: user.id,
      createdAt: user.createdAt,
      lastSeen: user.lastSeen,
      isBanned: user.isBanned,
      coins: user.coins?.balance || 0
    }));
    
    return res.status(200).json(formattedUsers);
  } catch (error) {
    logger.error('Error fetching all users:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch users' 
    });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        coins: true,
        matches: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    logger.error(`Error fetching user ${req.params.id}:`, error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch user' 
    });
  }
};

// Ban user
export const banUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id }
    });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    await prisma.user.update({
      where: { id },
      data: { isBanned: true }
    });
    
    logger.info(`User ${id} has been banned`);
    
    return res.status(200).json({ 
      success: true, 
      message: 'User banned successfully' 
    });
  } catch (error) {
    logger.error(`Error banning user ${req.params.id}:`, error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to ban user' 
    });
  }
};

// Unban user
export const unbanUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id }
    });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    await prisma.user.update({
      where: { id },
      data: { isBanned: false }
    });
    
    logger.info(`User ${id} has been unbanned`);
    
    return res.status(200).json({ 
      success: true, 
      message: 'User unbanned successfully' 
    });
  } catch (error) {
    logger.error(`Error unbanning user ${req.params.id}:`, error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to unban user' 
    });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id }
    });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Delete all related records
    await prisma.$transaction([
      prisma.transaction.deleteMany({
        where: { userId: id }
      }),
      prisma.coin.delete({
        where: { userId: id }
      }).catch(() => {}), // Ignore if doesn't exist
      prisma.match.deleteMany({
        where: {
          OR: [
            { userId: id },
            { matchedWith: id }
          ]
        }
      }),
      prisma.user.delete({
        where: { id }
      })
    ]);
    
    logger.info(`User ${id} has been deleted`);
    
    return res.status(200).json({ 
      success: true, 
      message: 'User deleted successfully' 
    });
  } catch (error) {
    logger.error(`Error deleting user ${req.params.id}:`, error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to delete user' 
    });
  }
};