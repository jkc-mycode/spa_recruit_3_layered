import express from 'express';
import { prisma } from '../utils/prisma.util.js';

import { authRefreshTokenMiddleware } from '../middlewares/auth.refresh.token.middleware.js';
import { signUpValidator } from '../middlewares/validators/sign-up.validator.middleware.js';
import { signInValidator } from '../middlewares/validators/sign-in.validator.middleware.js';

import { AuthRepository } from '../repositories/auth.repository.js';
import { AuthService } from '../services/auth.service.js';
import { AuthController } from '../controllers/auth.controller.js';
import { UserRepository } from '../repositories/user.repository.js';
import { UserService } from '../services/user.service.js';

const router = express.Router();

const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);

const authRepository = new AuthRepository(prisma);
const authService = new AuthService(userRepository, authRepository);
const authController = new AuthController(authService);



// 회원가입 API
router.post('/sign-up', signUpValidator, authController.signUp);

// 로그인 API
router.post('/sign-in', signInValidator, authController.signIn);

// 토큰 재발급 API
router.post('/refresh', authRefreshTokenMiddleware(authService, userService), authController.refresh);

// 로그아웃 API
router.post('/sign-out', authRefreshTokenMiddleware(authService, userService), authController.signOut);

export default router;
