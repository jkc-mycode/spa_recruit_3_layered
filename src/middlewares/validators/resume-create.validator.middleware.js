import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';

// 이력서 작성 유효성 검사
export const resumeCreateValidator = async (req, res, next) => {
    try {
        const resumeCreateSchema = Joi.object({
            title: Joi.string().required().messages({
                'string.base': MESSAGES.RESUMES.COMMON.TITLE,
                'string.empty': MESSAGES.RESUMES.COMMON.TITLE.REQUIRED,
                'any.required': MESSAGES.RESUMES.COMMON.TITLE.REQUIRED,
            }),
            introduce: Joi.string().min(150).required().messages({
                'string.base': MESSAGES.RESUMES.COMMON.INTRODUCE.BASE,
                'string.min': MESSAGES.RESUMES.COMMON.INTRODUCE.MIN,
                'string.empty': MESSAGES.RESUMES.COMMON.INTRODUCE.REQUIRED,
                'any.required': MESSAGES.RESUMES.COMMON.INTRODUCE.REQUIRED,
            }),
        });
        await resumeCreateSchema.validateAsync(req.body);
        next();
    } catch (err) {
        next(err);
    }
};
