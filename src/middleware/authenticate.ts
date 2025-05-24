import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';


// Middleware to check if the user is authenticated
export const authenticate = (req: any, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Get the token from Authorization header

  if (!token) {
     res.status(401).json({ error: 'No token provided', code: 'NO_TOKEN' });
     return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };  // Type the decoded data
    console.log('Decoded token:', decoded);  // Log the decoded token for debugging
    req.user = decoded;  // Attach decoded user data to request object
    next();  // Continue to the next middleware/route handler
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token', code: 'INVALID_TOKEN' });
    return;
  }
};
