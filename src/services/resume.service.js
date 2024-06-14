import { RESUME_CONSTANT } from '../constants/resume.constant.js';
import { USER_CONSTANT } from '../constants/user.constant.js';
import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';

export class ResumeService {
    constructor(resumeRepository) {
        this.resumeRepository = resumeRepository;
    }

    // 이력서 생성
    createResume = async (userId, title, introduce) => {
        const resume = await this.resumeRepository.createResume(userId, title, introduce);

        return resume;
    };

    // 이력서 목록 조회
    getResumeList = async (user, status, sortType) => {
        // 채용 담당자인지 아닌지 판별
        const whereCondition = {};
        // 채용 담당자인 경우
        if (user.role === USER_CONSTANT.USER_ROLE.RECRUITER) {
            // 필터링 조건을 가져옴
            const stateFilter = status.toUpperCase();

            // 이력서 상태 필터링과 이력서 상태에 맞는 문자열일 때
            if (stateFilter && Object.values(RESUME_CONSTANT.RESUME_STATE).includes(stateFilter)) {
                whereCondition.state = stateFilter;
            }
        }
        // 채용 담당자가 아닌 경우
        else {
            whereCondition.userId = user.userId;
        }

        let resumes = await this.resumeRepository.getResumeList(whereCondition, sortType);

        // 이력서 목록 출력 양식에 맞춤
        resumes = resumes.map((resume) => {
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

        return resumes;
    };

    // 이력서 ID, 작성자 ID가 모두 일치한 이력서 조회
    getResumeDetail = async (resumeId, user) => {
        const whereCondition = { resumeId };
        // 채용 담당자가 아닌 경우
        if (user.role !== USER_CONSTANT.USER_ROLE.RECRUITER) {
            whereCondition.userId = user.userId;
        }

        // 이력서 ID, 작성자 ID가 모두 일치한 이력서 조회
        let resume = await this.resumeRepository.getResumeDetail(whereCondition, true);
        if (!resume) throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND);
        resume = {
            resumeId: resume.resumeId,
            userName: resume.user.name,
            title: resume.title,
            introduce: resume.introduce,
            state: resume.state,
            createdAt: resume.createdAt,
            updatedAt: resume.updatedAt,
        };
        return resume;
    };

    // 이력서 수정
    updateResume = async (resumeId, userId, title, introduce) => {
        const whereCondition = { resumeId, userId };
        // 이력서 ID, 작성자 ID가 모두 일치한 이력서 조회
        const resume = await this.resumeRepository.getResumeDetail(whereCondition);
        if (!resume) throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND);

        const updatedResume = await this.resumeRepository.updateResume(whereCondition, title, introduce);

        return updatedResume;
    };

    // 이력서 삭제
    deleteResume = async (resumeId, userId) => {
        const whereCondition = { resumeId, userId };
        // 이력서 ID, 작성자 ID가 모두 일치한 이력서 조회
        const resume = await this.resumeRepository.getResumeDetail(whereCondition);
        if (!resume) throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND);

        const deletedResumeId = await this.resumeRepository.deleteResume(whereCondition);

        return deletedResumeId;
    };

    // 이력서 상태 변경
    updateResumeState = async (userId, resumeId, newState, reason) => {
        const whereCondition = { resumeId };
        // 이력서 ID가 일치한 이력서 조회
        const resume = await this.resumeRepository.getResumeDetail(whereCondition);
        if (!resume) throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND);

        const resumeLog = await this.resumeRepository.updateResumeState(
            userId,
            resumeId,
            resume.state,
            newState,
            reason,
        );

        return resumeLog;
    };

    // 이력서 로그 조회
    getResumeStateLog = async (resumeId) => {
        const whereCondition = { resumeId };
        // 이력서 ID가 일치한 이력서 조회
        const resume = await this.resumeRepository.getResumeDetail(whereCondition);
        if (!resume) throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND);

        // 이력서 로그 조회
        let resumeLogs = await this.resumeRepository.getResumeStateLog(resumeId);

        resumeLogs = resumeLogs.map((log) => {
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

        return resumeLogs;
    };
}
