import { Request, Response } from 'express';
import { z } from 'zod';
import Stripe from 'stripe';
import prisma from '../utils/prisma.js';
import logger from '../utils/logger.js';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_key', {
  apiVersion: '2023-10-16'
});

// Define coin packages
const coinPackages = [
  { id: '1', name: 'Starter', amount: 100, price: 4.99, currency: 'USD' },
  { id: '2', name: 'Popular', amount: 500, price: 19.99, currency: 'USD' },
  { id: '3', name: 'Premium', amount: 1000, price: 34.99, currency: 'USD' }
];

// Get user's coin balance
export const getBalance = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated' 
      });
    }
    
    // Get user's coin balance, create if doesn't exist
    let coins = await prisma.coin.findUnique({
      where: { userId }
    });
    
    // If user doesn't have a coin record, create one
    if (!coins) {
      coins = await prisma.coin.create({
        data: {
          userId,
          balance: 0
        }
      });
    }
    
    return res.status(200).json({
      success: true,
      balance: coins.balance
    });
  } catch (error) {
    logger.error(`Error fetching coin balance for user ${req.user?.id}:`, error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch coin balance' 
    });
  }
};

// Get available coin packages
export const getPackages = async (req: Request, res: Response) => {
  try {
    return res.status(200).json(coinPackages);
  } catch (error) {
    logger.error('Error fetching coin packages:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch coin packages' 
    });
  }
};

// Get user's transaction history
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated' 
      });
    }
    
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    
    return res.status(200).json(transactions);
  } catch (error) {
    logger.error(`Error fetching transactions for user ${req.user?.id}:`, error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch transactions' 
    });
  }
};

// Purchase coins schema
const purchaseSchema = z.object({
  packageId: z.string(),
  paymentMethod: z.enum(['stripe', 'iyzico']),
  paymentDetails: z.any()
});

// Purchase coins
export const purchaseCoins = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated' 
      });
    }
    
    // Validate request body
    const validatedData = purchaseSchema.parse(req.body);
    
    // Find package
    const coinPackage = coinPackages.find(pkg => pkg.id === validatedData.packageId);
    
    if (!coinPackage) {
      return res.status(404).json({ 
        success: false, 
        message: 'Coin package not found' 
      });
    }
    
    // Process payment based on provider
    let paymentSuccessful = false;
    
    if (validatedData.paymentMethod === 'stripe') {
      // In a production app, we would process the payment with Stripe API
      // For this demo, we'll mock the payment process
      paymentSuccessful = true;
    } else if (validatedData.paymentMethod === 'iyzico') {
      // In a production app, we would process the payment with Iyzico API
      // For this demo, we'll mock the payment process
      paymentSuccessful = true;
    }
    
    if (!paymentSuccessful) {
      return res.status(400).json({ 
        success: false, 
        message: 'Payment failed' 
      });
    }
    
    // Begin transaction to update coins and create transaction record
    await prisma.$transaction(async (prisma) => {
      // Get user's current coins or create if doesn't exist
      let userCoins = await prisma.coin.findUnique({
        where: { userId }
      });
      
      if (userCoins) {
        // Update existing coin record
        await prisma.coin.update({
          where: { userId },
          data: {
            balance: userCoins.balance + coinPackage.amount
          }
        });
      } else {
        // Create new coin record
        await prisma.coin.create({
          data: {
            userId,
            balance: coinPackage.amount
          }
        });
      }
      
      // Create transaction record
      await prisma.transaction.create({
        data: {
          userId,
          amount: coinPackage.amount,
          type: 'purchase',
          provider: validatedData.paymentMethod,
          description: `Purchased ${coinPackage.amount} coins - ${coinPackage.name} package`
        }
      });
    });
    
    logger.info(`User ${userId} purchased ${coinPackage.amount} coins for ${coinPackage.price} ${coinPackage.currency}`);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Coins purchased successfully' 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }
    
    logger.error(`Error purchasing coins for user ${req.user?.id}:`, error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to purchase coins' 
    });
  }
};

// Use coins schema
const useCoinsSchema = z.object({
  amount: z.number().positive(),
  description: z.string()
});

// Use coins
export const useCoins = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated' 
      });
    }
    
    // Validate request body
    const validatedData = useCoinsSchema.parse(req.body);
    
    // Get user's coins
    const userCoins = await prisma.coin.findUnique({
      where: { userId }
    });
    
    // Check if user has enough coins
    if (!userCoins || userCoins.balance < validatedData.amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient coins' 
      });
    }
    
    // Update user's coins and create transaction record
    await prisma.$transaction(async (prisma) => {
      // Update coin balance
      await prisma.coin.update({
        where: { userId },
        data: {
          balance: userCoins.balance - validatedData.amount
        }
      });
      
      // Create transaction record
      await prisma.transaction.create({
        data: {
          userId,
          amount: validatedData.amount,
          type: 'usage',
          provider: 'system',
          description: validatedData.description
        }
      });
    });
    
    logger.info(`User ${userId} used ${validatedData.amount} coins for: ${validatedData.description}`);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Coins used successfully' 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }
    
    logger.error(`Error using coins for user ${req.user?.id}:`, error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to use coins' 
    });
  }
};

// Add coins schema (admin only)
const addCoinsSchema = z.object({
  userId: z.string(),
  amount: z.number().positive()
});

// Add coins (admin only)
export const addCoins = async (req: Request, res: Response) => {
  try {
    // Ensure user is admin
    if (!req.user?.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }
    
    // Validate request body
    const validatedData = addCoinsSchema.parse(req.body);
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId }
    });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Get user's coins or create if doesn't exist
    let userCoins = await prisma.coin.findUnique({
      where: { userId: validatedData.userId }
    });
    
    // Begin transaction to update coins and create transaction record
    await prisma.$transaction(async (prisma) => {
      if (userCoins) {
        // Update existing coin record
        await prisma.coin.update({
          where: { userId: validatedData.userId },
          data: {
            balance: userCoins.balance + validatedData.amount
          }
        });
      } else {
        // Create new coin record
        await prisma.coin.create({
          data: {
            userId: validatedData.userId,
            balance: validatedData.amount
          }
        });
      }
      
      // Create transaction record
      await prisma.transaction.create({
        data: {
          userId: validatedData.userId,
          amount: validatedData.amount,
          type: 'purchase',
          provider: 'admin',
          description: `Admin added ${validatedData.amount} coins`
        }
      });
    });
    
    logger.info(`Admin added ${validatedData.amount} coins to user ${validatedData.userId}`);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Coins added successfully' 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }
    
    logger.error(`Error adding coins by admin:`, error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to add coins' 
    });
  }
};