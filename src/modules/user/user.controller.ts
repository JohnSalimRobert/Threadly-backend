import * as userService from './user.service';
import { JwtPayload } from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError';


interface AuthRequest extends Request {
  user?: { id: string } | JwtPayload;
}
export const fetchUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'AUTHENTICATION_ERROR');
    }
    const userId = req.user.id;
    console.log('Fetching user with ID:', userId);

    const result = await userService.getUserProfile(userId);

    if (result.error) {
      throw new AppError(result.error, result.statusCode, 'USER_NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    next(error);
  }
};

export const fetchUsersLikedOnPost = async (req: any, res: any, next: any) => {
    try {
        const { postId } = req.body;
        const users = await userService.usersLikedOnPost(postId);
    
        if (!users) {
        return res.status(404).json({
            success: false,
            message: 'No users found who liked this post',
        });
        }
    
        res.status(200).json({
        success: true,
        message: 'Users fetched successfully',
        data: users,
        });
    } catch (error) {
        next(error);
    }
}