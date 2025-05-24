import { AppError } from '../../utils/AppError';
import postModel from '../../models/post.model';
import mongoose, { ObjectId } from 'mongoose';
import userModel from '../../models/user.model';
import commentModel from '../../models/comment.model';
import { error } from 'console';

interface CreatePostInput {
  author: string;
  caption: string;
  images: string[];
}

interface FetchPostsInput {
  limit?: number;
  cursor?: string; // ISO date string
  userId?: string
}


export const createPost = async ({ author, caption, images }: CreatePostInput) => {
  try {
    // Validate input fields
    if (!caption || !images || images.length === 0) {
      return {
        error: 'Caption and images are required',
        statusCode: 400
      };
    }

    // Check if the user exists (optional, if you want to check for author validity)
    const authorExists = await userModel.findById(author);
    if (!authorExists) {
      return {
        error: 'Author does not exist',
        statusCode: 404
      };
    }

    // Create a new post
    const post = new postModel({
      author,
      caption,
      images
    });

    // Save post
    await post.save();
    // Return the created post
    return {
      success: true,
      message: 'Post created successfully',
      data: post
    };

  } catch (error) {
    // If something goes wrong, handle the error with an appropriate message
    throw new AppError('Error creating post', 500, 'POST_CREATION_ERROR');
  }
};


export const getPostById = async (postId: mongoose.Schema.Types.ObjectId) => {
  const post = await postModel.findById(postId).populate('author', 'username');
  if (!post) {
    throw new AppError('Post not found', 404, 'POST_NOT_FOUND');
  }
  return post;
};


export const fetchAllPosts = async ({ limit = 10, cursor, userId }: FetchPostsInput) => {
  try {
    const query: any = {};
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) }; // Pagination
    }

    const posts = await postModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('author', 'username profilePicture')
      .lean();

    const postIds = posts.map(p => p._id);

    // Fetch top-level comments
    const comments = await commentModel.find({
      post: { $in: postIds },
      parentComment: null
    })
      .populate('author', 'username profilePicture')
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'username profilePicture' }
      })
      .lean();

    // Group comments by postId
    const commentsByPostId = comments.reduce((acc, comment) => {
      const postId = comment.post.toString();
      if (!acc[postId]) acc[postId] = [];
      acc[postId].push(comment);
      return acc;
    }, {} as Record<string, any[]>);

    // Attach comments to posts
    const enrichedPosts = posts.map(post => ({
      ...post,
      isLikedByUser: post.likes?.some((likeId: any) => likeId.toString() === userId) || false,
      comments: commentsByPostId[post._id.toString()] || []
    }));

    const hasMore = posts.length === limit;
    const nextCursor = hasMore ? posts[posts.length - 1].createdAt.toISOString() : null;

    return {
      success: true,
      data: enrichedPosts,
      nextCursor,
      hasMore
    };
  } catch (error) {
    throw new AppError('Error fetching posts', 500, 'FETCH_POSTS_ERROR');
  }
};

export const likePost = async ({ postId, userId }: { postId: string; userId: string }) => {
  // Validate IDs
  if (!postId || !userId) {
    return { error: "Post ID and User ID are required", statusCode: 400, code: "LIKE_INPUT_ERROR" }
  }

  const post = await postModel.findById(postId).select('-author -comments');
  if (!post) {
    return { error: "Post not found", statusCode: 404, code: "POST_NOT_FOUND" }
  }
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const alreadyLiked = post.likes.includes(userObjectId);
  if (alreadyLiked) {
    // UNLIKE: Remove user ID from likes array
    post.likes = post.likes.filter((id) => !id.equals(userObjectId));
    await post.save();
    return {
      success: true,
      message: 'Post unliked successfully',
      data: {
        ...post.toObject(),
        isLikedByUser: false, // Update the like status
      },
    };
  } else {
    // LIKE: Add user ID to likes array
    post.likes.push(userObjectId);
    await post.save();
    return {
      success: true,
      message: 'Post liked successfully',
      data: {...post.toObject(), isLikedByUser: true}, // Update the like status
    };
  }

};

export const getPostComments = async (postId: string) => {
  if (!postId) {
    throw new AppError('Post ID is required', 400, 'POST_ID_REQUIRED');
  }

  // Fetch top-level comments (no parentComment) for the post,
  // and populate the replies and authors
  const comments = await commentModel.find({ post: postId, parentComment: null })
    .populate('author', 'username avatar') // adjust the fields as needed
    .populate({
      path: 'replies',
      populate: { path: 'author', select: 'username avatar' } // populate reply authors
    })
    .sort({ createdAt: -1 }).lean(); // newest comments first

  return comments;
};

export const getCommentReplies = async (commentId: string) => {
  if(!commentId) {
    throw new AppError('Comment ID is required', 400, 'COMMENT_ID_REQUIRED');
  }

  const comments = await commentModel.find({ parentComment: commentId })
    .populate('author', 'username avatar') // adjust the fields as needed
    .sort({ createdAt: -1 }).lean(); // newest replies first
  return comments;
}