import {Router} from 'express';
import urlsRouter from './urls.routes.js';
import userRouter from './users.routes.js';

const router = Router();

router.use(urlsRouter);
router.use(userRouter);

export default router;