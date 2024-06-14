export class AuthRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    // 기존 토큰이 있으면 업데이트 없으면 생성
    upsertRefreshToken = async (userId, token, ip, userAgent) => {
        await this.prisma.refreshToken.upsert({
            where: { userId },
            update: { token, createdAt: new Date(Date.now()) },
            create: { userId, token, ip, userAgent },
        });

        return;
    };

    // DB에 저장된 RefreshToken를 조회
    getRefreshToken = async (userId) => {
        const refreshToken = await this.prisma.refreshToken.findFirst({ where: { userId } });

        return refreshToken;
    };

    // DB에서 Refresh Token 삭제
    deleteRefreshToken = async (userId) => {
        const deletedTokenUserId = await this.prisma.refreshToken.delete({
            where: { userId },
            select: { userId: true },
        });

        return deletedTokenUserId;
    };
}
