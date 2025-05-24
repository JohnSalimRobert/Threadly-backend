import userModel from "../../models/user.model";
import postModel from "../../models/post.model";
import { AppError } from "../../utils/AppError";
import commentModel from "../../models/comment.model";


export const usersLikedOnPost = async (postId: string) => {
    try {
     const post = await postModel.findById(postId).populate('likes', 'username profilePicture').lean();
        if (!post) {
            throw new AppError('Post not found', 404, 'POST_NOT_FOUND');
        }

        // Return the users who liked the post
    return post.likes || [];
    } catch (error) {
        throw new AppError('An error occurred while fetching users', 500, 'INTERNAL_SERVER_ERROR');
    }
};


export const getUserProfile = async (userId: string) => {
  // Fetch the user
  const user = await userModel.findById(userId).select('-password').lean();
  if (!user) {
    return { error: 'User not found', statusCode: 404 };
  }

  // Fetch user's post count
  const postCount = await postModel.countDocuments({ author: userId });

  // Fetch user's comment count
  const commentCount = await commentModel.countDocuments({ author: userId });

  // Fetch number of posts the user has liked
  const likedPostsCount = await postModel.countDocuments({ likes: userId });

  // Total likes the user received on their posts
  const userPosts = await postModel.find({ author: userId }, 'likes').lean();
  const totalLikesReceived = userPosts.reduce(
    (acc, post) => acc + (post.likes?.length || 0),
    0
  );

  return {
    user,
    stats: {
      postCount,
      commentCount,
      likedPostsCount,
      totalLikesReceived,
    },
  };
};
