import { NextFunction, Request, Response} from 'express';
import * as authService from './auth.service';
import { AppError } from '../../utils/AppError';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const user = await authService.signup(req.body);
        if(user.error) {
            throw new AppError(user.error, user.statusCode, 'USER_CREATION_ERROR');
        }
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try{

    const response = await authService.login(req.body);
    if(response.error) {
        throw new AppError(response.error, response.statusCode, response.code)
    }
    res.status(200).json({ ...response });
    } catch (error) {
        next(error)
    }
}