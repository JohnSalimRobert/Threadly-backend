import * as userController from './user.controller';
import { Request, Response, NextFunction, Router } from 'express';

const router = Router();

router.get('/profile', (req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error: Allow custom AuthRequest type if needed
  return userController.fetchUser(req, res, next);
});
router.post('/liked', userController.fetchUsersLikedOnPost);


export default router;
