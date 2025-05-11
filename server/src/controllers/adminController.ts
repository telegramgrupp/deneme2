import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import logger from '../utils/logger.js';

// Get dashboard data
export const getDashboardData = async (req: Request, res: Response) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }
    
    // Get total counts
    const totalUsers = await prisma.user.count();
    const totalMatches = await prisma.match.count();
    
    // Calculate total coins purchased
    const coinPurchases = await prisma.transaction.aggregate({
      where: { type: 'purchase' },
      _sum: { amount: true }
    });
    
    // Count active users (users who logged in within the last 24 hours)
    const activeUsers = await prisma.user.count({
      where: {
        lastSeen: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    });
    
    // Get daily activity for the past week
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    // Format dates as day strings
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Generate chart data
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Start and end of the day
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      // Count matches for the day
      const dayMatches = await prisma.match.count({
        where: {
          startTime: {
            gte: dayStart,
            lte: dayEnd
          }
        }
      });
      
      // Sum coins used for the day
      const dayCoinsUsed = await prisma.transaction.aggregate({
        where: {
          type: 'usage',
          createdAt: {
            gte: dayStart,
            lte: dayEnd
          }
        },
        _sum: { amount: true }
      });
      
      chartData.push({
        name: dayNames[date.getDay()],
        matches: dayMatches,
        coins: dayCoinsUsed._sum.amount || 0
      });
    }
    
    return res.status(200).json({
      stats: {
        totalUsers,
        totalMatches,
        totalCoins: coinPurchases._sum.amount || 0,
        activeUsers
      },
      chartData
    });
  } catch (error) {
    logger.error('Error fetching admin dashboard data:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch dashboard data' 
    });
  }
};

// Get all matches (admin only)
export const getAllMatches = async (req: Request, res: Response) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }
    
    const matches = await prisma.match.findMany({
      orderBy: { startTime: 'desc' }
    });
    
    return res.status(200).json(matches);
  } catch (error) {
    logger.error('Error fetching all matches:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch matches' 
    });
  }
};

// Get all transactions (admin only)
export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }
    
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return res.status(200).json(transactions);
  } catch (error) {
    logger.error('Error fetching all transactions:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch transactions' 
    });
  }
};