import { Request, Response} from 'express';
import * as authService from './auth.service';

export const signup = async (req: Request, res: Response) => {
    const user = authService.signup(req.body);
    res.status(201).json(user);
}

export const login = async (req: Request, res: Response) => {
    const token = await authService.login(req.body);
    res.status(200).json({ token });
}