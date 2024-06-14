# 🖥️ 나만의 채용 서비스 백엔드 서버 리팩토링
![썸네일](./imgs/thumbnail.png)


## 프로젝트 소개
- 프로젝트 이름 : SPA_Recruit_3_Layered
- 내용 : 기존 나만의 채용 서비스 백엔드 서버를 3-Layered Architecture Pattern 형태로 리팩토링
- 구분 : 개인 프로젝트
- 배포 : https://www.mymycode.shop/api/... (API 명세서 참조)


## 1. 개발 기간
- 2024.06.12 ~ 2024.06.14

<br>

## 2. 개발 환경
- BackEnd : Node.js, Express, MySQL(Prisma)
- Tool : AWS, Insomnia, DBeaver

<br>

## 3. API 명세서 및 ERD
 - API 명세서 : https://west-territory-778.notion.site/Node-js-API-ec55e0bdd9c24242a75c99766c90589e?pvs=4
 - ERD : https://drawsql.app/teams/nodejs-express/diagrams/spa-recruit

<br>

## 4. 주요 기능 및 설명
### 4-1. Jest 설치 및 설정
- jest, cross-env, @jest/globals 모듈 설치
```bash
# DevDependencies로 jest, cross-env 를 설치합니다.
yarn add -D jest cross-env @jest/globals
```
- Jest Config 설정
```javascript
export default {
    // 해당 패턴에 일치하는 경로가 존재할 경우 테스트를 하지 않고 넘어갑니다.
    testPathIgnorePatterns: ['/node_modules/'],
    // 테스트 실행 시 각 TestCase에 대한 출력을 해줍니다.
    verbose: true,
    // *.test.js, *.spec.js 파일만 테스트 파일로 인식해서 실행합니다.
    testRegex: '.*\\.(test|spec)\\.js$',
};
```
- Jest Script 설정
```javascript
// package.json

{
  ...

  "scripts": {
    ...

    "test": "cross-env NODE_ENV=test NODE_OPTIONS=--experimental-vm-modules jest --forceExit",
    "test:silent": "cross-env NODE_ENV=test NODE_OPTIONS=--experimental-vm-modules jest --silent --forceExit",
    "test:coverage": "cross-env NODE_ENV=test NODE_OPTIONS=--experimental-vm-modules jest --coverage --forceExit",
    "test:unit": "cross-env NODE_ENV=test NODE_OPTIONS=--experimental-vm-modules jest __tests__/unit --forceExit"
  },

  ...
}
```

<br>

### 4-2. 회원가입 Controller, Service, Repository
#### 4-2-1. 회원가입 Controller
- 이메일, 비밀번호, 비밀번호 확인, 이름을 Request Body(`req.body`)로 전달 받음

- 각종 에러 처리를 담당

- 사용자 ID, 역할, 생성일시, 수정일시는 자동 생성됨

- 보안을 위해 **비밀번호**는 평문(Plain Text)으로 저장하지 않고 **Hash** 된 값을 저장

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/controllers/auth.controller.js#L12

#### 4-2-2. 회원가입 Service
- Repository에 이메일로 사용자 정보를 요청하는 비즈니스 로직 수행

- `bcrypt` 모듈을 이용한 비밀번호 `Hashing`비즈니스 로직을 수행

- Repository에 사용자를 생성을 요청하는 비즈니스 로직 수행

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/services/auth.service.js#L9-L31

#### 4-2-3. 회원가입 Repository
- Prisma를 통해 직접 DB에 접근해서 이메일로 사용자 정보 조회 수행

- Prisma를 통해 직접 DB에 접근해서 사용자 생성 수행

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/repositories/auth.repository.js#L6-L26

<br>

### 4-3. 로그인 Controller, Service, Repository
#### 4-3-1. 로그인 Controller
- 이메일, 비밀번호를 Request Body(`req.body`)로 전달 받음

- **AccessToken**(Payload에 `사용자 ID`를 포함하고, 유효기한이 `12시간`)을 생성

- **RefreshToken**(Payload에 `사용자 ID`를 포함하고, 유효기한이 `7일`)을 생성

- 데이터베이스에 **RefreshToken**을 **생성** 또는 **갱신**

- Service에 토큰 재발급을 위한 사용자 ID 전달

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/controllers/auth.controller.js#L47

