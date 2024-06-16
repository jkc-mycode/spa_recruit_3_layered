import { beforeEach, describe, jest, test, expect } from '@jest/globals';
import { ResumeRepository } from '../../../src/repositories/resume.repository';
import { RESUME_CONSTANT } from '../../../src/constants/resume.constant';

const mockPrisma = {
    resume: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    resumeHistory: {
        create: jest.fn(),
        findMany: jest.fn(),
    },
    $transaction: jest.fn(),
};

const resumeRepository = new ResumeRepository(mockPrisma);

describe('ResumeRepository Unit Test', () => {
    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다
    });

    // 이력서 생성
    test('createResume Method', async () => {
        /* 설정 부분 */
        // Resume Repository의 createResume 메서드 매개변수 임시값
        const createResumeParams = {
            userId: 1,
            title: '제목 테스트',
            introduce: '자기소개 테스트',
        };
        // 모킹된 Prisma의 create 메서드의 임시 반환값
        const resumeSample = {
            resumeId: 12,
            userId: 1,
            title: '스파르탄 자기소개',
            introduce: '열심히 화이팅 화이팅!! ',
            state: 'APPLY',
            createdAt: '2024-06-14T07:15:16.397Z',
            updatedAt: '2024-06-14T07:15:16.397Z',
        };
        // 모킹된 Prisma의 create 메서드의 결과값 설정
        mockPrisma.resume.create.mockReturnValue(resumeSample);

        /* 실행 부분, 실제 Resume Repository의  createResume 메서드 실행 */
        const resume = await resumeRepository.createResume(
            createResumeParams.userId,
            createResumeParams.title,
            createResumeParams.introduce,
        );

        /* 테스트(조건) 부분 */
        // 모킹된 Prisma resume의 create 메서드가 1번만 실행되었는지 검사
        expect(mockPrisma.resume.create).toHaveBeenCalledTimes(1);
        // 모킹된 Prisma resume의 create 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockPrisma.resume.create).toHaveBeenCalledWith({
            data: createResumeParams,
        });
        // createResume 메서드의 실행 결과값과
        // 모킹된 Prisma resume의 create 메서드의 결과값이 같은지 검사
        expect(resume).toEqual(resumeSample);
    });

    // 이력서 목록 조회
    test('getResumeList Method', async () => {
        /* 설정 부분 */
        // Resume Repository의 getResumeList 메서드 매개변수 임시값
        const getResumeListParams = {
            whereCondition: { userId: 1 },
            sortType: 'DESC',
        };
        // 모킹된 Prisma의 findMany 메서드의 임시 반환값
        let resumesSample = [
            {
                resumeId: 12,
                userName: '스파르탄',
                title: '스파르탄 자기소개',
                introduce: '열심히 화이팅 화이팅!! ',
                state: 'APPLY',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                resumeId: 13,
                userName: '스파르탄',
                title: '스파르탄 자기소개',
                introduce: '열심히 화이팅 화이팅!! ',
                state: 'APPLY',
                createdAt: new Date(new Date().getTime() + 1000),
                updatedAt: new Date(new Date().getTime() + 1000),
            },
        ];
        // 이력서 목록 정렬
        resumesSample = resumesSample.sort((a, b) => b.createdAt - a.createdAt);

        // 모킹된 Prisma의 findMany 메서드의 결과값 설정
        mockPrisma.resume.findMany.mockReturnValue(resumesSample);

        /* 실행 부분, 실제 Resume Repository의  getResumeList 메서드 실행 */
        const resume = await resumeRepository.getResumeList(
            getResumeListParams.whereCondition,
            getResumeListParams.sortType,
        );

        /* 테스트(조건) 부분 */
        // 모킹된 Prisma resume의 findMany 메서드가 1번만 실행되었는지 검사
        expect(mockPrisma.resume.findMany).toHaveBeenCalledTimes(1);
        // 모킹된 Prisma resume의 findMany 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockPrisma.resume.findMany).toHaveBeenCalledWith({
            where: getResumeListParams.whereCondition,
            include: { user: true },
            orderBy: { createdAt: getResumeListParams.sortType },
        });
        // getResumeList 메서드의 실행 결과값과
        // 모킹된 Prisma resume의 create 메서드의 결과값이 같은지 검사
        expect(resume).toEqual(resumesSample);
    });

    // 이력서 상세 조회
    test('getResumeDetail Method', async () => {
        /* 설정 부분 */
        // Resume Repository의 getResumeDetail 메서드 매개변수 임시값
        const getResumeDetailParams = {
            whereCondition: { resumeId: 1 },
            includeUser: false,
        };
        // 모킹된 Prisma의 findMany 메서드의 임시 반환값
        const resumeSample = {
            resumeId: 12,
            userName: '스파르탄',
            title: '스파르탄 자기소개',
            introduce: '열심히 화이팅 화이팅!! ',
            state: 'APPLY',
            createdAt: '2024-06-14T07:15:16.397Z',
            updatedAt: '2024-06-14T07:15:16.397Z',
        };
        // 모킹된 Prisma의 findFirst 메서드의 결과값 설정
        mockPrisma.resume.findFirst.mockReturnValue(resumeSample);

        /* 실행 부분, 실제 Resume Repository의  getResumeDetail 메서드 실행 */
        const resume = await resumeRepository.getResumeDetail(
            getResumeDetailParams.whereCondition,
            getResumeDetailParams.includeUser,
        );

        /* 테스트(조건) 부분 */
        // 모킹된 Prisma resume의 findFirst 메서드가 1번만 실행되었는지 검사
        expect(mockPrisma.resume.findFirst).toHaveBeenCalledTimes(1);
        // 모킹된 Prisma resume의 findFirst 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockPrisma.resume.findFirst).toHaveBeenCalledWith({
            where: getResumeDetailParams.whereCondition,
            include: { user: getResumeDetailParams.includeUser },
        });
        // getResumeDetail 메서드의 실행 결과값과
        // 모킹된 Prisma resume의 create 메서드의 결과값이 같은지 검사
        expect(resume).toEqual(resumeSample);
    });

    // 이력서 수정
    test('updateResume Method', async () => {
        /* 설정 부분 */
        // Resume Repository의 updateResume 메서드 매개변수 임시값
        const updateResumeParams = {
            whereCondition: { resumeId: 12, userId: 1 },
            title: '제목 테스트',
            introduce: '자기소개 테스트',
        };
        // 모킹된 Prisma의 update 메서드의 임시 반환값
        const resumeSample = {
            resumeId: 12,
            userId: 1,
            title: '스파르탄 자기소개',
            introduce: '열심히 화이팅 화이팅!! ',
            state: 'APPLY',
            createdAt: '2024-06-14T07:15:16.397Z',
            updatedAt: '2024-06-14T07:15:16.397Z',
        };
        // 모킹된 Prisma의 update 메서드의 결과값 설정
        mockPrisma.resume.update.mockReturnValue(resumeSample);

        /* 실행 부분, 실제 Resume Repository의  updateResume 메서드 실행 */
        const updatedResume = await resumeRepository.updateResume(
            updateResumeParams.whereCondition,
            updateResumeParams.title,
            updateResumeParams.introduce,
        );

        /* 테스트(조건) 부분 */
        // 모킹된 Prisma resume의 update 메서드가 1번만 실행되었는지 검사
        expect(mockPrisma.resume.update).toHaveBeenCalledTimes(1);
        // 모킹된 Prisma resume의 update 메서드가 매개변수와 함께 호출되었는지 검사
        const title = updateResumeParams.title;
        const introduce = updateResumeParams.introduce;
        expect(mockPrisma.resume.update).toHaveBeenCalledWith({
            where: updateResumeParams.whereCondition,
            data: {
                ...(title && { title }),
                ...(introduce && { introduce }),
            },
        });
        // updateResume 메서드의 실행 결과값과
        // 모킹된 Prisma resume의 create 메서드의 결과값이 같은지 검사
        expect(updatedResume).toEqual(resumeSample);
    });

    // 이력서 삭제
    test('deleteResume Method', async () => {
        /* 설정 부분 */
        // Resume Repository의 deleteResume 메서드 매개변수 임시값
        const deleteResumeParams = {
            whereCondition: { resumeId: 12, userId: 1 },
        };
        // 모킹된 Prisma의 delete 메서드의 임시 반환값
        const resumeSample = { resumeId: 12 };
        // 모킹된 Prisma의 delete 메서드의 결과값 설정
        mockPrisma.resume.delete.mockReturnValue(resumeSample);

        /* 실행 부분, 실제 Resume Repository의  deleteResume 메서드 실행 */
        const deletedResumeId = await resumeRepository.deleteResume(deleteResumeParams.whereCondition);

        /* 테스트(조건) 부분 */
        // 모킹된 Prisma resume의 delete 메서드가 1번만 실행되었는지 검사
        expect(mockPrisma.resume.delete).toHaveBeenCalledTimes(1);
        // 모킹된 Prisma resume의 delete 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockPrisma.resume.delete).toHaveBeenCalledWith({
            where: deleteResumeParams.whereCondition,
            select: { resumeId: true },
        });
        // deleteResume 메서드의 실행 결과값과
        // 모킹된 Prisma resume의 create 메서드의 결과값이 같은지 검사
        expect(deletedResumeId).toEqual(resumeSample);
    });

    // 이력서 상태 변경
    test('updateResumeState Method', async () => {
        /* 설정 부분 */
        // Resume Repository의 updateResumeState 메서드 매개변수 임시값
        const updateResumeStateParams = {
            userId: 2,
            resumeId: 22,
            oldState: RESUME_CONSTANT.RESUME_STATE.APPLY,
            newState: RESUME_CONSTANT.RESUME_STATE.PASS,
            reason: '서류 통과',
        };
        // 모킹된 Prisma의 update 메서드의 임시 반환값
        const resumeLogSample = {
            resumeLogId: 7,
            resumeId: updateResumeStateParams.resumeId,
            recruiterId: updateResumeStateParams.userId,
            oldState: RESUME_CONSTANT.RESUME_STATE.APPLY,
            newState: RESUME_CONSTANT.RESUME_STATE.PASS,
            reason: updateResumeStateParams.reason,
            createdAt: new Date(),
        };
        // 모킹된 Prisma의 create 메서드의 결과값 설정
        mockPrisma.resumeHistory.create.mockReturnValue(resumeLogSample);

        // 모킹된 Prisma의 $transaction 메서드의 결과값 설정
        mockPrisma.$transaction.mockImplementation(async (tx) => {
            return await tx(mockPrisma);
        });

        /* 실행 부분, 실제 Resume Repository의  updateResumeState 메서드 실행 */
        const resumeLog = await resumeRepository.updateResumeState(
            updateResumeStateParams.userId,
            updateResumeStateParams.resumeId,
            updateResumeStateParams.oldState,
            updateResumeStateParams.newState,
            updateResumeStateParams.reason,
        );

        /* 테스트(조건) 부분 */
        // 모킹된 Prisma $transaction 메서드가 1번만 실행되었는지 검사
        expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);

        // 모킹된 Prisma resume의 update 메서드가 1번만 실행되었는지 검사
        expect(mockPrisma.resume.update).toHaveBeenCalledTimes(1);
        // 모킹된 Prisma resume의 update 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockPrisma.resume.update).toHaveBeenCalledWith({
            where: { resumeId: updateResumeStateParams.resumeId },
            data: { state: updateResumeStateParams.newState },
        });

        // 모킹된 Prisma resume의 create 메서드가 1번만 실행되었는지 검사
        expect(mockPrisma.resumeHistory.create).toHaveBeenCalledTimes(1);
        // 모킹된 Prisma resume의 create 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockPrisma.resumeHistory.create).toHaveBeenCalledWith({
            data: {
                recruiterId: resumeLogSample.recruiterId,
                resumeId: resumeLogSample.resumeId,
                oldState: resumeLogSample.oldState,
                newState: resumeLogSample.newState,
                reason: resumeLogSample.reason,
            },
        });

        // updateResumeState 메서드의 실행 결과값과
        // 모킹된 Prisma resumeHistory의 create 메서드의 결과값이 같은지 검사
        expect(resumeLog).toEqual(resumeLogSample);
    });

    // 이력서 로그 조회
    test('getResumeStateLog Method', async () => {
        /* 설정 부분 */
        // Resume Repository의 getResumeStateLog 메서드 매개변수 임시값
        const getResumeStateLogParams = {
            resumeId: 11,
        };
        // 모킹된 Prisma의 findMany 메서드의 임시 반환값
        let resumeLogsSample = [
            {
                resumeLogId: 4,
                userName: '스파르탄',
                resumeId: 11,
                oldState: 'APPLY',
                newState: 'PASS',
                reason: '서류 심사 통과!',
                createdAt: new Date(),
            },
            {
                resumeLogId: 5,
                userName: '스파르탄',
                resumeId: 11,
                oldState: 'PASS',
                newState: 'INTERVIEW1',
                reason: '1차 면접 통과!',
                createdAt: new Date(new Date().getTime() + 1000),
            },
        ];
        // 이력서 목록 정렬
        resumeLogsSample = resumeLogsSample.sort((a, b) => b.createdAt - a.createdAt);

        // 모킹된 Prisma의 findMany 메서드의 결과값 설정
        mockPrisma.resumeHistory.findMany.mockReturnValue(resumeLogsSample);

        /* 실행 부분, 실제 Resume Repository의  getResumeStateLog 메서드 실행 */
        const resumeLogs = await resumeRepository.getResumeStateLog(getResumeStateLogParams.resumeId);

        /* 테스트(조건) 부분 */
        // 모킹된 Prisma resumeHistory findMany 메서드가 1번만 실행되었는지 검사
        expect(mockPrisma.resumeHistory.findMany).toHaveBeenCalledTimes(1);
        // 모킹된 Prisma resumeHistory findMany 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockPrisma.resumeHistory.findMany).toHaveBeenCalledWith({
            where: { resumeId: getResumeStateLogParams.resumeId },
            include: { user: true },
            orderBy: { createdAt: RESUME_CONSTANT.SORT_TYPE.DESC },
        });
        // getResumeStateLog 메서드의 실행 결과값과
        // 모킹된 Prisma resumeHistory의 findMany 메서드의 결과값이 같은지 검사
        expect(resumeLogs).toEqual(resumeLogsSample);
    });
});
