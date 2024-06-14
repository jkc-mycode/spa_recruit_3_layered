import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { AuthController } from '../../../src/controllers/auth.controller.js';
import { AUTH_CONSTANT } from '../../../src/constants/auth.constant.js';
import { HTTP_STATUS } from '../../../src/constants/http-status.constant.js';
import { MESSAGES } from '../../../src/constants/message.constant.js';

const mockAuthService = {
    signUp: jest.fn(),
    signIn: jest.fn(),
    refresh: jest.fn(),
    signOut: jest.fn(),
    getRefreshToken: jest.fn(),
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
        const signUpRequestBodyParams = {
            email: 'spartan@spartacodingclub.kr',
            password: 'aaaa4321!!',
            passwordConfirm: 'aaaa4321!!',
            name: '스파르탄',
            age: 28,
            gender: 'MALE',
            profileImage: 'https://prismalens.vercel.app/header/logo-dark.svg',
        };
        // Request의 body에 입력할 인자값 설정
        mockRequest.body = signUpRequestBodyParams;

        // Service의 createUser 메서드 반환값 형식 설정
        const userInfoSample = {
            userId: 1,
            email: signUpRequestBodyParams.email,
            name: signUpRequestBodyParams.name,
            age: signUpRequestBodyParams.age,
            gender: signUpRequestBodyParams.gender,
            role: 'APPLICANT',
            profileImage: signUpRequestBodyParams.profileImage,
            createdAt: '2024-06-13T08:53:46.951Z',
            updatedAt: '2024-06-13T08:53:46.951Z',
        };

        // Auth Service의 createUser 메서드 반환값을 설정
        mockAuthService.signUp.mockResolvedValue(userInfoSample);

        /* 실행 부분, Controller의 signUp 메서드 실행 */
        await authController.signUp(mockRequest, mockResponse, mockNext);

        /* 테스트(조건) 부분 */
        // Auth Service의 signUp 메서드가 1번만 실행되었는지 검사
        expect(mockAuthService.signUp).toHaveBeenCalledTimes(1);
        // Auth Service의 signUp 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockAuthService.signUp).toHaveBeenCalledWith(
            signUpRequestBodyParams.email,
            signUpRequestBodyParams.password,
            signUpRequestBodyParams.passwordConfirm,
            signUpRequestBodyParams.name,
            signUpRequestBodyParams.age,
            signUpRequestBodyParams.gender,
            signUpRequestBodyParams.profileImage,
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

        // Auth Service의 signIn 메서드 매개변수 설정
        const signInParams = {
            ip: '127.0.0.1',
            userAgent: 'Insomnia',
        };
        // Request 메서드 내용 채우기
        mockRequest.ip = signInParams.ip;
        mockRequest.headers[AUTH_CONSTANT.USER_AGENT] = signInParams.userAgent;

        // Auth Service의 signIn 메서드 임시 반환값
        const accessToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxODI1ODY1NSwiZXhwIjoxNzE4MzAxODU1fQ.a9KC5GlIVBB3vnQFQFUyru-0iS5kBLyZcyEOB07aa10';
        const refreshToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxODI1ODY1NSwiZXhwIjoxNzE4ODYzNDU1fQ.wTxVaySCHrTxFiAj5TvgzNbLN9dtS9r0r8cfDkcddtw';

        // Service의 signIn 메서드 반환값을 설정
        mockAuthService.signIn.mockReturnValue([accessToken, refreshToken]);

        /* 실행 부분, Controller의 signIn 메서드 실행 */
        await authController.signIn(mockRequest, mockResponse, mockNext);

        /* 테스트(조건) 부분 */
        // Auth Service의 signIn 메서드가 1번만 실행되었는지 검사
        expect(mockAuthService.signIn).toHaveBeenCalledTimes(1);
        // Auth Service의 signIn 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockAuthService.signIn).toHaveBeenCalledWith(
            signInRequestBodyParams.email,
            signInRequestBodyParams.password,
            signInParams.ip,
            signInParams.userAgent,
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
            data: { accessToken, refreshToken },
        });
    });

    // 토큰 재발급 기능
    test('refresh Method', async () => {
        /* 설정 부분 */
        // Service의 createAccessToken 메서드 반환값 형식 설정
        const accessToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxODI1ODY1NSwiZXhwIjoxNzE4MzAxODU1fQ.a9KC5GlIVBB3vnQFQFUyru-0iS5kBLyZcyEOB07aa10';

        // Service의 createRefreshToken 메서드 반환값 형식 설정
        const refreshToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxODI1ODY1NSwiZXhwIjoxNzE4ODYzNDU1fQ.wTxVaySCHrTxFiAj5TvgzNbLN9dtS9r0r8cfDkcddtw';

        // req.user 객체 형식 설정
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

        // Service의 refresh 메서드 매개변수 설정
        const refreshParams = {
            ip: '127.0.0.1',
            userAgent: 'Insomnia',
        };
        // Request 메서드 내용 채우기
        mockRequest.user = userInfoSample;
        mockRequest.ip = refreshParams.ip;
        mockRequest.headers[AUTH_CONSTANT.USER_AGENT] = refreshParams.userAgent;

        // Auth Service의 refresh 메서드 반환값을 설정
        mockAuthService.refresh.mockReturnValue([accessToken, refreshToken]);

        /* 실행 부분, Controller의 refresh 메서드 실행 */
        await authController.refresh(mockRequest, mockResponse, mockNext);

        /* 테스트(조건) 부분 */
        // Auth Service의 refresh 메서드가 1번만 실행되었는지 검사
        expect(mockAuthService.refresh).toHaveBeenCalledTimes(1);
        // Auth Service의 refresh 메서드에 데이터가 매개변수와 함께 호출되었는지 검사
        expect(mockAuthService.refresh).toHaveBeenCalledWith(
            userInfoSample.userId,
            refreshParams.ip,
            refreshParams.userAgent,
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
            data: { accessToken, refreshToken },
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

        // Service의 signOut 메서드 반환값을 설정
        mockAuthService.signOut.mockResolvedValue(userInfoSample.userId);

        /* 실행 부분, Controller의 signOut 메서드 실행 */
        await authController.signOut(mockRequest, mockResponse, mockNext);

        /* 테스트(조건) 부분 */
        // Service의 signOut 메서드가 1번만 실행되었는지 검사
        expect(mockAuthService.signOut).toHaveBeenCalledTimes(1);
        // Service의 signOut 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockAuthService.signOut).toHaveBeenCalledWith(userInfoSample.userId);

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
