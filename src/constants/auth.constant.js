export const AUTH_CONSTANT = {
    // 해시에 사용한 salt
    HASH_SALT: 10,
    // 토큰 유효기간
    ACCESS_TOKEN_EXPIRED_IN: '12h',
    REFRESH_TOKEN_EXPIRED_IN: '7d',
    // 유효성 검사시 이메일 형식
    TLDS: ['com', 'net', 'kr'],
    // 유효성 검사시 최소 도메인 요소
    MIN_DOMAIN_SEGMENTS: 2,
    // 비밀번호 정규화
    PASSWORD_REGEXP: '^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,15}$',
    // 헤더 키 user agent
    USER_AGENT: 'user-agent',
    // 헤더 키 authorization
    AUTHORIZATION: 'authorization',
    // Bearer
    BEARER: 'Bearer',
};
