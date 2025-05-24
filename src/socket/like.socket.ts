// sockets/like.socket.ts
import { Server } from "socket.io";
import { likeComment, likePost } from "../modules/post/post.service";
import { authSocket } from "./type";




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

export const likeCommentSocketHandler = (io: Server, socket: authSocket) => {
  socket.on("like:comment", async ({ commentId }) => {
    console.log("like:comment event received", { commentId });
    try {
      const userId = socket.data.user.id; // <- Get from middleware

      // Assuming you have a likeComment function similar to likePost
      const result = await likeComment({ commentId, userId });

      io.emit("comment:liked", result);

    } catch (err) {
      socket.emit("error", {
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  });
}
