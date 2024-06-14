export class UserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    // 사용자 생성
    createUser = async (email, password, name, age, gender, profileImage) => {
        const user = await this.prisma.user.create({
            data: {
                email,
                password,
                name,
                age,
                gender,
                profileImage,
            },
        });

        return user;
    };

    // 사용자 ID로 사용자 조회
    getUserInfoById = async (userId) => {
        const user = await this.prisma.user.findFirst({
            where: { userId },
            omit: { password: true },
        });

        return user;
    };

    // 사용자 ID로 사용자 조회
    getUserInfoByEmail = async (email) => {
        const user = await this.prisma.user.findFirst({
            where: { email },
        });

        return user;
    };
}
