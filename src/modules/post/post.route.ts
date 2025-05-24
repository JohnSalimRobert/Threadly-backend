import * as postController from './post.controller';
import { authenticate } from '../../middleware/authenticate';
import { Request, Response, NextFunction, Router } from 'express';

const router = Router();

router.post('/create', postController.createPost);
router.get('/list', postController.getPosts);


export default router;
