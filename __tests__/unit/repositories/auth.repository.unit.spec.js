import { beforeEach, describe, jest, test, expect } from '@jest/globals';
import { AuthRepository } from '../../../src/repositories/auth.repository.js';

const mockPrisma = {
    refreshToken: {
        findFirst: jest.fn(),
        upsert: jest.fn(),
        delete: jest.fn(),
    },
};

const authRepository = new AuthRepository(mockPrisma);

describe('AuthRepository Unit Test', () => {
    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다
    });

    // 기존 토큰이 있으면 업데이트 없으면 생성 테스트 코드
    test('upsertRefreshToken Method', async () => {
        /* 설정 부분 */
        // Repository의 upsertRefreshToken 메서드 매개변수 임시 값 설정
        const upsertRefreshTokenParams = {
            userId: 1,
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcxODE3OTYxNCwiZXhwIjoxNzE4Nzg0NDE0fQ.EfW5fB8WSKWl3nJPcnLszl_VRDQL-m80crrb4DEGKX4',
            ip: '::ffff:127.0.0.1',
            userAgent: 'insomnia/9.2.0',
        };

        /* 실행 부분, 실제 저장소(Repository)의  upsertRefreshToken 메서드 실행 */
        await authRepository.upsertRefreshToken(
            upsertRefreshTokenParams.userId,
            upsertRefreshTokenParams.token,
            upsertRefreshTokenParams.ip,
            upsertRefreshTokenParams.userAgent,
        );

        /* 테스트(조건) 부분 */
        // 모킹된 Prisma의 upsert 메서드가 1번만 실행되었는지 검사
        expect(mockPrisma.refreshToken.upsert).toHaveBeenCalledTimes(1);
        // 모킹된 Prisma의 upsert 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockPrisma.refreshToken.upsert).toHaveBeenCalledWith({
            where: { userId: upsertRefreshTokenParams.userId },
            update: { token: upsertRefreshTokenParams.token, createdAt: expect.any(Date) },
            create: {
                userId: upsertRefreshTokenParams.userId,
                token: upsertRefreshTokenParams.token,
                ip: upsertRefreshTokenParams.ip,
                userAgent: upsertRefreshTokenParams.userAgent,
            },
        });
    });

    // DB에 저장된 RefreshToken를 조회
    test('getRefreshToken Method', async () => {
        /* 설정 부분 */
        // 모킹된 Prisma의 findFirst 메서드 임시 결과값
        const refreshTokenSample = {
            tokenId: 1,
            userId: 1,
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcxODE3OTYxNCwiZXhwIjoxNzE4Nzg0NDE0fQ.EfW5fB8WSKWl3nJPcnLszl_VRDQL-m80crrb4DEGKX4',
            ip: '::ffff:127.0.0.1',
            userAgent: 'insomnia/9.2.0',
            createdAt: '2024-06-09T13:56:19.906Z',
        };
        // 모킹된 Prisma의 findFirst 메서드의 실행 결과값 설정
        mockPrisma.refreshToken.findFirst.mockReturnValue(refreshTokenSample);

        /* 실행 부분, 실제 저장소(Repository)의  getRefreshToken 메서드 실행 */
        const refreshToken = await authRepository.getRefreshToken(refreshTokenSample.userId);

        /* 테스트(조건) 부분 */
        // 모킹된 Prisma의 findFirst 메서드가 1번만 실행되었는지 검사
        expect(mockPrisma.refreshToken.findFirst).toHaveBeenCalledTimes(1);
        // 모킹된 Prisma의 findFirst 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockPrisma.refreshToken.findFirst).toHaveBeenCalledWith({
            where: { userId: refreshTokenSample.userId },
        });
        // Repository의 getRefreshToken 메서드 결과값과
        // 모킹된 Prisma의 findFirst 메서드의 결과값이 같은지 검사
        expect(refreshToken).toEqual(refreshTokenSample);
    });

    // DB에서 Refresh Token 삭제
    test('deleteRefreshToken Method', async () => {
        /* 설정 부분 */
        // 모킹된 Prisma의 findFirst 메서드 임시 결과값
        const refreshTokenSample = {
            userId: 1,
        };
        // 모킹된 Prisma의 findFirst 메서드의 실행 결과값 설정
        mockPrisma.refreshToken.delete.mockReturnValue(refreshTokenSample);

        /* 실행 부분, 실제 저장소(Repository)의  deleteRefreshToken 메서드 실행 */
        const deletedTokenUserId = await authRepository.deleteRefreshToken(refreshTokenSample.userId);

        /* 테스트(조건) 부분 */
        // 모킹된 Prisma의 delete 메서드가 1번만 실행되었는지 검사
        expect(mockPrisma.refreshToken.delete).toHaveBeenCalledTimes(1);
        // 모킹된 Prisma의 delete 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockPrisma.refreshToken.delete).toHaveBeenCalledWith({
            where: { userId: refreshTokenSample.userId },
            select: { userId: true },
        });
        // Repository의 deleteRefreshToken 메서드의 결과값과
        // 모킹된 Prisma의 delete 메서드의 결과값이 같은지 검사
        expect(deletedTokenUserId).toEqual(refreshTokenSample);
    });
});
