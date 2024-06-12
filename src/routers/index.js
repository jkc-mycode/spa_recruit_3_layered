import express from 'express';
import authRouter from './auth.router.js';
import usersRouter from './users.router.js';
import resumesRouter from './resumes.router.js';

import { authAccessTokenMiddleware } from '../middlewares/auth.access.token.middleware.js';

import { prisma } from '../utils/prisma.util.js';
import { UserRepository } from '../repositories/user.repository.js';
import { UserService } from '../services/user.service.js';

const apiRouter = express.Router();

const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', authAccessTokenMiddleware(userService), usersRouter);
apiRouter.use('/resumes', authAccessTokenMiddleware(userService), resumesRouter);

export default apiRouter;