#### 4-3-2. 로그인 Service
- jwt 모듈을 사용해서 Access Token 발급하는 비즈니스 로직 수행

- jwt 모듈을 사용해서 Refresh Token 발급하는 비즈니스 로직 수행

- Repository에 기존 토근이 있으면 없데이터, 없으면 생성을 요청하는 비즈니스 로직 수행

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/services/auth.service.js#L33-L56

#### 4-3-3. 로그인 Repository
- Prisma를 통해 직접 DB에 접근해서 upsert 메서드 수행

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/repositories/auth.repository.js#L28


<br>

### 4-4. AccessToken 인증 Middleware 리팩토링
- **AccessToken**을 **Request Header**의 Authorization 값(`req.headers.authorization`)으로 전달 받음

- 조건문과 `try ~ catch문`을 이용해서 유효성 검사

- Payload에 담긴 **사용자 ID**를 이용하여 **사용자 정보를 조회**

- 조회 된 사용자 정보를 `req.user`에 담고, 다음 동작을 진행

- 데이터베이스에서 사용자 정보 중 `password`를 제외한 데이터를 가져오기 위해 Prisma `omit` 기능 사용

- (리팩토링) 기존의 Prisma 클라이언트를 통해 데이터베이스에 접근하는 코드를 Service 계층을 통해서 Repository -> DB 순서로 접근해서 데이터를 가져오도록 수정함

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/middlewares/auth.access.token.middleware.js#L8

<br>

### 4-5. 내 정보 조회 Controller, Service, Repository
#### 4-5-1. 내 정보 조회 Controller
- 사용자 정보는 인증 Middleware(`req.user`)를 통해서 전달 받음

- **사용자 ID, 이메일, 이름, 역할, 생성일시, 수정일시**를 반환

- `authMiddleware`를 통해서 사용자 검증을 거치기 때문에 DB에서 사용자 검색을 할 필요가 없음

- 그렇기에 Controller에서 Service에게 데이터를 요청할 필요가 없음

- 인증 미들웨어 -> Service -> Repository -> DB -> Repository -> Service -> 인증 미들웨어 -> Controller 순서로 실행됨

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/controllers/user.controller.js#L9

#### 4-5-2. 내 정보 조회 Service
- Repository에 사용자 ID로 사용자 정보를 요청하는 비즈니스 로직 수행

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/services/user.service.js#L7

#### 4-5-3. 내 정보 조회 Repository
- Prisma를 통해 직접 DB에 접근해서 사용자 ID로 사용자를 조회 수행

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/repositories/user.repository.js#L7


<br>

### 4-7. 이력서 생성 Controller, Service, Repository
#### 4-6-1. 이력서 생성 Controller
- 사용자 정보는 인증 Middleware(`req.user`)를 통해서 전달 받음

- 제목, 자기소개는 Request Body(`req.body`)로 전달 받음

- 이력서 ID, 지원 상태, 생성일시, 수정일시는 자동 생성

- Service에 이력서 생성에 필요한 데이터를 전달

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/controllers/resume.controller.js#L12-L29

#### 4-6-2. 이력서 생성 Service
- Repository에 이력서 생성 요청하는 비즈니스 로직 수행

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/services/resume.service.js#L10

#### 4-6-3. 이력서 생성 Repository
- Prisma를 통해 직접 DB에 접근해서 이력서 생성을 수행

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/repositories/resume.repository.js#L10


<br>

### 4-7. 이력서 목록 조회 Controller, Service, Repository
#### 4-7-1. 이력서 목록 조회 Controller
- 사용자 정보는 인증 Middleware(`req.user`)를 통해서 전달 받음

- Query Parameters(`req.query`)으로 정렬 조건을 받음

- Query Parameters(`req.query`)으로 필터링 조건을 받음

- 지원 상태 별 필터링 조건을 받음 ex) `sort=desc&status=APPLY`

- **현재 로그인 한 사용자**가 작성한 이력서 목록만 조회

- **역할**이 `RECRUITER` 인 경우 **모든 사용자의 이력서를 조회**할 수 있음

- 상태 코드와 에러 메시지 문자열을 constant로 따로 관리

- `where절`에는 객체가 들어가기에 `whereCondition`이라는 객체를 만들어서 조건문을 통해서 값을 결정함

