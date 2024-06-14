import jwt from 'jsonwebtoken';
import { AUTH_CONSTANT } from '../constants/auth.constant.js';
import { ERROR_CONSTANT } from '../constants/error.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { HttpError } from '../errors/http.error.js';

// AccessToken 인증 미들웨어
export const authAccessTokenMiddleware = (userService) => {
    return async (req, res, next) => {
        try {
            // 헤더에서 Access 토큰 가져옴
            const authorization = req.headers[AUTH_CONSTANT.AUTHORIZATION];
            if (!authorization) throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.JWT.NO_TOKEN);

            // Access 토큰이 Bearer 형식인지 확인
            const [tokenType, token] = authorization.split(' ');
            if (tokenType !== AUTH_CONSTANT.BEARER)
                throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.JWT.NOT_SUPPORTED_TYPE);

            // 서버에서 발급한 JWT가 맞는지 검증
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
            const userId = decodedToken.userId;

            // 사용자 정보를 UserService에게 요청
            const user = await userService.getUserInfoById(userId);
            if (!user) throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.JWT.NO_USER);

            // 조회된 사용자 정보를 req.user에 넣음
            req.user = user;
            // 다음 동작 진행
            next();
        } catch (err) {
            switch (err.name) {
                case ERROR_CONSTANT.NAME.EXPIRED:
                    next(new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.JWT.EXPIRED));
                    break;
                case ERROR_CONSTANT.NAME.JWT:
                    next(new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.JWT.INVALID));
                    break;
                default:
                    next(new HttpError.Unauthorized(err.message ?? MESSAGES.AUTH.COMMON.JWT.ETC));
                    break;
            }
        }
    };
};
