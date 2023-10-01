import {Router} from 'express';
import { getUserInfo, signIn, signUp } from '../controllers/users.controllers.js';
import { validateSchema } from '../middlewares/validateSchemas.js';
import { userSchema } from '../schemas/users.schemas.js';

const userRouter = Router();

userRouter.post('/signup', validateSchema(userSchema), signUp);
userRouter.post('/signin', signIn);
userRouter.get('/users/me', getUserInfo);

export default userRouter;