- `sort` 쿼리에 `desc`, `acs` 둘 다 아닐 경우에 대해서 처리하지 않아서 추가함

- Service에 채용 담당자인지 판별하기 위한 데이터를 전달

- Service에 이력서 목록 조회를 위한 where절 객체와 데이터를 전달

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/controllers/resume.controller.js#L31

#### 4-7-2. 이력서 목록 조회 Service
- 채용 담당자인지를 판별하기 위한 비즈니스 로직 수행

- `whereCondition` 변수를 활용해서 검색 조건을 분기 처리함

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/services/resume.service.js#L16-L55

#### 4-7-3. 이력서 목록 조회 Repository
- Prisma를 통해 직접 DB에 접근해서 전달받은 `whereCondition`에 따라 이력서 목록 조회 수행

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/repositories/resume.repository.js#L18


<br>

### 4-8. 이력서 상세 조회 Controller, Service, Repository
#### 4-8-1. 이력서 상세 조회 Controller
- 사용자 정보는 인증 Middleware(`req.user`)를 통해서 전달 받음

- 이력서 ID를 Path Parameters(`req.params`)로 전달 받음

- **현재 로그인 한 사용자가 작성한 이력서만** 조회

- **역할**이 `RECRUITER` 인 경우 **이력서 작성 사용자와 일치하지 않아도** 이력서를 조회할 수 있음

- `where절`에는 객체가 들어가기에 `whereCondition`이라는 객체를 만들어서 조건문을 통해서 값을 결정함

- Service에 이력서 ID, 작성자 ID가 모두 일치한 이력서 조회를 위한 데이터 전송

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/controllers/resume.controller.js#L55

#### 4-8-2. 이력서 상세 조회 Service
- Repository에 이력서 ID, 작성자 ID가 모두 일치한 이력서 조회를 요청하는 비즈니스 로직 수행

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/services/resume.service.js#L57

#### 4-8-3. 이력서 상세 조회 Repository
- **작성자 ID가 아닌 작성자 이름을 반환**하기 위해 스키마에 정의 한 **Relation을 활용**해 조회 (include 문법 사용)

- Prisma를 통해 직접 DB에 접근해서 전달받은 `whereCondition`에 따라 이력서 목록 조회 수행

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/repositories/resume.repository.js#L29


<br>

### 4-9. 이력서 수정 Controller, Service, Repository
#### 4-9-1. 이력서 수정 Controller
- 사용자 정보는 인증 Middleware(`req.user`)를 통해서 전달 받음

- 이력서 ID를 Path Parameters(`req.params`)로 전달 받음

- 제목, 자기소개를 Request Body(`req.body`)로 전달 받음

- **현재 로그인 한 사용자가 작성한 이력서**만 수정할 수 있음

- 이력서 조회 시 **이력서 ID, 작성자 ID가 모두 일치**해야 함

- Service에 이력서 ID, 작성자 ID가 모두 일치한 이력서 조회를 위한 데이터 전송

- Service에 이력서 수정을 위한 수정 사항 데이터 전달

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/controllers/resume.controller.js#L77

#### 4-9-2. 이력서 수정 Service
- Repository에 이력서 수정을 요청하는 비즈니스 로직 수행

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/services/resume.service.js#L75

#### 4-9-3. 이력서 수정 Repository
- Prisma를 통해 직접 DB에 접근해서 전달받은 데이터로 이력서 수정 수행

- 제목, 자기소개가 수정이 될 수도 안될 수도 있기에 `...` 연산자를 통해서 구현

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/repositories/resume.repository.js#L39

<br>

### 4-10. 이력서 삭제 Controller, Service, Repository
#### 4-10-1. 이력서 삭제 Controller
- 사용자 정보는 인증 Middleware(`req.user`)를 통해서 전달 받음

- 이력서 ID를 Path Parameters(`req.params`)로 전달 받음

- **현재 로그인 한 사용자가 작성한 이력서만** 삭제

- 이력서 조회 시 **이력서 ID, 작성자 ID가 모두 일치**해야 함

- Service에 이력서 ID에 해당하는 이력서 조회를 위한 이력서 ID 전달(이력서 유무 파악)

