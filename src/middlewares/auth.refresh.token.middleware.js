import jwt from 'jsonwebtoken';
import { MESSAGES } from '../constants/message.constant.js';
import { ERROR_CONSTANT } from '../constants/error.constant.js';
import { AUTH_CONSTANT } from '../constants/auth.constant.js';
import { HttpError } from '../errors/http.error.js';

// RefreshToken 인증 미들웨어
export const authRefreshTokenMiddleware = (authService, userService) => {
    return async (req, res, next) => {
        try {
            // 헤더에서 Refresh 토큰 가져옴
            const authorization = req.headers[AUTH_CONSTANT.AUTHORIZATION];
            if (!authorization) throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.JWT.NO_TOKEN);

            // Refresh 토큰이 Bearer 형식인지 확인
            const [tokenType, token] = authorization.split(' ');
            if (tokenType !== AUTH_CONSTANT.BEARER)
                throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.JWT.NOT_SUPPORTED_TYPE);

            // 서버에서 발급한 JWT가 맞는지 검증
            const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY);
            const userId = decodedToken.userId;

            // JWT에서 꺼낸 userId로 실제 사용자가 있는지 확인
            const user = await userService.getUserInfoById(userId);
            if (!user) throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.JWT.NO_USER);

            // DB에 저장된 RefreshToken를 조회
            // const refreshToken = await prisma.refreshToken.findFirst({ where: { UserId: user.userId } });
            const refreshToken = await authService.getRefreshToken(userId);
            // DB에 저장 된 RefreshToken이 없거나 전달 받은 값과 일치하지 않는 경우
            if (!refreshToken || refreshToken.token !== token) {
                throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.JWT.DISCARDED_TOKEN);
            }

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
