import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

// Interface to extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: string;
        username?: string;
        isAdmin?: boolean;
      };
    }
  }
}

// Middleware to authenticate user via JWT
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication token required' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as jwt.JwtPayload;
    
    // Set user info on request object
    req.user = {
      id: decoded.id,
      username: decoded.username,
      isAdmin: decoded.isAdmin || false
    };
    
    next();
  } catch (error) {
    logger.warn('Invalid authentication token:', error);
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

// Middleware to ensure user is an admin
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
  
  next();
};

// Middleware to authenticate user via Socket.IO
export const authenticateSocket = (socketId: string): string | null => {
  // In production, you'd verify with a real database
  // For simplicity, we'll just return a mock user ID
  return socketId ? `user-${socketId}` : null;
};