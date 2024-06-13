import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { AuthController } from '../../../src/controllers/auth.controller.js';
import { AUTH_CONSTANT } from '../../../src/constants/auth.constant.js';
import { HTTP_STATUS } from '../../../src/constants/http-status.constant.js';
import { MESSAGES } from '../../../src/constants/message.constant.js';
import bcrypt from 'bcrypt';

const mockAuthService = {
    getUserByEmail: jest.fn(),
    getHashedPassword: jest.fn(),
    createUser: jest.fn(),
    createAccessToken: jest.fn(),
    createRefreshToken: jest.fn(),
    upsertRefreshToken: jest.fn(),
    getUserInfo: jest.fn(),
    getRefreshToken: jest.fn(),
    deleteRefreshToken: jest.fn(),
};

const mockRequest = {
    user: jest.fn(),
    body: jest.fn(),
    query: jest.fn(),
    params: jest.fn(),
    headers: jest.fn(),
    ip: jest.fn(),
};

const mockResponse = {
    status: jest.fn(),
    json: jest.fn(),
};

const mockNext = jest.fn();

const authController = new AuthController(mockAuthService);

describe('AuthController Unit Test', () => {
    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다.

        // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
        mockResponse.status.mockReturnValue(mockResponse);
    });

    // 회원가입 기능
    test('signUp Method', async () => {
        /* 설정 부분 */
        // Controller의 signUp 메서드가 실행되기 위한 Body 입력값
        const createUserRequestBodyParams = {
            email: 'spartan@spartacodingclub.kr',
            password: 'aaaa4321!!',
            passwordConfirm: 'aaaa4321!!',
            name: '스파르탄',
            age: 28,
            gender: 'MALE',
            profileImage: 'https://prismalens.vercel.app/header/logo-dark.svg',
        };
        // Request의 body에 입력할 인자값 설정
        mockRequest.body = createUserRequestBodyParams;

        // Service의 createUser 메서드 반환값 형식 설정
        const userInfoSample = {
            userId: 1,
            email: createUserRequestBodyParams.email,
            name: createUserRequestBodyParams.name,
            age: createUserRequestBodyParams.age,
            gender: createUserRequestBodyParams.gender,
            role: 'APPLICANT',
            profileImage: createUserRequestBodyParams.profileImage,
            createdAt: '2024-06-13T08:53:46.951Z',
            updatedAt: '2024-06-13T08:53:46.951Z',
        };
        // 해시된 비밀번호
        const hashedPassword = 'hashedPassword123';

        // Promise 객체들이 무조건 resolved 되었다는 가정
        // Service의 getUserByEmail 메서드 반환값을 null로 설정 (중복 없다는 의미로 진행)
        mockAuthService.getUserByEmail.mockResolvedValue(null);
        // Service의 getHashedPassword 메서드 반환값을 설정
        mockAuthService.getHashedPassword.mockResolvedValue(hashedPassword);
        // Service의 createUser 메서드 반환값을 설정
        mockAuthService.createUser.mockResolvedValue(userInfoSample);

        /* 실행 부분, Controller의 signUp 메서드 실행 */
        await authController.signUp(mockRequest, mockResponse, mockNext);

        /* 테스트(조건) 부분 */
        // Service의 getUserByEmail 메서드가 1번만 실행되었는지 검사
        expect(mockAuthService.getUserByEmail).toHaveBeenCalledTimes(1);
        // Service의 getUserByEmail 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockAuthService.getUserByEmail).toHaveBeenCalledWith(createUserRequestBodyParams.email);

        // Service의 getHashedPassword 메서드가 1번만 실행되었는지 검사
        expect(mockAuthService.getHashedPassword).toHaveBeenCalledTimes(1);
        // Service의 getHashedPassword 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockAuthService.getHashedPassword).toHaveBeenCalledWith(
            createUserRequestBodyParams.password,
            AUTH_CONSTANT.HASH_SALT,
        );

        // Service의 createUser 메서드가 1번만 실행되었는지 검사
        expect(mockAuthService.createUser).toHaveBeenCalledTimes(1);
        // Service의 createUser 메서드에 데이터가 매개변수와 함께 호출되었는지 검사
        expect(mockAuthService.createUser).toHaveBeenCalledWith(
            createUserRequestBodyParams.email,
            hashedPassword,
            createUserRequestBodyParams.name,
            createUserRequestBodyParams.age,
            createUserRequestBodyParams.gender,
            createUserRequestBodyParams.profileImage,
        );

        // Response의 status 메서드가 1번만 실행되었는지 검사
        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        // Response의 status 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);

        // Response의 json 메서드가 1번만 실행되었는지 검사
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        // Response의 json 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: HTTP_STATUS.CREATED,
            message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
            data: { user: userInfoSample },
        });
    });

    // 로그인 기능
    test('signIn Method', async () => {
        /* 설정 부분 */
        // Controller의 signIn 메서드가 실행되기 위한 Body 입력값
        const signInRequestBodyParams = {
            email: 'spartan@spartacodingclub.kr',
            password: 'aaaa4321!!',
        };
        // Request의 body에 입력할 인자값 설정
        mockRequest.body = signInRequestBodyParams;

        // Service의 createAccessToken 메서드 반환값 형식 설정
        const accessTokenSample =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxODI1ODY1NSwiZXhwIjoxNzE4MzAxODU1fQ.a9KC5GlIVBB3vnQFQFUyru-0iS5kBLyZcyEOB07aa10';

        // Service의 createRefreshToken 메서드 반환값 형식 설정
        const refreshTokenSample =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxODI1ODY1NSwiZXhwIjoxNzE4ODYzNDU1fQ.wTxVaySCHrTxFiAj5TvgzNbLN9dtS9r0r8cfDkcddtw';

        // Service의 getUserByEmail 메서드 반환값 형식 설정
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

        // Service의 upsertRefreshToken 메서드 매개변수 설정
        const upsertRefreshTokenParams = {
            ip: '127.0.0.1',
            userAgent: 'Insomnia',
        };
        // Request 메서드 내용 채우기
        mockRequest.ip = upsertRefreshTokenParams.ip;
        mockRequest.headers[AUTH_CONSTANT.USER_AGENT] = upsertRefreshTokenParams.userAgent;

        // Promise 객체들이 무조건 resolved 되었다는 가정
        // Service의 getUserByEmail 메서드 반환값을 설정
        mockAuthService.getUserByEmail.mockResolvedValue(userInfoSample);
        // Service의 createAccessToken 메서드 반환값을 설정
        mockAuthService.createAccessToken.mockResolvedValue(accessTokenSample);
        // Service의 createRefreshToken 메서드 반환값을 설정
        mockAuthService.createRefreshToken.mockResolvedValue(refreshTokenSample);
        // Service의 upsertRefreshToken 메서드 반환값을 설정
        mockAuthService.upsertRefreshToken.mockResolvedValue();

        // bcrypt 비교 함수 모킹
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

        /* 실행 부분, Controller의 signIn 메서드 실행 */
        await authController.signIn(mockRequest, mockResponse, mockNext);

        /* 테스트(조건) 부분 */
        // Service의 getUserByEmail 메서드가 1번만 실행되었는지 검사
        expect(mockAuthService.getUserByEmail).toHaveBeenCalledTimes(1);
        // Service의 getUserByEmail 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockAuthService.getUserByEmail).toHaveBeenCalledWith(signInRequestBodyParams.email);

        // Service의 createAccessToken 메서드가 1번만 실행되었는지 검사
        expect(mockAuthService.createAccessToken).toHaveBeenCalledTimes(1);
        // Service의 createAccessToken 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockAuthService.createAccessToken).toHaveBeenCalledWith(userInfoSample.userId);

        // Service의 createRefreshToken 메서드가 1번만 실행되었는지 검사
        expect(mockAuthService.createRefreshToken).toHaveBeenCalledTimes(1);
        // Service의 createRefreshToken 메서드에 데이터가 매개변수와 함께 호출되었는지 검사
        expect(mockAuthService.createRefreshToken).toHaveBeenCalledWith(userInfoSample.userId);

        expect(mockAuthService.upsertRefreshToken).toHaveBeenCalledTimes(1);
        expect(mockAuthService.upsertRefreshToken).toHaveBeenCalledWith(
            userInfoSample.userId,
            refreshTokenSample,
            upsertRefreshTokenParams.ip,
            upsertRefreshTokenParams.userAgent,
        );

        // Response의 status 메서드가 1번만 실행되었는지 검사
        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        // Response의 status 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);

        // Response의 json 메서드가 1번만 실행되었는지 검사
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        // Response의 json 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: HTTP_STATUS.OK,
            message: MESSAGES.AUTH.SIGN_IN.SUCCEED,
            data: { accessToken: accessTokenSample, refreshToken: refreshTokenSample },
        });
    });

    // 토큰 재발급 기능
    test('refresh Method', async () => {
        /* 설정 부분 */
        // Service의 createAccessToken 메서드 반환값 형식 설정
        const accessTokenSample =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxODI1ODY1NSwiZXhwIjoxNzE4MzAxODU1fQ.a9KC5GlIVBB3vnQFQFUyru-0iS5kBLyZcyEOB07aa10';

        // Service의 createRefreshToken 메서드 반환값 형식 설정
        const refreshTokenSample =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxODI1ODY1NSwiZXhwIjoxNzE4ODYzNDU1fQ.wTxVaySCHrTxFiAj5TvgzNbLN9dtS9r0r8cfDkcddtw';

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

        // Service의 upsertRefreshToken 메서드 매개변수 설정
        const upsertRefreshTokenParams = {
            ip: '127.0.0.1',
            userAgent: 'Insomnia',
        };
        // Request 메서드 내용 채우기
        mockRequest.user = userInfoSample;
        mockRequest.ip = upsertRefreshTokenParams.ip;
        mockRequest.headers[AUTH_CONSTANT.USER_AGENT] = upsertRefreshTokenParams.userAgent;

        // Promise 객체들이 무조건 resolved 되었다는 가정
        // Service의 createAccessToken 메서드 반환값을 설정
        mockAuthService.createAccessToken.mockResolvedValue(accessTokenSample);
        // Service의 createRefreshToken 메서드 반환값을 설정
        mockAuthService.createRefreshToken.mockResolvedValue(refreshTokenSample);
        // Service의 upsertRefreshToken 메서드 반환값을 설정
        mockAuthService.upsertRefreshToken.mockResolvedValue();

        /* 실행 부분, Controller의 refresh 메서드 실행 */
        await authController.refresh(mockRequest, mockResponse, mockNext);

        /* 테스트(조건) 부분 */
        // Service의 createAccessToken 메서드가 1번만 실행되었는지 검사
        expect(mockAuthService.createAccessToken).toHaveBeenCalledTimes(1);
        // Service의 createAccessToken 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockAuthService.createAccessToken).toHaveBeenCalledWith(userInfoSample.userId);

        // Service의 createRefreshToken 메서드가 1번만 실행되었는지 검사
        expect(mockAuthService.createRefreshToken).toHaveBeenCalledTimes(1);
        // Service의 createRefreshToken 메서드에 데이터가 매개변수와 함께 호출되었는지 검사
        expect(mockAuthService.createRefreshToken).toHaveBeenCalledWith(userInfoSample.userId);

        // Service의 upsertRefreshToken 메서드가 1번만 실행되었는지 검사
        expect(mockAuthService.upsertRefreshToken).toHaveBeenCalledTimes(1);
        // Service의 upsertRefreshToken 메서드에 데이터가 매개변수와 함께 호출되었는지 검사
        expect(mockAuthService.upsertRefreshToken).toHaveBeenCalledWith(
            userInfoSample.userId,
            refreshTokenSample,
            upsertRefreshTokenParams.ip,
            upsertRefreshTokenParams.userAgent,
        );

        // Response의 status 메서드가 1번만 실행되었는지 검사
        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        // Response의 status 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);

        // Response의 json 메서드가 1번만 실행되었는지 검사
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        // Response의 json 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: HTTP_STATUS.CREATED,
            message: MESSAGES.AUTH.TOKEN_REFRESH.SUCCEED,
            data: { accessToken: accessTokenSample, refreshToken: refreshTokenSample },
        });
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
        // Request 메서드 내용 채우기
        mockRequest.user = userInfoSample;

        // Promise 객체들이 무조건 resolved 되었다는 가정
        // Service의 deleteRefreshToken 메서드 반환값을 설정
        mockAuthService.deleteRefreshToken.mockResolvedValue(userInfoSample.userId);

        /* 실행 부분, Controller의 signOut 메서드 실행 */
        await authController.signOut(mockRequest, mockResponse, mockNext);

        /* 테스트(조건) 부분 */
        // Service의 deleteRefreshToken 메서드가 1번만 실행되었는지 검사
        expect(mockAuthService.deleteRefreshToken).toHaveBeenCalledTimes(1);
        // Service의 deleteRefreshToken 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockAuthService.deleteRefreshToken).toHaveBeenCalledWith(userInfoSample.userId);

        // Response의 status 메서드가 1번만 실행되었는지 검사
        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        // Response의 status 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);

        // Response의 json 메서드가 1번만 실행되었는지 검사
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        // Response의 json 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: HTTP_STATUS.OK,
            message: MESSAGES.AUTH.SIGN_OUT.SUCCEED,
            data: { deletedTokenUserId: userInfoSample.userId },
        });
    });
});
