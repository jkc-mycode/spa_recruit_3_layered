import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';
import { AUTH_CONSTANT } from '../../constants/auth.constant.js';

// 로그인 유효성 검사
export const signInValidator = async (req, res, next) => {
    try {
        const signInSchema = Joi.object({
            email: Joi.string()
                .email({ minDomainSegments: AUTH_CONSTANT.MIN_DOMAIN_SEGMENTS, tlds: { allow: AUTH_CONSTANT.TLDS } })
                .required()
                .messages({
                    'string.base': MESSAGES.AUTH.COMMON.EMAIL.BASE,
                    'string.empty': MESSAGES.AUTH.COMMON.EMAIL.REQUIRED,
                    'string.email': MESSAGES.AUTH.COMMON.EMAIL.EMAIL,
                    'any.required': MESSAGES.AUTH.COMMON.EMAIL.REQUIRED,
                }),
            password: Joi.string().required().pattern(new RegExp(AUTH_CONSTANT.PASSWORD_REGEXP)).messages({
                'string.base': MESSAGES.AUTH.COMMON.PASSWORD.BASE,
                'string.empty': MESSAGES.AUTH.COMMON.PASSWORD.REQUIRED,
                'any.required': MESSAGES.AUTH.COMMON.PASSWORD.REQUIRED,
                'string.pattern.base': MESSAGES.AUTH.COMMON.PASSWORD.PATTERN,
            }),
        });
        await signInSchema.validateAsync(req.body);
        next();
    } catch (err) {
        next(err);
    }
};
