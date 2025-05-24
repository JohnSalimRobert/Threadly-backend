import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const code = err instanceof AppError ? err.code : 'SERVER_ERROR';
  const message = err.message || 'Something went wrong';

  res.status(statusCode).json({
    success: false,
    message,
    error: {
      code,
      details: err.details || []
    }
  });
};
