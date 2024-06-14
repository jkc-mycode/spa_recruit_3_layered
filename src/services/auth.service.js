import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AUTH_CONSTANT } from '../constants/auth.constant.js';
import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';

export class AuthService {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }

    // 회원가입
    signUp = async (email, password, passwordConfirm, name, age, gender, profileImage) => {
        // 이메일 중복 확인
        const isExistUser = await this.authRepository.getUserByEmail(email);
        if (isExistUser) {
            throw new HttpError.Conflict(MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED);
        }

        // 비밀번호 확인 결과
        if (password !== passwordConfirm) {
            throw new HttpError.BadRequest(MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.INCONSISTENT);
        }

        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, AUTH_CONSTANT.HASH_SALT);

        // 사용자 생성
        const user = await this.authRepository.createUser(
            email,
            hashedPassword,
            name,
            age,
            gender.toUpperCase(),
            profileImage,
        );

        // 반환값에서 비밀번호 제외
        user.password = undefined;

        return user;
    };

    // 로그인
    signIn = async (email, password, ip, userAgent) => {
        // 입력받은 이메일로 사용자 조회
        const user = await this.authRepository.getUserByEmail(email);

        // 사용자 비밀번호와 입력한 비밀번호 일치 확인
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.UNAUTHORIZED);
        }

        // 로그인 성공하면 JWT 토큰 발급
        const accessToken = jwt.sign({ userId: user.userId }, process.env.ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: AUTH_CONSTANT.ACCESS_TOKEN_EXPIRED_IN,
        });
        const refreshToken = jwt.sign({ userId: user.userId }, process.env.REFRESH_TOKEN_SECRET_KEY, {
            expiresIn: AUTH_CONSTANT.REFRESH_TOKEN_EXPIRED_IN,
        });

        // 기존 토큰이 있으면 업데이트 없으면 생성
        await this.authRepository.upsertRefreshToken(user.userId, refreshToken, ip, userAgent);

        return [accessToken, refreshToken];
    };

    // 토큰 재발급
    refresh = async (userId, ip, userAgent) => {
        // Access Token 재발급 (12시간)
        const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: AUTH_CONSTANT.ACCESS_TOKEN_EXPIRED_IN,
        });

        // Refresh Token 재발급 (7일)
        const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET_KEY, {
            expiresIn: AUTH_CONSTANT.REFRESH_TOKEN_EXPIRED_IN,
        });

        // 기존 토큰이 있으면 업데이트 없으면 생성
        await this.authRepository.upsertRefreshToken(userId, refreshToken, ip, userAgent);

        return [accessToken, refreshToken];
    };

    // 로그아웃
    signOut = async (userId) => {
        // DB에서 Refresh Token 삭제
        const deletedTokenUserId = await this.authRepository.deleteRefreshToken(userId);

        return deletedTokenUserId;
    };

    // 사용자 ID로 사용자 조회
    getUserInfo = async (userId) => {
        const user = await this.authRepository.getUserInfo(userId);

        return user;
    };

    // DB에 저장된 RefreshToken를 조회
    getRefreshToken = async (userId) => {
        const refreshToken = await this.authRepository.getRefreshToken(userId);

        return refreshToken;
    };
}
