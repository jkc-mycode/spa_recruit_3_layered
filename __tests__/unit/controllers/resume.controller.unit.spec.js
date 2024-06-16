import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { ResumeController } from '../../../src/controllers/resume.controller';
import { HTTP_STATUS } from '../../../src/constants/http-status.constant.js';
import { MESSAGES } from '../../../src/constants/message.constant.js';
import { RESUME_CONSTANT } from '../../../src/constants/resume.constant';

const mockResumeService = {
    createResume: jest.fn(),
    getResumeList: jest.fn(),
    getResumeDetail: jest.fn(),
    updateResume: jest.fn(),
    deleteResume: jest.fn(),
    updateResumeState: jest.fn(),
    getResumeStateLog: jest.fn(),
};

const mockRequest = {
    user: jest.fn(),
    body: jest.fn(),
    query: jest.fn(),
    params: jest.fn(),
};

const mockResponse = {
    status: jest.fn(),
    json: jest.fn(),
};

const mockNext = jest.fn();

const resumeController = new ResumeController(mockResumeService);

describe('ResumeController Unit Test', () => {
    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다.

        // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
        mockResponse.status.mockReturnValue(mockResponse);
    });

    // 이력서 생성
    test('createResume Method', async () => {
        /* 설정 부분 */
        // Resume Controller의 createResume 메서드가 실행되기 위한 Body 입력값
        const createResumeRequestBodyParams = {
            title: '스파르탄 자기소개',
            introduce: '열심히 화이팅 화이팅!!',
        };
        // Request의 body에 입력할 인자값 설정
        mockRequest.body = createResumeRequestBodyParams;

        // Resume Controller의 createResume 메서드가 실행되기 위한 User 입력값
        const createResumeRequestUserParams = {
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
        // Request의 user에 입력할 인자값 설정
        mockRequest.user = createResumeRequestUserParams;

        // Resume Controller의 createResume 메서드의 임시 반환값
        const resumeSample = {
            resumeId: 12,
            userId: 1,
            title: '스파르탄 자기소개',
            introduce: '열심히 화이팅 화이팅!! ',
            state: 'APPLY',
            createdAt: '2024-06-14T07:15:16.397Z',
            updatedAt: '2024-06-14T07:15:16.397Z',
        };

        // Resume Service의 createResume 메서드 반환값을 설정
        mockResumeService.createResume.mockResolvedValue(resumeSample);

        /* 실행 부분, Controller의 createResume 메서드 실행 */
        await resumeController.createResume(mockRequest, mockResponse, mockNext);

        /* 테스트(조건) 부분 */
        // Resume Service의 createResume 메서드가 1번만 실행되었는지 검사
        expect(mockResumeService.createResume).toHaveBeenCalledTimes(1);
        // Resume Service의 createResume 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResumeService.createResume).toHaveBeenCalledWith(
            createResumeRequestUserParams.userId,
            createResumeRequestBodyParams.title,
            createResumeRequestBodyParams.introduce,
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
            message: MESSAGES.RESUMES.CREATE.SUCCEED,
            data: { resume: resumeSample },
        });
    });

    // 이력서 목록 조회
    test('getResumeList Method', async () => {
        /* 설정 부분 */
        // Resume Controller의 getResumeList 메서드가 실행되기 위한 query 입력값
        const getResumeListRequestQueryParams = {
            sort: RESUME_CONSTANT.SORT_TYPE.DESC,
            status: RESUME_CONSTANT.RESUME_STATE.APPLY,
        };
        // Request의 query에 입력할 인자값 설정
        mockRequest.query = getResumeListRequestQueryParams;

        // Resume Controller의 getResumeList 메서드가 실행되기 위한 User 입력값
        const getResumeListRequestUserParams = {
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
        // Request의 user에 입력할 인자값 설정
        mockRequest.user = getResumeListRequestUserParams;

        // Resume Controller의 getResumeList 메서드의 임시 반환값
        const resumesSample = [
            {
                resumeId: 12,
                userId: 1,
                title: '스파르탄 자기소개',
                introduce: '열심히 화이팅 화이팅!! ',
                state: 'APPLY',
                createdAt: '2024-06-14T07:15:16.397Z',
                updatedAt: '2024-06-14T07:15:16.397Z',
            },
            {
                resumeId: 13,
                userId: 1,
                title: '스파르탄 자기소개',
                introduce: '열심히 화이팅 화이팅!! ',
                state: 'APPLY',
                createdAt: '2024-06-14T07:15:16.397Z',
                updatedAt: '2024-06-14T07:15:16.397Z',
            },
        ];

        // Resume Service의 getResumeList 메서드 반환값을 설정
        mockResumeService.getResumeList.mockResolvedValue(resumesSample);

        /* 실행 부분, Controller의 getResumeList 메서드 실행 */
        await resumeController.getResumeList(mockRequest, mockResponse, mockNext);

        /* 테스트(조건) 부분 */
        // Resume Service의 getResumeList 메서드가 1번만 실행되었는지 검사
        expect(mockResumeService.getResumeList).toHaveBeenCalledTimes(1);
        // Resume Service의 getResumeList 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResumeService.getResumeList).toHaveBeenCalledWith(
            mockRequest.user,
            getResumeListRequestQueryParams.status,
            getResumeListRequestQueryParams.sort,
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
            message: MESSAGES.RESUMES.READ.LIST.SUCCEED,
            data: { resumes: resumesSample },
        });
    });

    // 이력서 상세 조회
    test('getResumeDetail Method', async () => {
        /* 설정 부분 */
        // Resume Controller의 getResumeDetail 메서드가 실행되기 위한 params 입력값
        const getResumeDetailRequestParams = {
            resumeId: 1,
        };
        // Request의 params에 입력할 인자값 설정
        mockRequest.params = getResumeDetailRequestParams;

        // Resume Controller의 getResumeDetail 메서드가 실행되기 위한 User 입력값
        const getResumeDetailRequestUserParams = {
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
        // Request의 user에 입력할 인자값 설정
        mockRequest.user = getResumeDetailRequestUserParams;

        // Resume Controller의 getResumeDetail 메서드의 임시 반환값
        const resumeSample = {
            resumeId: 12,
            userId: 1,
            title: '스파르탄 자기소개',
            introduce: '열심히 화이팅 화이팅!! ',
            state: 'APPLY',
            createdAt: '2024-06-14T07:15:16.397Z',
            updatedAt: '2024-06-14T07:15:16.397Z',
        };

        // Resume Service의 getResumeDetail 메서드 반환값을 설정
        mockResumeService.getResumeDetail.mockResolvedValue(resumeSample);

        /* 실행 부분, Controller의 getResumeDetail 메서드 실행 */
        await resumeController.getResumeDetail(mockRequest, mockResponse, mockNext);

        /* 테스트(조건) 부분 */
        // Resume Service의 getResumeDetail 메서드가 1번만 실행되었는지 검사
        expect(mockResumeService.getResumeDetail).toHaveBeenCalledTimes(1);
        // Resume Service의 getResumeDetail 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResumeService.getResumeDetail).toHaveBeenCalledWith(
            getResumeDetailRequestParams.resumeId,
            getResumeDetailRequestUserParams,
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
            message: MESSAGES.RESUMES.READ.DETAIL.SUCCEED,
            data: { resume: resumeSample },
        });
    });

    // 이력서 수정
    test('updateResume Method', async () => {
        /* 설정 부분 */
        // Resume Controller의 updateResume 메서드가 실행되기 위한 Body 입력값
        const updateResumeRequestBodyParams = {
            title: '스파르탄 자기소개',
            introduce: '열심히 화이팅 화이팅!!',
        };
        // Request의 body에 입력할 인자값 설정
        mockRequest.body = updateResumeRequestBodyParams;

        // Resume Controller의 updateResume 메서드가 실행되기 위한 params 입력값
        const updateResumeRequestParams = {
            resumeId: 1,
        };
        // Request의 params에 입력할 인자값 설정
        mockRequest.params = updateResumeRequestParams;

        // Resume Controller의 updateResume 메서드가 실행되기 위한 User 입력값
        const updateResumeRequestUserParams = {
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
        // Request의 user에 입력할 인자값 설정
        mockRequest.user = updateResumeRequestUserParams;

        // Resume Controller의 updateResume 메서드의 임시 반환값
        const updatedResumeSample = {
            resumeId: 12,
            userId: 1,
            title: '스파르탄 자기소개',
            introduce: '열심히 화이팅 화이팅!! ',
            state: 'APPLY',
            createdAt: '2024-06-14T07:15:16.397Z',
            updatedAt: '2024-06-14T07:15:16.397Z',
        };

        // Resume Service의 updateResume 메서드 반환값을 설정
        mockResumeService.updateResume.mockResolvedValue(updatedResumeSample);

        /* 실행 부분, Controller의 updateResume 메서드 실행 */
        await resumeController.updateResume(mockRequest, mockResponse, mockNext);

        /* 테스트(조건) 부분 */
        // Resume Service의 updateResume 메서드가 1번만 실행되었는지 검사
        expect(mockResumeService.updateResume).toHaveBeenCalledTimes(1);
        // Resume Service의 updateResume 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResumeService.updateResume).toHaveBeenCalledWith(
            updateResumeRequestParams.resumeId,
            updateResumeRequestUserParams.userId,
            updateResumeRequestBodyParams.title,
            updateResumeRequestBodyParams.introduce,
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
            message: MESSAGES.RESUMES.UPDATE.SUCCEED,
            data: { updatedResume: updatedResumeSample },
        });
    });

    // 이력서 삭제
    test('deleteResume Method', async () => {
        /* 설정 부분 */
        // Resume Controller의 deleteResume 메서드가 실행되기 위한 params 입력값
        const deleteResumeRequestParams = {
            resumeId: 1,
        };
        // Request의 params에 입력할 인자값 설정
        mockRequest.params = deleteResumeRequestParams;

        // Resume Controller의 deleteResume 메서드가 실행되기 위한 User 입력값
        const deleteResumeRequestUserParams = {
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
        // Request의 user에 입력할 인자값 설정
        mockRequest.user = deleteResumeRequestUserParams;

        // Resume Controller의 deleteResume 메서드의 임시 반환값
        const deletedResumeIdSample = { resumeId: 12 };

        // Resume Service의 deleteResume 메서드 반환값을 설정
        mockResumeService.deleteResume.mockResolvedValue(deletedResumeIdSample);

        /* 실행 부분, Controller의 deleteResume 메서드 실행 */
        await resumeController.deleteResume(mockRequest, mockResponse, mockNext);

        /* 테스트(조건) 부분 */
        // Resume Service의 deleteResume 메서드가 1번만 실행되었는지 검사
        expect(mockResumeService.deleteResume).toHaveBeenCalledTimes(1);
        // Resume Service의 deleteResume 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResumeService.deleteResume).toHaveBeenCalledWith(
            deleteResumeRequestParams.resumeId,
            deleteResumeRequestUserParams.userId,
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
            message: MESSAGES.RESUMES.DELETE.SUCCEED,
            data: { deletedResumeId: deletedResumeIdSample },
        });
    });

    // 이력서 상태 변경
    test('updateResumeState Method', async () => {
        /* 설정 부분 */
        // Resume Controller의 updateResumeState 메서드가 실행되기 위한 Body 입력값
        const updateResumeStateRequestBodyParams = {
            state: RESUME_CONSTANT.RESUME_STATE.PASS,
            reason: '서류 합격!!',
        };
        // Request의 body에 입력할 인자값 설정
        mockRequest.body = updateResumeStateRequestBodyParams;

        // Resume Controller의 updateResumeState 메서드가 실행되기 위한 params 입력값
        const updateResumeStateRequestParams = {
            resumeId: 1,
        };
        // Request의 params에 입력할 인자값 설정
        mockRequest.params = updateResumeStateRequestParams;

        // Resume Controller의 updateResumeState 메서드가 실행되기 위한 User 입력값
        const updateResumeStateRequestUserParams = {
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
        // Request의 user에 입력할 인자값 설정
        mockRequest.user = updateResumeStateRequestUserParams;

        // Resume Controller의 updateResumeState 메서드의 임시 반환값
        let resumeLogSample = {
            resumeLogId: 4,
            userName: '스파르탄',
            resumeId: 11,
            oldState: 'APPLY',
            newState: 'PASS',
            reason: '서류 심사 통과!',
            createdAt: new Date(),
        };

        // Resume Service의 updateResumeState 메서드 반환값을 설정
        mockResumeService.updateResumeState.mockResolvedValue(resumeLogSample);

        /* 실행 부분, Controller의 updateResumeState 메서드 실행 */
        await resumeController.updateResumeState(mockRequest, mockResponse, mockNext);

        /* 테스트(조건) 부분 */
        // Resume Service의 updateResumeState 메서드가 1번만 실행되었는지 검사
        expect(mockResumeService.updateResumeState).toHaveBeenCalledTimes(1);
        // Resume Service의 updateResumeState 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResumeService.updateResumeState).toHaveBeenCalledWith(
            updateResumeStateRequestParams.resumeId,
            updateResumeStateRequestUserParams.userId,
            updateResumeStateRequestBodyParams.state,
            updateResumeStateRequestBodyParams.reason,
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
            message: MESSAGES.RESUMES.STATE.SUCCEED,
            data: { resumeLog: resumeLogSample },
        });
    });

    // 이력서 로그 조회
    test('getResumeStateLog Method', async () => {
        /* 설정 부분 */
        // Resume Controller의 getResumeStateLog 메서드가 실행되기 위한 params 입력값
        const getResumeStateLogRequestParams = {
            resumeId: 1,
        };
        // Request의 params에 입력할 인자값 설정
        mockRequest.params = getResumeStateLogRequestParams;

        // Resume Controller의 getResumeStateLog 메서드의 임시 반환값
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

        // Resume Service의 getResumeStateLog 메서드 반환값을 설정
        mockResumeService.getResumeStateLog.mockResolvedValue(resumeLogsSample);

        /* 실행 부분, Controller의 getResumeStateLog 메서드 실행 */
        await resumeController.getResumeStateLog(mockRequest, mockResponse, mockNext);

        /* 테스트(조건) 부분 */
        // Resume Service의 getResumeStateLog 메서드가 1번만 실행되었는지 검사
        expect(mockResumeService.getResumeStateLog).toHaveBeenCalledTimes(1);
        // Resume Service의 getResumeStateLog 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResumeService.getResumeStateLog).toHaveBeenCalledWith(getResumeStateLogRequestParams.resumeId);

        // Response의 status 메서드가 1번만 실행되었는지 검사
        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        // Response의 status 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);

        // Response의 json 메서드가 1번만 실행되었는지 검사
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        // Response의 json 메서드가 매개변수와 함께 호출되었는지 검사
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: HTTP_STATUS.OK,
            message: MESSAGES.RESUMES.LOG.READ.LIST.SUCCEED,
            data: { resumeLogs: resumeLogsSample },
        });
    });
});
