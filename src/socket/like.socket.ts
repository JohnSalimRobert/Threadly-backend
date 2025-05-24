// sockets/like.socket.ts
import { Server, Socket } from "socket.io";
import { likePost } from "../modules/post/post.service";

export interface authSocket extends Socket {
  data: {
    user:{
      id: string;
    } // or whatever type your userId is
    // Include other properties from your JWT payload as needed
  };
}

export const likeSocketHandler = (io: Server, socket: authSocket) => {
  socket.on("like:post", async ({ postId }) => {
    try {
      const userId = socket.data.user.id; // <- Get from middleware

      const result = await likePost({ postId, userId });

      io.emit("post:liked", result);

    } catch (err) {
      socket.emit("error", {
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  });
};
