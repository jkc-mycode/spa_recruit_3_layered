import { beforeEach, describe, jest, test, expect } from '@jest/globals';
import { UserRepository } from '../../../src/repositories/user.repository';

const mockPrisma = {
    user: {
        findFirst: jest.fn(),
        create: jest.fn(),
    },
};

const userRepository = new UserRepository(mockPrisma);

describe('UserRepository Unit Test', () => {
    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다
    });

    // 사용자 생성 테스트 코드
    test('createUser Method', async () => {
        /* 설정 부분 */
        // Mocking된 Prisma 클라이언트의 create 메서드의 반환값 (임시 결과값)
        const mockReturn = 'create String';
        // Mocking된 Prisma 클라이언트의 create 메서드가 실행됐을 때, 반환되는 값 설정
        mockPrisma.user.create.mockReturnValue(mockReturn);
        const userInfoSample = {
            email: 'spartan@spartacodingclub.kr',
            password: 'aaaa4321!!',
            passwordConfirm: 'aaaa4321!!',
            name: '홍길동',
            age: 33,
            gender: 'MALE',
            profileImage: 'https://prismalens.vercel.app/header/logo-dark.svg',
        };

        const mockCreateParams = {
            data: {
                email: 'spartan@spartacodingclub.kr',
                password: 'aaaa4321!!',
                name: '홍길동',
                age: 33,
                gender: 'MALE',
                profileImage: 'https://prismalens.vercel.app/header/logo-dark.svg',
            },
        };

        /* 실행 부분, 실제 저장소(Repository)의  createUser 메서드 실행 */
        const user = await userRepository.createUser(
            userInfoSample.email,
            userInfoSample.password,
            userInfoSample.name,
            userInfoSample.age,
            userInfoSample.gender,
            userInfoSample.profileImage,
        );

        /* 테스트(조건) 부분 */
        // 모킹된 Prisma의 create 메서드가 1번만 실행되는지 검사
        expect(mockPrisma.user.create).toHaveBeenCalledTimes(1);
        // 모킹된 Prisma의 create 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockPrisma.user.create).toHaveBeenCalledWith(mockCreateParams);
        // Repository의 createUser 메서드의 반환값 user와
        // 모킹된 Prisma의 create 메서드의 반환갑 mockReturn이 같은지 검사
        expect(user).toBe(mockReturn);
    });

    // 사용자 ID로 사용자 조회 테스트 코드
    test('getUserInfoById Method', async () => {
        /* 설정 부분 */
        // Mocking된 Prisma 클라이언트의 findFirst 메서드의 반환값 (임시 결과값)
        const mockReturn = 'findFirst String';
        // Mocking된 Prisma 클라이언트의 findFirst 메서드가 실행됐을 때, 반환되는 값 설정
        mockPrisma.user.findFirst.mockReturnValue(mockReturn);

        /* 실행 부분, 실제 저장소(Repository)의  getUserInfoById 메서드 실행 */
        const userId = 1;
        const user = await userRepository.getUserInfoById(userId);

        /* 테스트(조건) 부분 */
        // Repository의 getUserInfoById 메서드의 반환값 user와
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

    // 사용자 Email로 사용자 조회 테스트 코드
    test('getUserInfoByEmail Method', async () => {
        /* 설정 부분 */
        // Mocking된 Prisma 클라이언트의 findFirst 메서드의 반환값 (임시 결과값)
        const mockReturn = 'findFirst String';
        // Mocking된 Prisma 클라이언트의 findFirst 메서드가 실행됐을 때, 반환되는 값 설정
        mockPrisma.user.findFirst.mockReturnValue(mockReturn);

        /* 실행 부분, 실제 저장소(Repository)의  getUserInfoByEmail 메서드 실행 */
        const email = 'spartan@spartacodingclub.kr';
        const user = await userRepository.getUserInfoByEmail(email);

        /* 테스트(조건) 부분 */
        // Repository의 getUserInfoByEmail 메서드의 반환값 user와
        // 모킹된 Prisma의 findFirst 메서드의 반환갑 mockReturn이 같은지 검사
        expect(user).toBe(mockReturn);
        // 모킹된 Prisma의 findFirst 메서드가 1번만 실행되는지 검사
        expect(mockPrisma.user.findFirst).toHaveBeenCalledTimes(1);
        // 모킹된 Prisma의 findFirst 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
            where: { email },
        });
    });
});
