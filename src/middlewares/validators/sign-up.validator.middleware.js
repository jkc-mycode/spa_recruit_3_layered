import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';
import { AUTH_CONSTANT } from '../../constants/auth.constant.js';
import { USER_CONSTANT } from '../../constants/user.constant.js';

// 회원가입 유효성 검사
export const signUpValidator = async (req, res, next) => {
    try {
        const signUpSchema = Joi.object({
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
            passwordConfirm: Joi.string().required().pattern(new RegExp(AUTH_CONSTANT.PASSWORD_REGEXP)).messages({
                'string.base': MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.BASE,
                'string.empty': MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.REQUIRED,
                'any.required': MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.REQUIRED,
                'string.pattern.base': MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.PATTERN,
            }),
            name: Joi.string().required().messages({
                'string.base': MESSAGES.AUTH.COMMON.NAME.BASE,
                'string.empty': MESSAGES.AUTH.COMMON.NAME.REQUIRED,
                'any.required': MESSAGES.AUTH.COMMON.NAME.REQUIRED,
            }),
            age: Joi.number().integer().required().messages({
                'number.base': MESSAGES.AUTH.COMMON.AGE.BASE,
                'any.required': MESSAGES.AUTH.COMMON.AGE.REQUIRED,
            }),
            gender: Joi.string()
                .valid(...Object.values(USER_CONSTANT.USER_GENDER))
                .required()
                .messages({
                    'string.base': MESSAGES.AUTH.COMMON.GENDER.BASE,
                    'any.only': MESSAGES.AUTH.COMMON.GENDER.ONLY,
                }),
            profileImage: Joi.string().required().messages({
                'string.base': MESSAGES.AUTH.COMMON.PROFILE_IMAGE.BASE,
                'string.empty': MESSAGES.AUTH.COMMON.PROFILE_IMAGE.REQUIRED,
                'any.required': MESSAGES.AUTH.COMMON.PROFILE_IMAGE.REQUIRED,
            }),
        });
        await signUpSchema.validateAsync(req.body);
        next();
    } catch (err) {
        next(err);
    }
};
