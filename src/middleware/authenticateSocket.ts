import jwt from 'jsonwebtoken';

export const authenticateSocket = (socket: any, next: Function) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication error: Token missing'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    socket.data.user = decoded; // Store decoded user info in socket
    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    return next(new Error('Authentication error: Invalid token'));
  }
};
