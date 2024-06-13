import { beforeEach, describe, jest, test, expect } from '@jest/globals';
import { UserRepository } from '../../../src/repositories/user.repository';

const mockPrisma = {
    user: {
        findFirst: jest.fn(),
    },
};

const userRepository = new UserRepository(mockPrisma);

describe('UserRepository Unit Test', () => {
    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다
    });

    // 사용자 ID로 사용자 조회 테스트 코드
    test('getUserInfo Method', async () => {
        /* 설정 부분 */
        // Mocking된 Prisma 클라이언트의 findFirst 메서드의 반환값 (임시 결과값)
        const mockReturn = 'findFirst String';
        // Mocking된 Prisma 클라이언트의 findFirst 메서드가 실행됐을 때, 반환되는 값 설정
        mockPrisma.user.findFirst.mockReturnValue(mockReturn);

        /* 실행 부분, 실제 저장소(Repository)의  getUserInfo 메서드 실행 */
        const userId = 1;
        const user = await userRepository.getUserInfo(userId);

        /* 테스트(조건) 부분 */
        // Repository의 getUserInfo 메서드의 반환값 user와
        // 모킹된 Prisma의 findFirst 메서드의 반환갑 mockReturn이 같은지 검사
        expect(user).toBe(mockReturn);
        // 모킹된 Prisma의 findFirst 메서드가 1번만 실행되는지 검사
        expect(mockPrisma.user.findFirst).toHaveBeenCalledTimes(1);
        // 모킹된 Prisma의 findFirst 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
            where: { userId },
            omit: { password: true },
        });
    });
});
