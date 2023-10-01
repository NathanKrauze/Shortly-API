import {Router} from 'express';
import { deleteUrl, getRanking, getUrlById, openUrl, postUrl } from '../controllers/urls.controllers.js';

const urlsRouter = Router();

urlsRouter.post('/urls/shorten', postUrl);
urlsRouter.get('/urls/:id', getUrlById);
urlsRouter.get('/urls/open/:shortUrl', openUrl);
urlsRouter.delete('/urls/:id', deleteUrl);
urlsRouter.get('/ranking', getRanking);

export default urlsRouter;