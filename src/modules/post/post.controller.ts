import { NextFunction, Request, Response } from 'express';
import * as postService from './post.service';
import { AppError } from '../../utils/AppError';
import type { JwtPayload } from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: { id: string } | JwtPayload;
}
export const createPost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { caption, images } = req.body;
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'AUTHENTICATION_ERROR');
    }
    const user = req.user;  // Assuming user is added to the request object via authentication middleware
    const author = user.id; // Extracting author ID from the user object
    const post = await postService.createPost({ author, caption, images });

    // If post creation fails, throw an error
    if (post.error) {
      throw new AppError(post.error, post.statusCode, 'POST_CREATION_ERROR');
    }

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  } catch (error) {
    next(error);
  }
};


export const getPosts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const cursor = req.query.cursor as string | undefined;
    const user = req.user
    const userId = user?.id
    const { data, nextCursor, hasMore } = await postService.fetchAllPosts({ limit, cursor, userId });

    res.status(200).json({
      success: true,
      message: 'Posts fetched successfully',
      data,
      nextCursor,
      hasMore
    });
  } catch (error) {
    next(error);
  }
};
export const getPostComments = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.body;

    const comments = await postService.getPostComments(postId);

    // If the post is not found, throw an error
    if (!comments) {
      throw new AppError('Post not found', 404, 'POST_NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      message: 'Comments fetched successfully',
      data: comments
    });
  } catch (error) {
    next(error);
  }
}

export const getCommentReplies = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { commentId } = req.body;

    const replies = await postService.getCommentReplies(commentId);

    // If the comment is not found, throw an error
    if (!replies) {
      throw new AppError('Comment not found', 404, 'COMMENT_NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      message: 'Replies fetched successfully',
      data: replies
    });
  } catch (error) {
    next(error);
  }
}