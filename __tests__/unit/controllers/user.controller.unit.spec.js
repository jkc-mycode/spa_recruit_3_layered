import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { UserController } from '../../../src/controllers/user.controller';
import { HTTP_STATUS } from '../../../src/constants/http-status.constant';
import { MESSAGES } from '../../../src/constants/message.constant';

// TODO: template 이라고 되어 있는 부분을 다 올바르게 수정한 후 사용해야 합니다.

const mockUserService = {
    getUserInfo: jest.fn(),
};

const mockRequest = {
    user: jest.fn(),
};

const mockResponse = {
    status: jest.fn(),
    json: jest.fn(),
};

const userController = new UserController(mockUserService);

describe('UserController Unit Test', () => {
    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다.

        // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
        mockResponse.status.mockReturnValue(mockResponse);
    });

    // 사용자 ID로 사용자 조회 테스트 코드
    test('getUserInfo Method', async () => {
        /* 설정 부분 */
        // Service의 getUserInfo 메서드 임시 결과값
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
        // 요청(Request)의 body에 입력할 인자값 설정
        mockRequest.user = userInfoSample;

        // Service의 getUserInfo 메서드 반환값 설정
        mockUserService.getUserInfo.mockReturnValue(userInfoSample);

        /* 실행 부분, 실제 저장소(Repository)의  getUserInfo 메서드 실행 */
        await userController.getUserInfo(mockRequest, mockResponse);

        /* 테스트(조건) 부분 */
        // Mocking된 응답(Response)의 status 메서드가 1번만 실행되는지 검사
        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        // Mocking된 응답(Response)의 status 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);

        // Response json  검증
        // Mocking된 응답(Response)의 json 메서드가 1번만 실행되는지 검사
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        // Mocking된 응답(Response)의 json 메서드를 실행할 때,
        // Service의 getUserInfo 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: HTTP_STATUS.OK,
            message: MESSAGES.USER.READ.SUCCEED,
            data: {
                user: userInfoSample,
            },
        });
    });
});
