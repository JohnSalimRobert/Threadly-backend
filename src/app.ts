import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
//routes
import authRoutes from './modules/auth/auth.route';
import postRoutes from './modules/post/post.route';
import userRoutes from './modules/user/user.route';
import { errorHandler } from './middleware/errorHandler';
import { authenticate } from './middleware/authenticate';
import { initSocket } from './lib/socket';

const app = express();
const server = createServer(app);
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173', // or your frontend URL,
      credentials: true,
      methods: ['GET', 'POST']
    },
  });
  initSocket(io);

app.use(morgan('dev'));

app.use('/api/v1/auth', authRoutes)

app.use('/api/v1/post', authenticate ,postRoutes)
app.use('/api/v1/user', authenticate ,userRoutes)

app.use(errorHandler);

export default app;
export { server }; 