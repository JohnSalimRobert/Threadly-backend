import { authenticateSocket } from '../middleware/authenticateSocket';
import { likeSocketHandler } from '../socket/like.socket';
import { Socket } from 'socket.io';

export const initSocket = (io: any) => {
  io.use(authenticateSocket); // <- 🔗 plug in the auth middleware

  io.on('connection', (socket: Socket) => {
    const user = socket.data.user;
    console.log(`User connected: ${user.id || user._id}`);
      
    likeSocketHandler(io, socket);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${user.id || user._id}`);
    });

    // Example event
    socket.on('ping', () => {
      socket.emit('pong');
    });
  });
};
