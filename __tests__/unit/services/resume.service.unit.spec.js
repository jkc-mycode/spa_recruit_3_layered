import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { ResumeService } from '../../../src/services/resume.service';
import { RESUME_CONSTANT } from '../../../src/constants/resume.constant';

// TODO: template 이라고 되어 있는 부분을 다 올바르게 수정한 후 사용해야 합니다.

const mockResumeRepository = {
    createResume: jest.fn(),
    getResumeList: jest.fn(),
    getResumeDetail: jest.fn(),
    updateResume: jest.fn(),
    deleteResume: jest.fn(),
    updateResumeState: jest.fn(),
    getResumeStateLog: jest.fn(),
};

const resumeService = new ResumeService(mockResumeRepository);

describe('ResumeService Unit Test', () => {
    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
    });

    // 이력서 생성
    test('createResume Method', async () => {
        /* 설정 부분 */
        // Resume Service의 createResume 메서드 매개변수 임시값
        const createResumeParams = {
            userId: 1,
            title: '제목 테스트',
            introduce: '자기소개 테스트',
        };
        // Resume Repository의 create 메서드의 임시 반환값
        const resumeSample = {
            resumeId: 12,
            userId: 1,
            title: '스파르탄 자기소개',
            introduce: '열심히 화이팅 화이팅!! ',
            state: 'APPLY',
            createdAt: '2024-06-14T07:15:16.397Z',
            updatedAt: '2024-06-14T07:15:16.397Z',
        };
        // Resume Repository의 createResume 메서드의 결과값 설정
        mockResumeRepository.createResume.mockReturnValue(resumeSample);

        /* 실행 부분, 실제 Resume Service의 createResume 메서드 실행 */
        const resume = await resumeService.createResume(
            createResumeParams.userId,
            createResumeParams.title,
            createResumeParams.introduce,
        );

        /* 테스트(조건) 부분 */
        // Resume Repository의 createResume 메서드가 1번만 실행되었는지 검사
        expect(mockResumeRepository.createResume).toHaveBeenCalledTimes(1);
        // Resume Repository의 createResume 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResumeRepository.createResume).toHaveBeenCalledWith(
            createResumeParams.userId,
            createResumeParams.title,
            createResumeParams.introduce,
        );
        // createResume 메서드의 실행 결과값과
        // Resume Repository의 createResume 메서드의 결과값이 같은지 검사
        expect(resume).toEqual(resumeSample);
    });

    // 이력서 목록 조회
    test('getResumeList Method', async () => {
        /* 설정 부분 */
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

        // Resume Repository의 getResumeList 메서드 매개변수 임시값
        const getResumeListParams = {
            whereCondition: { userId: userInfoSample.userId },
            user: userInfoSample,
            status: RESUME_CONSTANT.RESUME_STATE.APPLY,
            sortType: RESUME_CONSTANT.SORT_TYPE.DESC,
        };
        // Resume Repository의 getResumeList 메서드의 임시 반환값
        let resumesSample = [
            {
                resumeId: 12,
                userName: '스파르탄',
                title: '스파르탄 자기소개',
                introduce: '열심히 화이팅 화이팅!! ',
                state: 'APPLY',
                createdAt: new Date(),
                updatedAt: new Date(),
                user: userInfoSample,
            },
            {
                resumeId: 13,
                userName: '스파르탄',
                title: '스파르탄 자기소개',
                introduce: '열심히 화이팅 화이팅!! ',
                state: 'APPLY',
                createdAt: new Date(new Date().getTime() + 1000),
                updatedAt: new Date(new Date().getTime() + 1000),
                user: userInfoSample,
            },
        ];
        // 이력서 목록 정렬
        resumesSample = resumesSample.sort((a, b) => b.createdAt - a.createdAt);

        // Resume Repository의 getResumeList 메서드의 결과값 설정
        mockResumeRepository.getResumeList.mockReturnValue(resumesSample);

        // 이력서 목록 출력 양식에 맞춤
        resumesSample = resumesSample.map((resume) => {
            return {
                resumeId: resume.resumeId,
                userName: resume.user.name,
                title: resume.title,
                introduce: resume.introduce,
                state: resume.state,
                createdAt: resume.createdAt,
                updatedAt: resume.updatedAt,
            };
        });

        /* 실행 부분, 실제 Resume Service의  getResumeList 메서드 실행 */
        const resumes = await resumeService.getResumeList(
            getResumeListParams.user,
            getResumeListParams.status,
            getResumeListParams.sortType,
        );

        /* 테스트(조건) 부분 */
        // Resume Repository의 getResumeList 메서드가 1번만 실행되었는지 검사
        expect(mockResumeRepository.getResumeList).toHaveBeenCalledTimes(1);
        // Resume Repository의 getResumeList 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResumeRepository.getResumeList).toHaveBeenCalledWith(
            getResumeListParams.whereCondition,
            getResumeListParams.sortType,
        );
        // Resume Service의  getResumeList 메서드 실행 결과값과
        // Resume Repository의 getResumeList 메서드의 결과값이 같은지 검사
        expect(resumes).toEqual(resumesSample);
    });

    // 이력서 상세 조회
    test('getResumeDetail Method', async () => {
        /* 설정 부분 */
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
        // Resume Service의 getResumeDetail 메서드 매개변수 임시값
        const getResumeDetailParams = {
            resumeId: 12,
            user: userInfoSample,
        };
        // Resume Repository의 getResumeDetail 메서드의 임시 반환값
        let resumeSample = {
            resumeId: 12,
            userName: '스파르탄',
            title: '스파르탄 자기소개',
            introduce: '열심히 화이팅 화이팅!! ',
            state: 'APPLY',
            createdAt: '2024-06-14T07:15:16.397Z',
            updatedAt: '2024-06-14T07:15:16.397Z',
            user: getResumeDetailParams.user,
        };
        // Resume Repository의 getResumeDetail 메서드의 결과값 설정
        mockResumeRepository.getResumeDetail.mockReturnValue(resumeSample);

        // 이력서 출력 양식에 맞춤
        resumeSample = {
            resumeId: resumeSample.resumeId,
            userName: resumeSample.user.name,
            title: resumeSample.title,
            introduce: resumeSample.introduce,
            state: resumeSample.state,
            createdAt: resumeSample.createdAt,
            updatedAt: resumeSample.updatedAt,
        };

        /* 실행 부분, 실제 Resume Service의 getResumeDetail 메서드 실행 */
        const resume = await resumeService.getResumeDetail(getResumeDetailParams.resumeId, userInfoSample);

        /* 테스트(조건) 부분 */
        // Resume Repository의 getResumeDetail 메서드가 1번만 실행되었는지 검사
        expect(mockResumeRepository.getResumeDetail).toHaveBeenCalledTimes(1);
        // Resume Repository의 getResumeDetail 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResumeRepository.getResumeDetail).toHaveBeenCalledWith(
            { resumeId: getResumeDetailParams.resumeId, userId: userInfoSample.userId },
            true,
        );
        // Resume Service의 getResumeDetail 메서드의 실행 결과값과
        // Resume Repository의 getResumeDetail 메서드의 결과값이 같은지 검사
        expect(resume).toEqual(resumeSample);
    });

    // 이력서 수정
    test('updateResume Method', async () => {
        /* 설정 부분 */
        // Resume Service의 updateResume 메서드 매개변수 임시값
        const updateResumeParams = {
            resumeId: 12,
            userId: 1,
            title: '제목 테스트',
            introduce: '자기소개 테스트',
        };
        // Resume Repository의 updateResume 메서드의 임시 반환값
        const resumeSample = {
            resumeId: 12,
            userId: 1,
            title: '스파르탄 자기소개',
            introduce: '열심히 화이팅 화이팅!! ',
            state: 'APPLY',
            createdAt: '2024-06-14T07:15:16.397Z',
            updatedAt: '2024-06-14T07:15:16.397Z',
        };
        // Resume Repository의 getResumeDetail 메서드의 결과값 설정
        mockResumeRepository.getResumeDetail.mockReturnValue(resumeSample);
        // Resume Repository의 updateResume 메서드의 결과값 설정
        mockResumeRepository.updateResume.mockReturnValue(resumeSample);

        /* 실행 부분, 실제 Resume Repository의  updateResume 메서드 실행 */
        const updatedResume = await resumeService.updateResume(
            updateResumeParams.resumeId,
            updateResumeParams.userId,
            updateResumeParams.title,
            updateResumeParams.introduce,
        );

        /* 테스트(조건) 부분 */
        // Resume Repository의 updateResume 메서드가 1번만 실행되었는지 검사
        expect(mockResumeRepository.updateResume).toHaveBeenCalledTimes(1);
        // Resume Repository의 updateResume 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResumeRepository.updateResume).toHaveBeenCalledWith(
            {
                resumeId: updateResumeParams.resumeId,
                userId: updateResumeParams.userId,
            },
            updateResumeParams.title,
            updateResumeParams.introduce,
        );
        // Resume Service의 updateResume 메서드의 실행 결과값과
        // Resume Repository의 updateResume 메서드의 결과값이 같은지 검사
        expect(updatedResume).toEqual(resumeSample);
    });

    // 이력서 삭제
    test('deleteResume Method', async () => {
        /* 설정 부분 */
        // Resume Service의 deleteResume 메서드 매개변수 임시값
        const deleteResumeParams = {
            resumeId: 12,
            userId: 1,
            title: '제목 테스트',
            introduce: '자기소개 테스트',
        };
        // Resume Repository의 updateResume 메서드의 임시 반환값
        const resumeSample = {
            resumeId: 12,
            userId: 1,
            title: '스파르탄 자기소개',
            introduce: '열심히 화이팅 화이팅!! ',
            state: 'APPLY',
            createdAt: '2024-06-14T07:15:16.397Z',
            updatedAt: '2024-06-14T07:15:16.397Z',
        };
        // Resume Repository의 getResumeDetail 메서드의 결과값 설정
        mockResumeRepository.getResumeDetail.mockReturnValue(resumeSample);
        // Resume Repository의 deleteResume 메서드의 임시 반환값
        const deletedResumeIdSample = { resumeId: 12 };
        // Resume Repository의 deleteResume 메서드의 결과값 설정
        mockResumeRepository.deleteResume.mockReturnValue(deletedResumeIdSample);

        /* 실행 부분, 실제 Resume Service의 deleteResume 메서드 실행 */
        const deletedResumeId = await resumeService.deleteResume(
            deleteResumeParams.resumeId,
            deleteResumeParams.userId,
        );

        /* 테스트(조건) 부분 */
        // Resume Repository의 getResumeDetail 메서드가 1번만 실행되었는지 검사
        expect(mockResumeRepository.getResumeDetail).toHaveBeenCalledTimes(1);
        // Resume Repository의 getResumeDetail 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResumeRepository.getResumeDetail).toHaveBeenCalledWith({
            resumeId: deleteResumeParams.resumeId,
            userId: deleteResumeParams.userId,
        });

        // Resume Repository의 deleteResume 메서드가 1번만 실행되었는지 검사
        expect(mockResumeRepository.deleteResume).toHaveBeenCalledTimes(1);
        // Resume Repository의 deleteResume 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResumeRepository.deleteResume).toHaveBeenCalledWith({
            resumeId: deleteResumeParams.resumeId,
            userId: deleteResumeParams.userId,
        });
        // Resume Service의 deleteResume 메서드 실행 결과값과
        // Resume Repository의 deleteResume 메서드의 결과값이 같은지 검사
        expect(deletedResumeId).toEqual(deletedResumeIdSample);
    });

    // 이력서 상태 변경
    test('updateResumeState Method', async () => {
        /* 설정 부분 */
        // Resume Service의 updateResumeState 메서드 매개변수 임시값
        const updateResumeStateParams = {
            userId: 1,
            resumeId: 12,
            newState: RESUME_CONSTANT.RESUME_STATE.PASS,
            reason: '서류 통과',
        };
        // Resume Repository의 updateResume 메서드의 임시 반환값
        const resumeSample = {
            resumeId: 12,
            userId: 1,
            title: '스파르탄 자기소개',
            introduce: '열심히 화이팅 화이팅!! ',
            state: 'APPLY',
            createdAt: '2024-06-14T07:15:16.397Z',
            updatedAt: '2024-06-14T07:15:16.397Z',
        };
        // Resume Repository의 getResumeDetail 메서드의 결과값 설정
        mockResumeRepository.getResumeDetail.mockReturnValue(resumeSample);

        // Resume Repository의 updateResumeState 메서드의 임시 반환값
        const resumeLogSample = {
            resumeLogId: 7,
            resumeId: updateResumeStateParams.resumeId,
            recruiterId: updateResumeStateParams.userId,
            oldState: resumeSample.state,
            newState: updateResumeStateParams.newState,
            reason: updateResumeStateParams.reason,
            createdAt: new Date(),
        };
        // Resume Repository의 updateResumeState 메서드의 결과값 설정
        mockResumeRepository.updateResumeState.mockReturnValue(resumeLogSample);

        /* 실행 부분, 실제 Resume Service의  updateResumeState 메서드 실행 */
        const resumeLog = await resumeService.updateResumeState(
            updateResumeStateParams.userId,
            updateResumeStateParams.resumeId,
            updateResumeStateParams.newState,
            updateResumeStateParams.reason,
        );

        /* 테스트(조건) 부분 */
        // Resume Repository의 getResumeDetail 메서드가 1번만 실행되었는지 검사
        expect(mockResumeRepository.getResumeDetail).toHaveBeenCalledTimes(1);
        // Resume Repository의 getResumeDetail 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResumeRepository.getResumeDetail).toHaveBeenCalledWith({
            resumeId: updateResumeStateParams.resumeId,
        });

        // Resume Repository의 updateResumeState 메서드가 1번만 실행되었는지 검사
        expect(mockResumeRepository.updateResumeState).toHaveBeenCalledTimes(1);
        // Resume Repository의 updateResumeState 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResumeRepository.updateResumeState).toHaveBeenCalledWith(
            updateResumeStateParams.userId,
            updateResumeStateParams.resumeId,
            resumeSample.state,
            updateResumeStateParams.newState,
            updateResumeStateParams.reason,
        );

        // Resume Service의 updateResumeState 메서드 실행 결과값과
        // Resume Repository의 updateResumeState 메서드의 결과값이 같은지 검사
        expect(resumeLog).toEqual(resumeLogSample);
    });

    // 이력서 로그 조회
    test('getResumeStateLog Method', async () => {
        /* 설정 부분 */
        // Resume Service의 getResumeStateLog 메서드 매개변수 임시값
        const resumeStateLogParams = {
            resumeId: 12,
        };
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
        // Resume Repository의 updateResume 메서드의 임시 반환값
        const resumeSample = {
            resumeId: 12,
            userId: 1,
            title: '스파르탄 자기소개',
            introduce: '열심히 화이팅 화이팅!! ',
            state: 'APPLY',
            createdAt: '2024-06-14T07:15:16.397Z',
            updatedAt: '2024-06-14T07:15:16.397Z',
        };
        // Resume Repository의 getResumeDetail 메서드의 결과값 설정
        mockResumeRepository.getResumeDetail.mockReturnValue(resumeSample);

        // Resume Repository의 getResumeStateLog 메서드의 임시 반환값
        let resumeLogsSample = [
            {
                resumeLogId: 4,
                userName: '스파르탄',
                resumeId: 11,
                oldState: 'APPLY',
                newState: 'PASS',
                reason: '서류 심사 통과!',
                createdAt: new Date(),
                user: userInfoSample,
            },
            {
                resumeLogId: 5,
                userName: '스파르탄',
                resumeId: 11,
                oldState: 'PASS',
                newState: 'INTERVIEW1',
                reason: '1차 면접 통과!',
                createdAt: new Date(new Date().getTime() + 1000),
                user: userInfoSample,
            },
        ];
        // Resume Repository의 getResumeStateLog 메서드의 결과값 설정
        mockResumeRepository.getResumeStateLog.mockReturnValue(resumeLogsSample);

        // 이력서 목록 출력 양식에 맞춤
        resumeLogsSample = resumeLogsSample.map((log) => {
            return {
                resumeLogId: log.resumeLogId,
                userName: log.user.name,
                resumeId: log.resumeId,
                oldState: log.oldState,
                newState: log.newState,
                reason: log.reason,
                createdAt: log.createdAt,
            };
        });

        /* 실행 부분, 실제 Resume Repository의  getResumeStateLog 메서드 실행 */
        const resumeLogs = await resumeService.getResumeStateLog(resumeStateLogParams.resumeId);

        /* 테스트(조건) 부분 */
        // Resume Repository의 getResumeDetail 메서드가 1번만 실행되었는지 검사
        expect(mockResumeRepository.getResumeDetail).toHaveBeenCalledTimes(1);
        // Resume Repository의 getResumeDetail 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResumeRepository.getResumeDetail).toHaveBeenCalledWith({
            resumeId: resumeStateLogParams.resumeId,
        });

        // Resume Repository의 getResumeStateLog 메서드가 1번만 실행되었는지 검사
        expect(mockResumeRepository.getResumeStateLog).toHaveBeenCalledTimes(1);
        // Resume Repository의 getResumeStateLog 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResumeRepository.getResumeStateLog).toHaveBeenCalledWith(resumeStateLogParams.resumeId);
        // getResumeStateLog 메서드의 실행 결과값과
        // Resume Repository의 getResumeStateLog 메서드의 결과값이 같은지 검사
        expect(resumeLogs).toEqual(resumeLogsSample);
    });
});
