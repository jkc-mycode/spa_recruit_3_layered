import express from 'express';
import authRouter from './auth.router.js';
import usersRouter from './users.router.js';
import resumesRouter from './resumes.router.js';

import authAccessTokenMiddleware from '../middlewares/auth.access.token.middleware.js';

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', authAccessTokenMiddleware, usersRouter);
apiRouter.use('/resumes', authAccessTokenMiddleware, resumesRouter);

export default apiRouter;
