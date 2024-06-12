export class UserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    // 사용자 ID로 사용자 조회
    getUserInfo = async (userId) => {
        const user = await this.prisma.user.findFirst({
            where: { userId },
            omit: { password: true },
        });

        return user;
    };
}
