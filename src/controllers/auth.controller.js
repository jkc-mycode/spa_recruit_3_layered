import bcrypt from 'bcrypt';
import { AUTH_CONSTANT } from '../constants/auth.constant.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { HttpError } from '../errors/http.error.js';

export class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    // 회원가입 기능
    signUp = async (req, res, next) => {
        try {
            const { email, password, passwordConfirm, name, age, gender, profileImage } = req.body;

            // 서비스 로직
            const user = await this.authService.signUp(
                email,
                password,
                passwordConfirm,
                name,
                age,
                gender,
                profileImage,
            );

            return res
                .status(HTTP_STATUS.CREATED)
                .json({ status: HTTP_STATUS.CREATED, message: MESSAGES.AUTH.SIGN_UP.SUCCEED, data: { user } });
        } catch (err) {
            next(err);
        }
    };

    // 로그인 기능
    signIn = async (req, res, next) => {
        try {
            const { email, password } = req.body;

            // 서비스 로직
            const [accessToken, refreshToken] = await this.authService.signIn(
                email,
                password,
                req.ip,
                req.headers[AUTH_CONSTANT.USER_AGENT],
            );

            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                message: MESSAGES.AUTH.SIGN_IN.SUCCEED,
                data: { accessToken, refreshToken },
            });
        } catch (err) {
            next(err);
        }
    };

    // 토큰 재발급 기능
    refresh = async (req, res, next) => {
        try {
            // 사용자 정보 가져옴
            const user = req.user;

            // 서비스 로직
            const [accessToken, refreshToken] = await this.authService.refresh(
                user.userId,
                req.ip,
                req.headers[AUTH_CONSTANT.USER_AGENT],
            );

            return res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                message: MESSAGES.AUTH.TOKEN_REFRESH.SUCCEED,
                data: { accessToken, refreshToken },
            });
        } catch (err) {
            next(err);
        }
    };

    // 로그아웃
    signOut = async (req, res, next) => {
        try {
            // 사용자 정보 가져옴
            const user = req.user;

            // 서비스 로직
            const deletedTokenUserId = await this.authService.signOut(user.userId);

            // 로그아웃한 사용자 ID 반환
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                message: MESSAGES.AUTH.SIGN_OUT.SUCCEED,
                data: { deletedTokenUserId },
            });
        } catch (err) {
            next(err);
        }
    };
}
