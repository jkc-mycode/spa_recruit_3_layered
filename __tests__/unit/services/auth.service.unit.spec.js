import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { AuthService } from '../../../src/services/auth.service.js';
import { AUTH_CONSTANT } from '../../../src/constants/auth.constant.js';
import jwt from 'jsonwebtoken';

const mockAuthRepository = {
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
    upsertRefreshToken: jest.fn(),
    getUserInfo: jest.fn(),
    getRefreshToken: jest.fn(),
    deleteRefreshToken: jest.fn(),
};

const authService = new AuthService(mockAuthRepository);

describe('AuthService Unit Test', () => {
    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
    });

    // 이메일로 사용자 정보 조회
    test('getUserByEmail Method', async () => {
        /* 설정 부분 */
        // Repository의 getUserByEmail 메서드 임시 결과값
        const userInfoSample = {
            userId: 1,
            email: 'spartan@spartacodingclub.kr',
            name: '스파르탄',
            age: 28,
            gender: 'MALE',
            role: 'RECRUITER',
            profileImage: 'https://prismalens.vercel.app/header/logo-dark.svg',
            createdAt: '2024-06-09T13:56:19.906Z',
            updatedAt: '2024-06-09T13:56:19.906Z',
        };
        // Repository의 getUserByEmail 메서드의 결과값 설정
        mockAuthRepository.getUserByEmail.mockReturnValue(userInfoSample);

        /* 실행 부분, Service의  getUserByEmail 메서드 실행 */
        const user = await authService.getUserByEmail(userInfoSample.email);

        /* 테스트(조건) 부분 */
        // Service의 getUserByEmail 메서드 결과값과
        // Repository의 getUserByEmail 메서드 결과값이 같은지 검사
        expect(user).toBe(userInfoSample);
        // Repository의 getUserByEmail 메서드가 1번만 실행되었는지 검사
        expect(mockAuthRepository.getUserByEmail).toHaveBeenCalledTimes(1);
        // Repository의 getUserByEmail 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockAuthRepository.getUserByEmail).toHaveBeenCalledWith(userInfoSample.email);
    });

    // 사용자 생성
    test('createUser Method', async () => {
        /* 설정 부분 */
        // Repository의 createUser 메서드 임시 결과값
        const userInfoSample = {
            userId: 1,
            email: 'spartan@spartacodingclub.kr',
            name: '스파르탄',
            age: 28,
            gender: 'MALE',
            role: 'RECRUITER',
            profileImage: 'https://prismalens.vercel.app/header/logo-dark.svg',
            createdAt: '2024-06-09T13:56:19.906Z',
            updatedAt: '2024-06-09T13:56:19.906Z',
        };
        // Repository의 createUser 메서드의 결과값 설정
        mockAuthRepository.createUser.mockReturnValue(userInfoSample);

        // Service의 createUser 메서드 매개변수 임시 값 설정
        const createUserParams = {
            email: 'spartan44@spartacodingclub.kr',
            password: 'aaaa4321!!',
            name: '스파르탄44',
            age: 28,
            gender: 'MALE',
            profileImage: 'https://prismalens.vercel.app/header/logo-dark.svg',
        };

        /* 실행 부분, 실제 Service의  createUser 메서드 실행 */
        const user = await authService.createUser(
            createUserParams.email,
            createUserParams.password,
            createUserParams.name,
            createUserParams.age,
            createUserParams.gender,
            createUserParams.profileImage,
        );

        // 반환값에서 비밀번호 제외
        const { password: pw, ...userData } = user;

        /* 테스트(조건) 부분 */
        // Service의 createUser 메서드의 결과값과
        // Repository의 createUser 메서드의 결과값이 같은지 검사
        expect(userData).toStrictEqual(userInfoSample);
        // Repository의 createUser 메서드가 1번만 실행되었는지 검사
        expect(mockAuthRepository.createUser).toHaveBeenCalledTimes(1);
        // Repository의 createUser 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockAuthRepository.createUser).toHaveBeenCalledWith(
            createUserParams.email,
            createUserParams.password,
            createUserParams.name,
            createUserParams.age,
            createUserParams.gender,
            createUserParams.profileImage,
        );
    });

    // Access Token 발급
    test('createAccessToken Method', async () => {
        /* 설정 부분 */
        // Service의 createAccessToken 메서드 실행시 필요한 변수
        const userId = 1;
        // 모킹한 jwt의 sign 메서드 임시 결과값
        const accessToken = process.env.ACCESS_TOKEN_SECRET_KEY;
        // 모킹한 jwt의 sign 메서드 결과값 설정
        jwt.sign = jest.fn().mockReturnValue(accessToken);

        /* 실행 부분, 실제 Service의 createAccessToken 메서드 실행 */
        const token = await authService.createAccessToken(userId);

        /* 테스트(조건) 부분 */
        // Service의 createAccessToken 메서드 결과값과
        // jwt.sign 메서드의 결과값이 같은지 검사
        expect(token).toBe(accessToken);
        // 모킹한 jwt의 sign 메서드가 1번만 실행되었는지 검사
        expect(jwt.sign).toHaveBeenCalledTimes(1);
        // 모킹한 jwt의 sign 메서드가 매개변수와 함께 호출되었는지 검사
        expect(jwt.sign).toHaveBeenCalledWith({ userId }, process.env.ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: AUTH_CONSTANT.ACCESS_TOKEN_EXPIRED_IN,
        });
    });

    // Refresh Token 발급
    test('createRefreshToken Method', async () => {
        /* 설정 부분 */
        // Service의 createRefreshToken 메서드 실행시 필요한 변수
        const userId = 1;
        // 모킹한 jwt의 sign 메서드 임시 결과값
        const refreshToken = process.env.REFRESH_TOKEN_SECRET_KEY;
        // 모킹한 jwt의 sign 메서드 결과값 설정
        jwt.sign = jest.fn().mockReturnValue(refreshToken);

        /* 실행 부분, 실제 Service의 createRefreshToken 메서드 실행 */
        const token = await authService.createRefreshToken(userId);

        /* 테스트(조건) 부분 */
        // Service의 createRefreshToken 메서드 결과값과
        // jwt.sign 메서드의 결과값이 같은지 검사
        expect(token).toBe(refreshToken);
        // 모킹한 jwt의 sign 메서드가 1번만 실행되었는지 검사
        expect(jwt.sign).toHaveBeenCalledTimes(1);
        // 모킹한 jwt의 sign 메서드가 매개변수와 함께 호출되었는지 검사
        expect(jwt.sign).toHaveBeenCalledWith({ userId }, process.env.REFRESH_TOKEN_SECRET_KEY, {
            expiresIn: AUTH_CONSTANT.REFRESH_TOKEN_EXPIRED_IN,
        });
    });

    // 기존 토큰이 있으면 업데이트 없으면 생성
    test('upsertRefreshToken Method', async () => {
        /* 설정 부분 */
        // Service의 createUser 메서드 매개변수 임시 값 설정
        const upsertRefreshTokenParams = {
            userId: 1,
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcxODE3OTYxNCwiZXhwIjoxNzE4Nzg0NDE0fQ.EfW5fB8WSKWl3nJPcnLszl_VRDQL-m80crrb4DEGKX4',
            ip: '::ffff:127.0.0.1',
            userAgent: 'insomnia/9.2.0',
        };

        /* 실행 부분, 실제 Service의  upsertRefreshToken 메서드 실행 */
        await authService.upsertRefreshToken(
            upsertRefreshTokenParams.userId,
            upsertRefreshTokenParams.token,
            upsertRefreshTokenParams.ip,
            upsertRefreshTokenParams.userAgent,
        );

        /* 테스트(조건) 부분 */
        // Repository의 upsertRefreshToken 메서드가 1번만 실행되었는지 검사
        expect(mockAuthRepository.upsertRefreshToken).toHaveBeenCalledTimes(1);
        // Repository의 upsertRefreshToken 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockAuthRepository.upsertRefreshToken).toHaveBeenCalledWith(
            upsertRefreshTokenParams.userId,
            upsertRefreshTokenParams.token,
            upsertRefreshTokenParams.ip,
            upsertRefreshTokenParams.userAgent,
        );
    });

    // 사용자 ID로 사용자 조회
    test('getUserInfo Method', async () => {
        /* 설정 부분 */
        // Repository의 getUserInfo 메서드 임시 결과값
        const userInfoSample = {
            userId: 1,
            email: 'spartan@spartacodingclub.kr',
            name: '스파르탄',
            age: 28,
            gender: 'MALE',
            role: 'RECRUITER',
            profileImage: 'https://prismalens.vercel.app/header/logo-dark.svg',
            createdAt: '2024-06-09T13:56:19.906Z',
            updatedAt: '2024-06-09T13:56:19.906Z',
        };
        // Repository의 getUserInfo 메서드 결과값 설정
        mockAuthRepository.getUserInfo.mockReturnValue(userInfoSample);

        /* 실행 부분, 실제 Service의  getUserInfo 메서드 실행 */
        const user = await authService.getUserInfo(userInfoSample.userId);

        /* 테스트(조건) 부분 */
        // Service의 getUerInfo 메서드 결과값과
        // Repository의 getUserInfo 메서드 결과값이 같은지 검사
        expect(user).toBe(userInfoSample);
        // Repository의 getUserInfo 메서드가 1번만 실행되는지 검사
        expect(mockAuthRepository.getUserInfo).toHaveBeenCalledTimes(1);
        // Repository의 getUserInfo 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockAuthRepository.getUserInfo).toHaveBeenCalledWith(userInfoSample.userId);
    });

    // DB에 저장된 RefreshToken를 조회
    test('getRefreshToken Method', async () => {
        /* 설정 부분 */
        // Repository의 getRefreshToken 메서드 임시 결과값
        const refreshTokenSample = {
            tokenId: 1,
            userId: 1,
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcxODE3OTYxNCwiZXhwIjoxNzE4Nzg0NDE0fQ.EfW5fB8WSKWl3nJPcnLszl_VRDQL-m80crrb4DEGKX4',
            ip: '::ffff:127.0.0.1',
            userAgent: 'insomnia/9.2.0',
            createdAt: '2024-06-09T13:56:19.906Z',
        };
        // Repository의 getRefreshToken 메서드 실행 결과값 설정
        mockAuthRepository.getRefreshToken.mockReturnValue(refreshTokenSample);

        /* 실행 부분, 실제 Service의 getRefreshToken 메서드 실행 */
        const refreshToken = await authService.getRefreshToken(refreshTokenSample.userId);

        /* 테스트(조건) 부분 */
        // Service의 getRefreshToken 메서드 결과값과
        // Repository의 getRefreshToken 메서드의 결과값이 같은지 검사
        expect(refreshToken).toBe(refreshTokenSample);
        // Repository의 getRefreshToken 메서드가 1번만 실행되었는지 검사
        expect(mockAuthRepository.getRefreshToken).toHaveBeenCalledTimes(1);
        // Repository의 getRefreshToken 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockAuthRepository.getRefreshToken).toHaveBeenCalledWith(refreshTokenSample.userId);
    });

    // DB에서 Refresh Token 삭제
    test('deleteRefreshToken Method', async () => {
        /* 설정 부분 */
        // Repository의 deleteRefreshToken 메서드 임시 결과값
        const refreshTokenSample = {
            userId: 1,
        };
        // Repository의 deleteRefreshToken 메서드 실행 결과값 설정
        mockAuthRepository.deleteRefreshToken.mockReturnValue(refreshTokenSample);

        /* 실행 부분, Service의 deleteRefreshToken 메서드 실행 */
        const deletedTokenUserId = await authService.deleteRefreshToken(refreshTokenSample.userId);

        /* 테스트(조건) 부분 */
        // Service의 deleteRefreshToken 메서드의 결과값과
        // Repository의 deleteRefreshToken 메서드의 결과값이 같은지 검사
        expect(deletedTokenUserId).toBe(refreshTokenSample);
        // Repository의 deleteRefreshToken 메서드가 1번만 실행되었는지 검사
        expect(mockAuthRepository.deleteRefreshToken).toHaveBeenCalledTimes(1);
        // Repository의 deleteRefreshToken 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockAuthRepository.deleteRefreshToken).toHaveBeenCalledWith(refreshTokenSample.userId);
    });
});
