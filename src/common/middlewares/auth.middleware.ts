import { Request, Response, NextFunction } from 'express';
import { JwtUtils } from '../utils/jwt.utils';
import createError from 'http-errors';
import { JwtPayload } from '../types/auth.types';


// Extend Express Request to include player
declare global {
  namespace Express {
    interface Request {
      player?: JwtPayload;
    }
  }
}

/**
 * Middleware to verify JWT token from cookies and attach player to request
 */
export const AuthGuard = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      throw createError(401, 'Access token is required');
    }

    // Verify token and attach player to request
    const decoded = JwtUtils.verifyToken(token);
    req.player = decoded;
    
    next();
  } catch (error) {
    next(error);
  }
};