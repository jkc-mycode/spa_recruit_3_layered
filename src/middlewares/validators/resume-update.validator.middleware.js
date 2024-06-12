import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';

// 이력서 수정 유효성 검사
export const resumeUpdateValidator = async (req, res, next) => {
    try {
        const resumeUpdateSchema = Joi.object({
            title: Joi.string().messages({
                'string.base': MESSAGES.RESUMES.COMMON.TITLE,
            }),
            introduce: Joi.string().min(150).messages({
                'string.base': MESSAGES.RESUMES.COMMON.INTRODUCE.BASE,
                'string.min': MESSAGES.RESUMES.COMMON.INTRODUCE.MIN,
            }),
        });
        await resumeUpdateSchema.validateAsync(req.body);
        next();
    } catch (err) {
        next(err);
    }
};
