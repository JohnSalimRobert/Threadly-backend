// src/types/express/index.d.ts
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string } | JwtPayload;
    }
  }
}

export {}; // 👈 must export something to make this a module
