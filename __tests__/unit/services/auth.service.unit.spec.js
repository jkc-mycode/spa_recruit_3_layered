import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { AuthService } from '../../../src/services/auth.service.js';
import bcrypt from 'bcrypt';
import { AUTH_CONSTANT } from '../../../src/constants/auth.constant.js';

const mockAuthRepository = {
    upsertRefreshToken: jest.fn(),
    getRefreshToken: jest.fn(),
    deleteRefreshToken: jest.fn(),
};

const mockUserRepository = {
    createUser: jest.fn(),
    getUserInfoById: jest.fn(),
    getUserInfoByEmail: jest.fn(),
};

const authService = new AuthService(mockUserRepository, mockAuthRepository);

describe('AuthService Unit Test', () => {
    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
    });

    // 회원가입 테스트 코드
    test('signUp Method', async () => {
        /* 설정 부분 */
        // User Repository의 createUser 메서드 임시 결과값
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
        const password = 'aaaa4321!!';
        // User Repository의 getUserInfoByEmail 메서드 실행 결과값 설정
        mockUserRepository.getUserInfoByEmail.mockReturnValue(null);
        // User Repository의 createUser 메서드 실행 결과값 설정
        mockUserRepository.createUser.mockResolvedValue({
            ...userInfoSample,
            password: await bcrypt.hash(password, AUTH_CONSTANT.HASH_SALT),
        });

        /* 실행 부분, 실제 Service의 getRefreshToken 메서드 실행 */
        const user = await authService.signUp(
            userInfoSample.email,
            password,
            password,
            userInfoSample.name,
            userInfoSample.age,
            userInfoSample.gender,
            userInfoSample.profileImage,
        );

        /* 테스트(조건) 부분 */
        // User Repository의 getUserInfoByEmail 메서드가 1번만 실행되었는지 검사
        expect(mockUserRepository.getUserInfoByEmail).toHaveBeenCalledTimes(1);
        // User Repository의 getUserInfoByEmail 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockUserRepository.getUserInfoByEmail).toHaveBeenCalledWith(userInfoSample.email);

        // User Repository의 createUser 메서드가 1번만 실행되었는지 검사
        expect(mockUserRepository.createUser).toHaveBeenCalledTimes(1);
        // User Repository의 createUser 메서드가 매개변수와 함께 호출되었는지 검사
        // createUser가 호출될 때 전달된 비밀번호가 실제로 암호화되었는지 확인
        const createUserCall = mockUserRepository.createUser.mock.calls[0];
        const hashedPassword = createUserCall[1];
        const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);

        expect(isPasswordCorrect).toBe(true);
        expect(createUserCall[0]).toBe(userInfoSample.email);
        expect(createUserCall[2]).toBe(userInfoSample.name);
        expect(createUserCall[3]).toBe(userInfoSample.age);
        expect(createUserCall[4]).toBe(userInfoSample.gender.toUpperCase());
        expect(createUserCall[5]).toBe(userInfoSample.profileImage);

        // Auth Service의 signUp 메서드 결과값과
        // User Repository의 createUser 메서드의 결과값이 같은지 검사
        expect(user).toEqual(userInfoSample);
    });

    // 로그인 테스트 코드
    test('signUp Method', async () => {
        /* 설정 부분 */
        // User Repository의 getUserInfoByEmail 메서드 임시 결과값
        const password = 'aaaa4321!!';
        const userInfoSample = {
            userId: 1,
            email: 'spartan@spartacodingclub.kr',
            password: await bcrypt.hash(password, AUTH_CONSTANT.HASH_SALT),
            name: '스파르탄',
            age: 28,
            gender: 'MALE',
            role: 'RECRUITER',
            profileImage: 'https://prismalens.vercel.app/header/logo-dark.svg',
            createdAt: '2024-06-09T13:56:19.906Z',
            updatedAt: '2024-06-09T13:56:19.906Z',
        };

        // Auth Service의 signIn 메서드 매개변수 임시 값 설정
        const upsertRefreshTokenParams = {
            userId: 1,
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcxODE3OTYxNCwiZXhwIjoxNzE4Nzg0NDE0fQ.EfW5fB8WSKWl3nJPcnLszl_VRDQL-m80crrb4DEGKX4',
            ip: '::ffff:127.0.0.1',
            userAgent: 'insomnia/9.2.0',
        };

        // User Repository의 getUserInfoByEmail 메서드 실행 결과값 설정
        mockUserRepository.getUserInfoByEmail.mockReturnValue(userInfoSample);
        // Auth Repository의 upsertRefreshToken 메서드 실행 결과값 설정
        mockAuthRepository.upsertRefreshToken.mockReturnValue(null);

        /* 실행 부분, 실제 Service의 getRefreshToken 메서드 실행 */
        const [accessToken, refreshToken] = await authService.signIn(
            userInfoSample.email,
            password,
            upsertRefreshTokenParams.ip,
            upsertRefreshTokenParams.userAgent,
        );

        /* 테스트(조건) 부분 */
        // User Repository의 getUserInfoByEmail 메서드가 1번만 실행되었는지 검사
        expect(mockUserRepository.getUserInfoByEmail).toHaveBeenCalledTimes(1);
        // User Repository의 getUserInfoByEmail 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockUserRepository.getUserInfoByEmail).toHaveBeenCalledWith(userInfoSample.email);

        // User Repository의 upsertRefreshToken 메서드가 1번만 실행되었는지 검사
        expect(mockAuthRepository.upsertRefreshToken).toHaveBeenCalledTimes(1);
        // JWT 토큰을 제외한 나머지 매개변수 검증
        const calledWithParams = mockAuthRepository.upsertRefreshToken.mock.calls[0];
        expect(calledWithParams[0]).toBe(upsertRefreshTokenParams.userId);
        expect(calledWithParams[2]).toBe(upsertRefreshTokenParams.ip);
        expect(calledWithParams[3]).toBe(upsertRefreshTokenParams.userAgent);

        // JWT 토큰의 구조 검증
        expect(calledWithParams[1]).toMatch(/^eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\./);

        // Auth Service의 signUp 메서드 결과값과
        // User Repository의 createUser 메서드의 결과값의 타입이 문자열인지만 검사
        expect([accessToken, refreshToken]).toEqual([expect.any(String), expect.any(String)]);
    });

    // 토큰 재발급 테스트 코드
    test('signUp Method', async () => {
        /* 설정 부분 */
        // Auth Service의 signIn 메서드 매개변수 임시 값 설정
        const upsertRefreshTokenParams = {
            userId: 1,
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcxODE3OTYxNCwiZXhwIjoxNzE4Nzg0NDE0fQ.EfW5fB8WSKWl3nJPcnLszl_VRDQL-m80crrb4DEGKX4',
            ip: '::ffff:127.0.0.1',
            userAgent: 'insomnia/9.2.0',
        };

        // Auth Repository의 upsertRefreshToken 메서드 실행 결과값 설정
        mockAuthRepository.upsertRefreshToken.mockReturnValue(null);

        /* 실행 부분, 실제 Service의 getRefreshToken 메서드 실행 */
        const [accessToken, refreshToken] = await authService.refresh(
            upsertRefreshTokenParams.userId,
            upsertRefreshTokenParams.ip,
            upsertRefreshTokenParams.userAgent,
        );

        /* 테스트(조건) 부분 */
        // User Repository의 upsertRefreshToken 메서드가 1번만 실행되었는지 검사
        expect(mockAuthRepository.upsertRefreshToken).toHaveBeenCalledTimes(1);
        // JWT 토큰을 제외한 나머지 매개변수 검증
        const calledWithParams = mockAuthRepository.upsertRefreshToken.mock.calls[0];
        expect(calledWithParams[0]).toBe(upsertRefreshTokenParams.userId);
        expect(calledWithParams[2]).toBe(upsertRefreshTokenParams.ip);
        expect(calledWithParams[3]).toBe(upsertRefreshTokenParams.userAgent);

        // JWT 토큰의 구조 검증
        expect(calledWithParams[1]).toMatch(/^eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\./);

        // Auth Service의 signUp 메서드 결과값과
        // User Repository의 createUser 메서드의 결과값의 타입이 문자열인지만 검사
        expect([accessToken, refreshToken]).toEqual([expect.any(String), expect.any(String)]);
    });

    // 로그아웃 기능
    test('signOut Method', async () => {
        /* 설정 부분 */
        // user 객체 형식 설정
        const userInfoSample = {
            userId: 1,
            email: 'spartan@spartacodingclub.kr',
            name: '스파르탄',
            age: 28,
            gender: 'MALE',
            role: 'APPLICANT',
            profileImage: 'https://prismalens.vercel.app/header/logo-dark.svg',
            createdAt: '2024-06-13T08:53:46.951Z',
            updatedAt: '2024-06-13T08:53:46.951Z',
        };

        // Auth Repository의 deleteRefreshToken 메서드 반환값을 설정
        mockAuthRepository.deleteRefreshToken.mockResolvedValue(userInfoSample.userId);

        /* 실행 부분, Controller의 signOut 메서드 실행 */
        const deletedTokenUserId = await authService.signOut(userInfoSample.userId);

        /* 테스트(조건) 부분 */
        // Auth Repository의 deleteRefreshToken 메서드가 1번만 실행되었는지 검사
        expect(mockAuthRepository.deleteRefreshToken).toHaveBeenCalledTimes(1);
        // Auth Repository의 deleteRefreshToken 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockAuthRepository.deleteRefreshToken).toHaveBeenCalledWith(userInfoSample.userId);
        // Auth Service의 signOut 메서드 결과값과
        // Auth Repository의 deleteRefreshToken 메서드의 결과값이 같은지 검사
        expect(deletedTokenUserId).toEqual(userInfoSample.userId);
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
        // Repository의 getRefreshToken 메서드가 1번만 실행되었는지 검사
        expect(mockAuthRepository.getRefreshToken).toHaveBeenCalledTimes(1);
        // Repository의 getRefreshToken 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockAuthRepository.getRefreshToken).toHaveBeenCalledWith(refreshTokenSample.userId);
        // Service의 getRefreshToken 메서드 결과값과
        // Repository의 getRefreshToken 메서드의 결과값이 같은지 검사
        expect(refreshToken).toEqual(refreshTokenSample);
    });
});
