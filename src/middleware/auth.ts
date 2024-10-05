import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load JWT secret key

// Middleware to verify JWT
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Expect "Bearer <token>"

  if (!token) {
    return res.status(403).json({ message: 'Authentication token missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Attach user info to the request (optional)
    req.user = user;
    next();
  });
};
