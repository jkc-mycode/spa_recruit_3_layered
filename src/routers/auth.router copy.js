import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import authRefreshTokenMiddleware from '../middlewares/auth.refresh.token.middleware.js';
import { signUpValidator } from '../middlewares/validators/sign-up.validator.middleware.js';
import { signInValidator } from '../middlewares/validators/sign-in.validator.middleware.js';

import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { AUTH_CONSTANT } from '../constants/auth.constant.js';

const router = express.Router();

// 회원가입 API
router.post('/sign-up', signUpValidator, async (req, res, next) => {
    try {
        const { email, password, passwordConfirm, name, age, gender, profileImage } = req.body;

        // 이메일 중복 확인
        const isExistUser = await prisma.user.findFirst({ where: { email } });
        if (isExistUser) {
            return res
                .status(HTTP_STATUS.CONFLICT)
                .json({ status: HTTP_STATUS.CONFLICT, message: MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED });
        }

        // 비밀번호 확인 결과
        if (password !== passwordConfirm) {
            return res
                .status(HTTP_STATUS.BAD_REQUEST)
                .json({ status: HTTP_STATUS.BAD_REQUEST, message: MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.INCONSISTENT });
        }

        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, AUTH_CONSTANT.HASH_SALT);

        // 사용자 생성
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                age,
                gender: gender.toUpperCase(),
                profileImage,
            },
        });

        const { password: pw, ...userData } = user; // == user.password = undefined;

        return res
            .status(HTTP_STATUS.CREATED)
            .json({ status: HTTP_STATUS.CREATED, message: MESSAGES.AUTH.SIGN_UP.SUCCEED, data: { userData } });
    } catch (err) {
        next(err);
    }
});

// 로그인 API
router.post('/sign-in', signInValidator, async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 입력받은 이메일로 사용자 조회
        const user = await prisma.user.findFirst({ where: { email } });

        // 사용자 비밀번호와 입력한 비밀번호 일치 확인
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res
                .status(HTTP_STATUS.UNAUTHORIZED)
                .json({ status: HTTP_STATUS.UNAUTHORIZED, message: MESSAGES.AUTH.COMMON.UNAUTHORIZED });
        }

        // 로그인 성공하면 JWT 토큰 발급
        const AccessToken = jwt.sign({ userId: user.userId }, process.env.ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: AUTH_CONSTANT.ACCESS_TOKEN_EXPIRED_IN,
        });
        const RefreshToken = jwt.sign({ userId: user.userId }, process.env.REFRESH_TOKEN_SECRET_KEY, {
            expiresIn: AUTH_CONSTANT.REFRESH_TOKEN_EXPIRED_IN,
        });

        // prisma upsert를 통해서 기존 토큰이 있으면 업데이트 없으면 생성
        await prisma.refreshToken.upsert({
            where: { UserId: user.userId },
            update: {
                token: RefreshToken,
                createdAt: new Date(Date.now()),
            },
            create: {
                UserId: user.userId,
                token: RefreshToken,
                ip: req.ip,
                userAgent: req.headers[AUTH_CONSTANT.USER_AGENT],
            },
        });

        return res
            .status(HTTP_STATUS.OK)
            .json({ status: HTTP_STATUS.OK, message: MESSAGES.AUTH.SIGN_IN, data: { AccessToken, RefreshToken } });
    } catch (err) {
        next(err);
    }
});

// 토큰 재발급 API
router.post('/refresh', authRefreshTokenMiddleware, async (req, res, next) => {
    try {
        // 사용자 정보 가져옴
        const user = req.user;

        // Access Token 재발급 (12시간)
        const AccessToken = jwt.sign({ userId: user.userId }, process.env.ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: AUTH_CONSTANT.ACCESS_TOKEN_EXPIRED_IN,
        });

        // Refresh Token 재발급 (7일)
        const RefreshToken = jwt.sign({ userId: user.userId }, process.env.REFRESH_TOKEN_SECRET_KEY, {
            expiresIn: AUTH_CONSTANT.REFRESH_TOKEN_EXPIRED_IN,
        });
        await prisma.refreshToken.update({
            where: { UserId: user.userId },
            data: {
                token: RefreshToken,
                ip: req.ip,
                userAgent: req.headers[AUTH_CONSTANT.USER_AGENT],
                createdAt: new Date(Date.now()),
            },
        });

        return res.status(HTTP_STATUS.CREATED).json({
            status: HTTP_STATUS.CREATED,
            message: MESSAGES.AUTH.TOKEN_REFRESH.SUCCEED,
            data: { AccessToken, RefreshToken },
        });
    } catch (err) {
        next(err);
    }
});

// 로그아웃 API
router.post('/sign-out', authRefreshTokenMiddleware, async (req, res, next) => {
    try {
        // 사용자 정보 가져옴
        const user = req.user;

        // DB에서 Refresh Token 삭제
        const deletedUserId = await prisma.refreshToken.delete({
            where: { UserId: user.userId },
            select: { UserId: true },
        });

        return res
            .status(HTTP_STATUS.OK)
            .json({ status: HTTP_STATUS.OK, message: MESSAGES.AUTH.SIGN_OUT.SUCCEED, data: { deletedUserId } });
    } catch (err) {
        next(err);
    }
});

export default router;
