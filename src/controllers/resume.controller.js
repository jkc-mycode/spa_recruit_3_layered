import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { RESUME_CONSTANT } from '../constants/resume.constant.js';

export class ResumeController {
    constructor(resumeService) {
        this.resumeService = resumeService;
    }

    //이력서 생성 기능
    createResume = async (req, res, next) => {
        try {
            // 사용자 ID를 가져옴
            const { userId } = req.user;
            // 제목, 자기소개 가져옴
            const { title, introduce } = req.body;

            // 이력서 생성
            const resume = await this.resumeService.createResume(userId, title, introduce);

            return res
                .status(HTTP_STATUS.CREATED)
                .json({ status: HTTP_STATUS.CREATED, message: MESSAGES.RESUMES.CREATE.SUCCEED, data: { resume } });
        } catch (err) {
            next(err);
        }
    };

    // 이력서 목록 조회 기능
    getResumeList = async (req, res) => {
        // 사용자를 가져옴
        const user = req.user;
        // 정렬 조건을 req.query로 가져옴
        let sortType = req.query.sort.toLowerCase();

        console.log(sortType);

        if (sortType !== RESUME_CONSTANT.SORT_TYPE.DESC && sortType !== RESUME_CONSTANT.SORT_TYPE.ASC) {
            sortType = RESUME_CONSTANT.SORT_TYPE.DESC;
        }

        // 이력서 목록 조회
        const resumes = await this.resumeService.getResumeList(user, req.query.status, sortType);

        return res
            .status(HTTP_STATUS.OK)
            .json({ status: HTTP_STATUS.OK, message: MESSAGES.RESUMES.READ.LIST.SUCCEED, data: { resumes } });
    };

    // 이력서 상세 조회 기능
    getResumeDetail = async (req, res, next) => {
        try {
            // 사용자를 가져옴
            const user = req.user;
            // 이력서 ID를 가져옴
            const { resumeId } = req.params;

            // 이력서 ID, 작성자 ID가 모두 일치한 이력서 조회
            const resume = await this.resumeService.getResumeDetail(+resumeId, user);

            return res
                .status(HTTP_STATUS.OK)
                .json({ status: HTTP_STATUS.OK, message: MESSAGES.RESUMES.READ.DETAIL.SUCCEED, data: { resume } });
        } catch (err) {
            next(err);
        }
    };

    // 이력서 수정 기능
    updateResume = async (req, res, next) => {
        try {
            // 사용자 ID를 가져옴
            const { userId } = req.user;
            // 이력서 ID를 가져옴
            const { resumeId } = req.params;
            const { title, introduce } = req.body;

            // 이력서 수정
            const updatedResume = await this.resumeService.updateResume(+resumeId, userId, title, introduce);

            return res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                message: MESSAGES.RESUMES.UPDATE.SUCCEED,
                data: { updatedResume },
            });
        } catch (err) {
            next(err);
        }
    };

    // 이력서 삭제 기능
    deleteResume = async (req, res, next) => {
        try {
            // 사용자 ID를 가져옴
            const { userId } = req.user;
            // 이력서 ID를 가져옴
            const { resumeId } = req.params;

            // 이력서 삭제
            const deletedResumeId = await this.resumeService.deleteResume(+resumeId, userId);

            return res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                message: MESSAGES.RESUMES.DELETE.SUCCEED,
                data: { deletedResumeId },
            });
        } catch (err) {
            next(err);
        }
    };

    // 이력서 지원 상태 변경 기능
    updateResumeState = async (req, res, next) => {
        try {
            // 사용자 정보 가져옴
            const { userId } = req.user;
            // 이력서 ID 가져옴
            const { resumeId } = req.params;
            //지원 상태, 사유 가져옴
            const { state, reason } = req.body;

            // 이력서 상태 변경
            const resumeLog = await this.resumeService.updateResumeState(userId, +resumeId, state, reason);

            return res
                .status(HTTP_STATUS.CREATED)
                .json({ status: HTTP_STATUS.CREATED, message: MESSAGES.RESUMES.STATE.SUCCEED, data: { resumeLog } });
        } catch (err) {
            next(err);
        }
    };

    // 이력서 로그 목록 조회 기능
    getResumeStateLog = async (req, res, next) => {
        try {
            // 이력서 ID 가져옴
            const { resumeId } = req.params;

            // 이력서 로그 조회
            const resumeLogs = await this.resumeService.getResumeStateLog(+resumeId);

            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                message: MESSAGES.RESUMES.LOG.READ.LIST.SUCCEED,
                data: { resumeLogs },
            });
        } catch (err) {
            next(err);
        }
    };
}