- Service에 이력서 삭제를 위한 이력서 ID 전달

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/controllers/resume.controller.js#L105

#### 4-10-2. 이력서 삭제 Service
- Repository에 이력서 삭제 요청을 하기 위한 비즈니스 로직 수행

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/services/resume.service.js#L83

#### 4-10-3. 이력서 삭제 Repository
- Prisma를 통해 직접 DB에 접근해서 전달받은 이력서 ID와 같은 이력서 삭제 수행

- DB에서 이력서 정보를 직접 삭제 (Hard Delete)

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/repositories/resume.repository.js#L53

<br>


### 4-11. 이력서 지원 상태 변경 Controller, Service, Repository
#### 4-11-1. 이력서 지원 상태 변경 Controller
- 사용자 정보는 인증 Middleware(`req.user`)를 통해서 전달 받음

- **이력서 ID**를 Path Parameters(`req.params`)로 전달 받음

- **지원 상태, 사유**를 **Request Body**(**`req.body`**)로 전달 받음

- Service에 이력서 ID에 해당하는 이력서 조회를 위한 이력서 ID 전달(이력서 유무 파악)

- Service에 이력서 상태를 변경하기 위한 데이터 전달

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/controllers/resume.controller.js#L131

#### 4-11-2. 이력서 지원 상태 변경 Service
- Repository에 이력서 상태 변경을 요청하기 위한 비즈니스 로직 수행

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/services/resume.service.js#L89


#### 4-11-3. 이력서 지원 상태 변경 Repository
- Prisma를 통해 직접 DB에 접근해서 이력서 수정 및 로그 생성 수행

- 이력서 정보 수정과 이력서 로그 생성을 **Transaction**으로 묶어서 실행

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/repositories/resume.repository.js#L62

<br>

### 4-12. 이력서 로그 목록 조회 Controller, Service, Repository
#### 4-12-1. 이력서 로그 목록 조회 Controller
- **이력서 ID**를 Path Parameters(`req.params`)로 전달 받음

- **생성일시** 기준 **최신순**으로 조회

- Service에 이력서 ID에 해당하는 이력서 조회를 위한 이력서 ID 전달(이력서 유무 파악)

- Service에 이력서 로그 조회를 위한 이력서 ID 전달

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/controllers/resume.controller.js#L163

#### 4-12-2. 이력서 로그 목록 조회 Service
- Repository에 이력서 로그 조회를 요청하기 위한 비즈니스 로직 수행

- 반환된 데이터를 출력 양식에 알맞게 수정

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/services/resume.service.js#L96

#### 4-12-3. 이력서 로그 목록 조회 Repository
- Prisma를 통해 직접 DB에 접근해서 이력서 로그 목록 조회 수행

- **채용 담당자 이름**을 반환하기 위해 스키마에 정의 한 **Relation**을 활용해 조회

- `include`를 사용해서 참조된 User 정보를 가져옴

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/repositories/resume.repository.js#L85


<br>

### 4-13. 토큰 재발급 Controller, Service, Repository
#### 4-13-1. 토큰 재발급 Controller
- AccessToken 만료 시 RefreshToken을 활용해 재발급

- **RefreshToken**(JWT)을 **Request Header의 Authorization** 값(**`req.headers.authorization`**)으로 전달 받음

- 사용자 정보는 인증 Middleware(`req.user`)를 통해서 전달 받음 

- **AccessToken(Payload**에 `사용자 ID`를 포함하고, **유효기한**이 `12시간`)을 재발급

- **RefreshToken** (**Payload**: **사용자 ID** 포함, **유효기한**: **`7일`**)을 재발급

- Service에 토큰 재발급을 위한 사용자 ID 전달

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/controllers/auth.controller.js#L82

#### 4-13-2. 토큰 재발급 Service
- jwt 모듈을 사용해서 Access Token 발급하는 비즈니스 로직 수행

- jwt 모듈을 사용해서 Refresh Token 발급하는 비즈니스 로직 수행

- Repository에 기존 토근이 있으면 없데이터, 없으면 생성을 요청하는 비즈니스 로직 수행

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/services/auth.service.js#L33-L56

#### 4-13-3. 토큰 재발급 Repository
- Prisma를 통해 직접 DB에 접근해서 Refresh 토큰 생성 수행

