import { ERROR_CONSTANT } from '../constants/error.constant.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { HttpError } from '../errors/http.error.js';

export default (err, req, res, next) => {
    console.error(err);

    // joi에서 발생한 에러 처리
    if (err.isJoi) {
        return res
            .status(HTTP_STATUS.BAD_REQUEST)
            .json({ status: HTTP_STATUS.BAD_REQUEST, message: err.details[0].message });
    }

    // isJoi로 필터링되지 못한 에러 처리
    if (err.name === ERROR_CONSTANT.NAME.JOI) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: HTTP_STATUS.BAD_REQUEST, message: err.message });
    }

    // HttpError 클래스의 에러 처리
    // err instanceof HttpError.BadRequest는 err 객체가
    // HttpError.BadRequest 클래스의 인스턴스인지 확인하는 표현
    // 에러처리 미들웨어에서는 throw new HttpError 클래스 사용 안하게 좋음 => 루한루프에 빠질 수도 있어서
    if (
        err instanceof HttpError.BadRequest ||
        err instanceof HttpError.Unauthorized ||
        err instanceof HttpError.Forbidden ||
        err instanceof HttpError.NotFound ||
        err instanceof HttpError.Conflict ||
        err instanceof HttpError.InternalServerError
    ) {
        return res.status(err.status).json({
            status: err.status,
            message: err.message,
        });
    }

    // 그 밖의 예상치 못한 에러 처리
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: MESSAGES.AUTH.COMMON.INTERNAL_SERVER_ERROR,
    });
};
