import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AUTH_CONSTANT } from '../constants/auth.constant.js';

export class AuthService {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }
    // 이메일로 사용자 정보 조회
    getUserByEmail = async (email) => {
        const user = await this.authRepository.getUserByEmail(email);

        return user;
    };

    // 비밀번호 암호화
    getHashedPassword = async (password, hashSalt) => {
        const hashedPassword = await bcrypt.hash(password, hashSalt);

        return hashedPassword;
    };

    // 사용자 생성
    createUser = async (email, password, name, age, gender, profileImage) => {
        const user = await this.authRepository.createUser(email, password, name, age, gender, profileImage);

        // 반환값에서 비밀번호 제외
        const { password: pw, ...userData } = user;

        return userData;
    };

    // Access Token 발급
    createAccessToken = async (userId) => {
        const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: AUTH_CONSTANT.ACCESS_TOKEN_EXPIRED_IN,
        });

        return accessToken;
    };

    // Refresh Token 발급
    createRefreshToken = async (userId) => {
        const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET_KEY, {
            expiresIn: AUTH_CONSTANT.REFRESH_TOKEN_EXPIRED_IN,
        });

        return refreshToken;
    };

    // 기존 토큰이 있으면 업데이트 없으면 생성
    upsertRefreshToken = async (userId, token, ip, userAgent) => {
        await this.authRepository.upsertRefreshToken(userId, token, ip, userAgent);

        return;
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

    // DB에서 Refresh Token 삭제
    deleteRefreshToken = async (userId) => {
        const deletedTokenUserId = await this.authRepository.deleteRefreshToken(userId);

        return deletedTokenUserId;
    };
}
