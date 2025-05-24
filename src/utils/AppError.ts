export class AppError extends Error {
    statusCode: number;
    code: string;
  
    constructor(message: string, statusCode = 500, code = 'SERVER_ERROR') {
      super(message);
      this.statusCode = statusCode;
      this.code = code;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  