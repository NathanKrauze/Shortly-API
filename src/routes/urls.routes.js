import {Router} from 'express';
import { deleteUrl, getRanking, getUrlById, openUrl, postUrl } from '../controllers/urls.controllers.js';
import { validateSchema } from '../middlewares/validateSchemas.js';
import { shortenUrlSchema } from '../schemas/urls.chemas.js';

const urlsRouter = Router();

urlsRouter.post('/urls/shorten', validateSchema(shortenUrlSchema), postUrl);
urlsRouter.get('/urls/:id', getUrlById);
urlsRouter.get('/urls/open/:shortUrl', openUrl);
urlsRouter.delete('/urls/:id', deleteUrl);
urlsRouter.get('/ranking', getRanking);

export default urlsRouter;