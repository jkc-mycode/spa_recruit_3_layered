import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { UserService } from '../../../src/services/user.service';

const mockUserRepository = {
    getUserInfo: jest.fn(),
};

const userService = new UserService(mockUserRepository);

describe('UserService Unit Test', () => {
    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
    });

    // 사용자 ID로 사용자 조회 테스트 코드
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
        // Repository의 getUserInfo 메서드 반환값 설정
        mockUserRepository.getUserInfo.mockReturnValue(userInfoSample);

        /* 실행 부분, 실제 저장소(Repository)의  getUserInfo 메서드 실행 */
        const userId = 1;
        const user = await userService.getUserInfo(userId);

        /* 테스트(조건) 부분 */
        // Service의 getUserInfo 메서드 실행 결과값 user와
        // Repository의 getUserInfo 메서드 실행 결과값 userInfoSample과 같은지 검사
        expect(user).toBe(userInfoSample);
        // Repository의 getUserInfo 메서드가 1번만 실행되었는지 검사
        expect(mockUserRepository.getUserInfo).toHaveBeenCalledTimes(1);
        // Repository의 getUserInfo 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockUserRepository.getUserInfo).toHaveBeenCalledWith(userId);
    });
});
