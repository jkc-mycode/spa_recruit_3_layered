import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import { USER_CONSTANT } from '../constants/user.constant.js';

import { requiredRoles } from '../middlewares/role.middleware.js';
import { resumeCreateValidator } from '../middlewares/validators/resume-create.validator.middleware.js';
import { resumeUpdateValidator } from '../middlewares/validators/resume-update.validator.middleware.js';
import { resumeStateChangeValidator } from '../middlewares/validators/resume-state.validator.middleware.js';

import { ResumeRepository } from '../repositories/resume.repository.js';
import { ResumeService } from '../services/resume.service.js';
import { ResumeController } from '../controllers/resume.controller.js';

const router = express.Router();

const resumeRepository = new ResumeRepository(prisma);
const resumeService = new ResumeService(resumeRepository);
const resumeController = new ResumeController(resumeService);

//이력서 생성 API
router.post('/', resumeCreateValidator, resumeController.createResume);

// 이력서 목록 조회 API
router.get('/', resumeController.getResumeList);

// 이력서 상세 조회 API
router.get('/:resumeId', resumeController.getResumeDetail);

// 이력서 수정 API
router.patch('/:resumeId', resumeUpdateValidator, resumeController.updateResume);

// 이력서 삭제 API
router.delete('/:resumeId', resumeController.deleteResume);

// 이력서 지원 상태 변경 API
router.patch(
    '/:resumeId/state',
    resumeStateChangeValidator,
    requiredRoles([USER_CONSTANT.USER_ROLE.RECRUITER]),
    resumeController.updateResumeState,
);

// 이력서 로그 목록 조회 API
router.get('/:resumeId/log', requiredRoles([USER_CONSTANT.USER_ROLE.RECRUITER]), resumeController.getResumeStateLog);

export default router;
