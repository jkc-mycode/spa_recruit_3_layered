import { Prisma } from '@prisma/client';
import { RESUME_CONSTANT } from '../constants/resume.constant.js';

export class ResumeRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    // 이력서 생성
    createResume = async (userId, title, introduce) => {
        const resume = await this.prisma.resume.create({
            data: { userId, title, introduce },
        });

        return resume;
    };

    // 이력서 목록 조회
    getResumeList = async (whereCondition, sortType) => {
        const resumes = await this.prisma.resume.findMany({
            where: whereCondition,
            include: { user: true },
            orderBy: { createdAt: sortType },
        });

        return resumes;
    };

    // 이력서 상세 조회
    getResumeDetail = async (whereCondition, includeUser = false) => {
        const resume = await this.prisma.resume.findFirst({
            where: whereCondition,
            include: { user: includeUser },
        });

        return resume;
    };

    // 이력서 수정
    updateResume = async (whereCondition, title, introduce) => {
        const updatedResume = await this.prisma.resume.update({
            where: whereCondition,
            data: {
                ...(title && { title }),
                ...(introduce && { introduce }),
            },
        });

        return updatedResume;
    };

    // 이력서 삭제
    deleteResume = async (whereCondition) => {
        const deletedResumeId = await this.prisma.resume.delete({
            where: whereCondition,
            select: { resumeId: true },
        });

        return deletedResumeId;
    };

    // 이력서 상태 변경
    updateResumeState = async (userId, resumeId, oldState, newState, reason) => {
        let resumeLog; // 이력서 변경 로그

        // 트랜젝션을 통해서 작업의 일관성 유지
        await this.prisma.$transaction(
            async (tx) => {
                // 이력서 수정
                await tx.resume.update({ where: { resumeId: +resumeId }, data: { state: newState } });

                // 이력서 변경 로그 생성
                resumeLog = await tx.resumeHistory.create({
                    data: { recruiterId: +userId, resumeId, oldState, newState, reason },
                });
            },
            {
                isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
            },
        );

        return resumeLog;
    };

    // 이력서 로그 조회
    getResumeStateLog = async (resumeId) => {
        const resumeLogs = await this.prisma.resumeHistory.findMany({
            where: { resumeId },
            include: { user: true },
            orderBy: { createdAt: RESUME_CONSTANT.SORT_TYPE.DESC },
        });

        return resumeLogs;
    };
}
