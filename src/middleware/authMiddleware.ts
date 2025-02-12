import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Middleware to check if the request has a valid authorization token
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      data: null,
      errors: [{ field: 'Authorization', message: 'Authorization token is missing.' }],
    });
  }

  // Extract the token from the "Bearer token" format
  const token = authHeader.split(' ')[1]; // 'Bearer <token>'

  if (!token) {
    return res.status(401).json({
      data: null,
      errors: [{ field: 'Authorization', message: 'Token is missing.' }],
    });
  }

  // Verify the token
  jwt.verify(token, process.env.TOKEN_SECRET!, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        data: null,
        errors: [{ field: 'Authorization', message: 'Invalid or expired token.' }],
      });
    }

    // Attach decoded information to request object (e.g., user id)
    req.user = decoded as { id: string; username: string; type: string }; // You can store the decoded user info here for later use

    // Continue to the next middleware or route handler
    next();
  });
};
