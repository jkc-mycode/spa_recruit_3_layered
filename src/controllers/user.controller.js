import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

export class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    getUserInfo = async (req, res) => {
        const user = req.user;

        return res
            .status(HTTP_STATUS.OK)
            .json({ status: HTTP_STATUS.OK, message: MESSAGES.USER.READ.SUCCEED, data: { user } });
    };
}
