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

    // 이메일로 사용자 정보 조회 테스트 코드
    // test('getUserByEmail Method', async () => {
    //     /* 설정 부분 */
    //     // 모킹된 Prisma의 findFirst 메서드 임시 결과값
    //     const userInfoSample = {
    //         userId: 1,
    //         email: 'spartan@spartacodingclub.kr',
    //         name: '스파르탄',
    //         age: 28,
    //         gender: 'MALE',
    //         role: 'RECRUITER',
    //         profileImage: 'https://prismalens.vercel.app/header/logo-dark.svg',
    //         createdAt: '2024-06-09T13:56:19.906Z',
    //         updatedAt: '2024-06-09T13:56:19.906Z',
    //     };
    //     // 모킹된 Prisma의 findFirst 메서드의 결과값 설정
    //     mockPrisma.user.findFirst.mockReturnValue(userInfoSample);

    //     /* 실행 부분, Repository의  getUserByEmail 메서드 실행 */
    //     const user = await authRepository.getUserByEmail(userInfoSample.email);

    //     /* 테스트(조건) 부분 */
    //     // Repository의 getUserByEmail 메서드 결과값과
    //     // 모킹된 Prisma의 findFirst 메서드 결과값이 같은지 검사
    //     expect(user).toBe(userInfoSample);
    //     // 모킹된 Prisma의 findFirst 메서드가 1번만 실행되었는지 검사
    //     expect(mockPrisma.user.findFirst).toHaveBeenCalledTimes(1);
    //     // 모킹된 Prisma의 findFirst 메서드가 매개변수와 함께 호출되었는지 검사
    //     expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
    //         where: { email: userInfoSample.email },
    //     });
    // });

    // // 사용자 생성
    // test('createUser Method', async () => {
    //     /* 설정 부분 */
    //     // 모킹된 Prisma의 findFirst 메서드 임시 결과값
    //     const userInfoSample = {
    //         userId: 1,
    //         email: 'spartan@spartacodingclub.kr',
    //         name: '스파르탄',
    //         age: 28,
    //         gender: 'MALE',
    //         role: 'RECRUITER',
    //         profileImage: 'https://prismalens.vercel.app/header/logo-dark.svg',
    //         createdAt: '2024-06-09T13:56:19.906Z',
    //         updatedAt: '2024-06-09T13:56:19.906Z',
    //     };
    //     // 모킹된 Prisma의 findFirst 메서드의 결과값 설정
    //     mockPrisma.user.create.mockReturnValue(userInfoSample);

    //     // Repository의 createUser 메서드 매개변수 임시 값 설정
    //     const createUserParams = {
    //         email: 'spartan44@spartacodingclub.kr',
    //         password: 'aaaa4321!!',
    //         name: '스파르탄44',
    //         age: 28,
    //         gender: 'MALE',
    //         profileImage: 'https://prismalens.vercel.app/header/logo-dark.svg',
    //     };

    //     /* 실행 부분, 실제 저장소(Repository)의  getUserInfo 메서드 실행 */
    //     const user = await authRepository.createUser(
    //         createUserParams.email,
    //         createUserParams.password,
    //         createUserParams.name,
    //         createUserParams.age,
    //         createUserParams.gender,
    //         createUserParams.profileImage,
    //     );

    //     /* 테스트(조건) 부분 */
    //     // Repository의 createUser 메서드의 결과값과
    //     // 모킹된 Prisma의 create 메서드의 결과값이 같은지 검사
    //     expect(user).toBe(userInfoSample);
    //     // 모킹된 Prisma의 create 메서드가 1번만 실행되었는지 검사
    //     expect(mockPrisma.user.create).toHaveBeenCalledTimes(1);
    //     // 모킹된 Prisma의 create 메서드가 매개변수와 함께 호출되었는지 검사
    //     expect(mockPrisma.user.create).toHaveBeenCalledWith({
    //         data: {
    //             email: createUserParams.email,
    //             password: createUserParams.password,
    //             name: createUserParams.name,
    //             age: createUserParams.age,
    //             gender: createUserParams.gender,
    //             profileImage: createUserParams.profileImage,
    //         },
    //     });
    // });

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

    // 사용자 ID로 사용자 조회
    // test('getUserInfo Method', async () => {
    //     /* 설정 부분 */
    //     // 모킹된 Prisma의 findFirst 메서드 임시 결과값
    //     const userInfoSample = {
    //         userId: 1,
    //         email: 'spartan@spartacodingclub.kr',
    //         name: '스파르탄',
    //         age: 28,
    //         gender: 'MALE',
    //         role: 'RECRUITER',
    //         profileImage: 'https://prismalens.vercel.app/header/logo-dark.svg',
    //         createdAt: '2024-06-09T13:56:19.906Z',
    //         updatedAt: '2024-06-09T13:56:19.906Z',
    //     };
    //     // 모킹된 Prisma의 findFirst 메서드의 결과값 설정
    //     mockPrisma.user.findFirst.mockReturnValue(userInfoSample);

    //     /* 실행 부분, 실제 저장소(Repository)의  getUserInfo 메서드 실행 */
    //     const user = await authRepository.getUserInfo(userInfoSample.userId);

    //     /* 테스트(조건) 부분 */
    //     // Repository의 getUerInfo 메서드 결과값과
    //     // 모킹된 Prisma의 findFirst 메서드 결과값이 같은지 검사
    //     expect(user).toBe(userInfoSample);
    //     // 모킹된 Prisma의 findFirst 메서드가 1번만 실행되는지 검사
    //     expect(mockPrisma.user.findFirst).toHaveBeenCalledTimes(1);
    //     // 모킹된 Prisma의 findFirst 메서드에 조건절이 잘 들어가는지 검사
    //     expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
    //         where: { userId: userInfoSample.userId },
    //         omit: { password: true },
    //     });
    // });

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