- 이미 토큰이 존재하면 업데이트 수행

- RefreshToken은 **DB에서 보관**하기 때문에 DB의 데이터를 갱신

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/repositories/auth.repository.js#L28

<br>

### 4-14. 로그아웃 Controller, Service, Repository
#### 4-14-1. 로그아웃 Controller
- **RefreshToken**(JWT)을 **Request Header의 Authorization** 값(**`req.headers.authorization`**)으로 전달 받음

- 사용자 정보는 인증 Middleware(`req.user`)를 통해서 전달 받음

- RefreshToken은 **DB에서 보관**하기 때문에 DB의 데이터를 삭제

- 실제로는 AccessToken이 만료되기 전까지는 AccessToken이 필요한 API는 사용 가능함

- Service에 Refresh Token을 삭제하기 위한 사용자 ID 전달

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/controllers/auth.controller.js#L112

#### 4-14-2. 로그아웃 Service
- Repository에 저장된 Refresh Token를 조회 요청하기 위한 비즈니스 로직 수행

- Repository에 저장된 Refresh Token를 삭제 요청하기 위한 비즈니스 로직 수행

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/services/auth.service.js#L65-L77

#### 4-14-3. 로그아웃 Repository
- Prisma를 통해 직접 DB에 접근해서 Refresh Token 조회 진행

- Prisma를 통해 직접 DB에 접근해서 Refresh Token 삭제 진행 (Hard Delete)

- https://github.com/jkc-mycode/spa_recruit_3_layered/blob/2d53125edda3986f3bccb1513cb2d6c8d76f4581/src/repositories/auth.repository.js#L49-L64

<br>

## 5. 테스트 코드(미완성)
### 5-1. 회원가입 Controller, Service, Repository 단위 테스트 코드
- 


<br>

### 5-2. 로그인 Controller, Service, Repository 단위 테스트 코드
- 


<br>

### 5-3. 내 정보 조회 Controller, Service, Repository 단위 테스트 코드
- 

<br>

### 5-4. 이력서 생성 Controller, Service, Repository  단위 테스트 코드
- 


<br>

### 5-5. 이력서 목록 조회 Controller, Service, Repository 단위 테스트 코드
- 


<br>

### 5-6.이력서 상세 조회 Controller, Service, Repository 단위 테스트 코드
- 


<br>

### 5-7. 이력서 수정 Controller, Service, Repository 단위 테스트 코드
- 


<br>

### 5-8. 이력서 삭제 Controller, Service, Repository 단위 테스트 코드
- 


<br>


### 5-9. 이력서 지원 상태 변경 Controller, Service, Repository 단위 테스트 코드
- 


<br>

### 5-10. 이력서 로그 목록 조회 Controller, Service, Repository 단위 테스트 코드
- 


<br>

### 5-11. 토큰 재발급 Controller, Service, Repository 단위 테스트 코드
- 


<br>

### 5-12. 로그아웃 Controller, Service, Repository 단위 테스트 코드
- 

<br>

## 6. 테스트 사진 첨부
- 회원가입 API
![회원가입 API](./imgs/sign-up.png)

- 로그인 API
![로그인 API](./imgs/sign-in.png)

- 내 정보 조회 API
![내 정보 조회 API](./imgs/user_info.png)

- 이력서 생성 API
![이력서 생성 API](./imgs/resume_create.png)

- 이력서 목록 조회 API
![이력서 목록 조회 API](./imgs/resume_list.png)

- 이력서 상세 조회 API
![이력서 상세 조회 API](./imgs/resume_detail.png)

- 이력서 수정 API
![이력서 수정 API](./imgs/resume_update.png)

- 이력서 삭제 API
![이력서 삭제 API](./imgs/resume_delete.png)

- 이력서 지원 상태 변경 API
![이력서 지원 상태 변경 API](./imgs/resume_change_state.png)

- 이력서 로그 목록 조회 API
![이력서 로그 목록 조회 API](./imgs/resume_log_list.png)

- 토큰 재발급 API
![토큰 재발급 API](./imgs/token_refresh.png)

- 로그아웃 API
![로그아웃 API](./imgs/sign-out.png)

<br>

## 7. 어려웠던 점
### 7-1. 
- 

<br>

### 7-2. 
- 

<br>

### 7-3. 
- 