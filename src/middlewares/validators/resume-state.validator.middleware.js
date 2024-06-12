import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';
import { RESUME_CONSTANT } from '../../constants/resume.constant.js';

// 이력서 상태 변경 유효성 검사
export const resumeStateChangeValidator = async (req, res, next) => {
    try {
        const resumeStateChangeSchema = Joi.object({
            state: Joi.string()
                .valid(...Object.values(RESUME_CONSTANT.RESUME_STATE))
                .required()
                .messages({
                    'string.base': MESSAGES.RESUMES.COMMON.STATE.BASE,
                    'string.empty': MESSAGES.RESUMES.COMMON.STATE.REQUIRED,
                    'any.required': MESSAGES.RESUMES.COMMON.STATE.REQUIRED,
                    'any.only': MESSAGES.RESUMES.COMMON.STATE.ONLY,
                }),
            reason: Joi.string().required().messages({
                'string.base': MESSAGES.RESUMES.COMMON.REASON.BASE,
                'string.empty': MESSAGES.RESUMES.COMMON.REASON.REQUIRED,
                'any.required': MESSAGES.RESUMES.COMMON.REASON.REQUIRED,
            }),
        });
        await resumeStateChangeSchema.validateAsync(req.body);
        next();
    } catch (err) {
        next(err);
    }
};
