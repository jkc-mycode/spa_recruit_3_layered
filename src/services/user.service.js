export class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    // 사용자 ID로 사용자 조회
    getUserInfoById = async (userId) => {
        const user = await this.userRepository.getUserInfoById(userId);

        return user;
    };
}
