import express from 'express';
import { prisma } from '../utils/prisma.util.js';

import { authRefreshTokenMiddleware } from '../middlewares/auth.refresh.token.middleware.js';
import { signUpValidator } from '../middlewares/validators/sign-up.validator.middleware.js';
import { signInValidator } from '../middlewares/validators/sign-in.validator.middleware.js';

import { AuthRepository } from '../repositories/auth.repository.js';
import { AuthService } from '../services/auth.service.js';
import { AuthController } from '../controllers/auth.controller.js';

const router = express.Router();

const authRepository = new AuthRepository(prisma);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

// 회원가입 API
router.post('/sign-up', signUpValidator, authController.signUp);

// 로그인 API
router.post('/sign-in', signInValidator, authController.signIn);

// 토큰 재발급 API
router.post('/refresh', authRefreshTokenMiddleware(authService), authController.refresh);

// 로그아웃 API
router.post('/sign-out', authRefreshTokenMiddleware(authService), authController.signOut);

export default router;
