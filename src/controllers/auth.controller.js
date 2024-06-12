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
            // 이메일 중복 확인
            const isExistUser = await this.authService.getUserByEmail(email);
            if (isExistUser) {
                throw new HttpError.Conflict(MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED);
            }

            // 비밀번호 확인 결과
            if (password !== passwordConfirm) {
                throw new HttpError.BadRequest(MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.INCONSISTENT);
            }

            // 비밀번호 암호화
            const hashedPassword = await this.authService.getHashedPassword(password, AUTH_CONSTANT.HASH_SALT);

            // 사용자 생성
            const user = await this.authService.createUser(
                email,
                hashedPassword,
                name,
                age,
                gender.toUpperCase(),
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

            // 입력받은 이메일로 사용자 조회
            const user = await this.authService.getUserByEmail(email);

            // 사용자 비밀번호와 입력한 비밀번호 일치 확인
            if (!user || !(await bcrypt.compare(password, user.password))) {
                throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.UNAUTHORIZED);
            }

            // 로그인 성공하면 JWT 토큰 발급
            const accessToken = await this.authService.createAccessToken(user.userId);
            const refreshToken = await this.authService.createRefreshToken(user.userId);

            // 기존 토큰이 있으면 업데이트 없으면 생성
            await this.authService.upsertRefreshToken(
                user.userId,
                refreshToken,
                req.ip,
                req.headers[AUTH_CONSTANT.USER_AGENT],
            );

            return res
                .status(HTTP_STATUS.OK)
                .json({ status: HTTP_STATUS.OK, message: MESSAGES.AUTH.SIGN_IN, data: { accessToken, refreshToken } });
        } catch (err) {
            next(err);
        }
    };

    // 토큰 재발급 기능
    refresh = async (req, res, next) => {
        try {
            // 사용자 정보 가져옴
            const user = req.user;

            // Access Token 재발급 (12시간)
            const accessToken = await this.authService.createAccessToken(user.userId);

            // Refresh Token 재발급 (7일)
            const refreshToken = await this.authService.createRefreshToken(user.userId);

            // 기존 토큰이 있으면 업데이트 없으면 생성
            await this.authService.upsertRefreshToken(
                user.userId,
                refreshToken,
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

    // 로그아웃 기능
    signOut = async (req, res, next) => {
        try {
            // 사용자 정보 가져옴
            const user = req.user;

            // DB에서 Refresh Token 삭제
            const deletedTokenUserId = await this.authService.deleteRefreshToken(user.userId);

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
