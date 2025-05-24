import { createComment } from "../modules/post/post.service";
import { authSocket } from "./type";
import { AppError } from "../utils/AppError";

export const createCommentSocketHandler = (io: any, socket: authSocket) => {
    socket.on("create:comment", async ({ postId, content, parentId }) => {
        try {
            const userId = socket.data.user.id; // <- Get from middleware

            // Assuming you have a createComment function that handles comment creation
            const result = await createComment({ postId, content, userId, parentId });
            if (result.error) {
                throw new AppError(result.error, result.statusCode, result.code);
            }
            // Emit the new comment to all connected clients
            io.emit("comment:created", result);

        } catch (err) {
            socket.emit("error", {
                message: err instanceof Error ? err.message : "Unknown error",
            });
        }
    })
}