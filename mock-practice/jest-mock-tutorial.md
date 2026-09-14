# Jest Mock 연습 튜토리얼

Jest Mock을 **초급 → 중급 → 고급** 순서로 연습하기 위한 커리큘럼입니다.

핵심 목표는 단순히 `jest.fn()` 문법을 외우는 것이 아니라,

> **어떤 것을 mock해야 하고, 어디까지 실제 코드를 실행해야 하는지 판단하는 능력**

을 익히는 것입니다.

---

## 학습 환경

### Node 환경으로 가능한 단계

다음 단계들은 DOM이 필요하지 않으므로 Jest의 `node` 환경에서 진행해도 됩니다.

- 초급 1: `jest.fn()`
- 초급 2: `mockReturnValue()`
- 초급 3: `mockResolvedValue()` / `mockRejectedValue()`
- 중급 1: `global.fetch` mock
- 중급 2: module mock

### Browser-like (`jsdom`) 환경이 필요한 단계

React Testing Library를 사용하는 순간부터는 `jsdom` 환경이 필요합니다.

- RTL `render()`
- `screen.getByRole()`
- `userEvent.click()`
- `userEvent.type()`

즉 추천 흐름은 다음과 같습니다.

```text
Jest Mock 자체 연습
        ↓
Node 환경
        ↓
React / RTL 진입
        ↓
Browser-like(jsdom)
```

---

# 1. 초급 — `jest.fn()` 이해하기

## 목표

가짜 함수를 만들고, 그 함수가 어떻게 호출됐는지 확인합니다.

```ts
const mockFn = jest.fn();

mockFn("hello", 123);

expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(1);
expect(mockFn).toHaveBeenCalledWith("hello", 123);
```

Jest mock 함수는 호출 기록도 가지고 있습니다.

```ts
console.log(mockFn.mock.calls);
console.log(mockFn.mock.results);
```

### 연습 문제

다음 함수가 있습니다.

```ts
function execute(callback: (value: string) => void) {
  callback("hello");
}
```

테스트에서 `callback`으로 `jest.fn()`을 넘기고 다음을 확인해보세요.

- callback이 호출되었는가?
- 정확히 한 번 호출되었는가?
- `"hello"`를 인자로 받았는가?

---

# 2. 초급 — 반환값 조작하기

## `mockReturnValue`

```ts
const mockFn = jest.fn();

mockFn.mockReturnValue(10);

expect(mockFn()).toBe(10);
```

## 호출마다 다른 값 반환하기

```ts
const mockFn = jest.fn();

mockFn
  .mockReturnValueOnce(10)
  .mockReturnValueOnce(20)
  .mockReturnValue(30);
```

다음 결과를 직접 예측해보세요.

```ts
mockFn(); // ?
mockFn(); // ?
mockFn(); // ?
mockFn(); // ?
```

정답:

```text
1회차 → 10
2회차 → 20
3회차 → 30
4회차 → 30
```

---

# 3. 초급 — 비동기 Mock

API 테스트에서 매우 자주 사용하는 부분입니다.

## Promise 성공

```ts
const mockApi = jest.fn()
  .mockResolvedValue({
    name: "Octocat",
  });

await expect(mockApi()).resolves.toEqual({
  name: "Octocat",
});
```

`mockResolvedValue(value)`는 사실상 다음과 비슷합니다.

```ts
jest.fn(() => Promise.resolve(value));
```

## Promise 실패

```ts
const mockApi = jest.fn()
  .mockRejectedValue(
    new Error("NOT_FOUND")
  );

await expect(
  mockApi()
).rejects.toThrow("NOT_FOUND");
```

`mockRejectedValue(error)`는 다음과 비슷합니다.

```ts
jest.fn(() => Promise.reject(error));
```

### 꼭 기억할 것

```text
mockResolvedValue
→ Promise 성공

mockRejectedValue
→ Promise 실패
```

---

# 4. 중급 — HTTP 404와 Promise reject의 차이

매우 중요한 개념입니다.

`fetch()`는 HTTP 404나 500이 발생해도 Promise 자체를 reject하지 않습니다.

예를 들어:

```ts
const response = await fetch("/users/test");
```

서버가 404를 반환하면:

```ts
response.status // 404
response.ok     // false
```

하지만 `fetch()` 자체는 정상적으로 resolve됩니다.

즉:

```text
200
→ fetch resolve
→ response.ok = true

404
→ fetch resolve
→ response.ok = false

500
→ fetch resolve
→ response.ok = false

네트워크 연결 자체 실패
→ fetch reject
```

그래서 직접 상태 코드를 처리해야 합니다.

```ts
async function fetchUser(username: string) {
  const response = await fetch(
    `https://api.github.com/users/${username}`
  );

  if (response.status === 404) {
    throw new Error("USER_NOT_FOUND");
  }

  if (!response.ok) {
    throw new Error("FETCH_FAILED");
  }

  return response.json();
}
```

---

# 5. 중급 — `global.fetch` Mock

`fetchUser()` 함수 자체를 테스트하려고 한다면  
`fetchUser()`를 mock하면 안 됩니다.

그 함수보다 아래 단계인 `fetch()`를 mock합니다.

```ts
global.fetch = jest.fn().mockResolvedValue({
  ok: false,
  status: 404,
});
```

테스트:

```ts
await expect(
  fetchUser("unknown-user")
).rejects.toThrow("USER_NOT_FOUND");
```

흐름은 다음과 같습니다.

```text
fetchUser()
    ↓
실제 fetchUser 코드 실행
    ↓
mock된 global.fetch()
    ↓
{ status: 404, ok: false }
    ↓
fetchUser 내부의 404 처리 실행
    ↓
USER_NOT_FOUND throw
```

## 핵심 원칙

> **내가 테스트하고 싶은 함수는 실제로 실행하고, 그 함수가 의존하는 외부 경계를 mock한다.**

---

# 6. 중급 — Module Mock

이번에는 구조가 다음과 같다고 가정합니다.

```text
GithubUserSearch
       ↓
fetchGithubUser
       ↓
fetch
```

`GithubUserSearch`를 테스트할 때는 `fetch()`까지 내려갈 필요가 없습니다.

`fetchGithubUser` 자체를 mock합니다.

```ts
jest.mock("@/lib/github");
```

```ts
const mockedFetchGithubUser =
  jest.mocked(fetchGithubUser);
```

성공:

```ts
mockedFetchGithubUser.mockResolvedValue({
  login: "octocat",
});
```

실패:

```ts
mockedFetchGithubUser.mockRejectedValue(
  new Error("USER_NOT_FOUND")
);
```

## 테스트 경계 구분

```text
fetchGithubUser.test.ts
→ global.fetch를 mock

GithubUserSearch.test.tsx
→ fetchGithubUser를 mock
```

이 구분을 자연스럽게 할 수 있게 되는 것이 중요한 목표입니다.

---

# 7. 중급 — React Props Callback Mock

다음 컴포넌트를 생각해봅시다.

```tsx
<Search onSearch={onSearch} />
```

`Search` 테스트에서는 부모 컴포넌트의 실제 검색 로직까지 테스트할 필요가 없습니다.

```ts
const onSearch = jest.fn();
```

을 넘깁니다.

```tsx
const onSearch = jest.fn();
const user = userEvent.setup();

render(
  <Search onSearch={onSearch} />
);

await user.type(
  screen.getByRole("searchbox"),
  "octocat"
);

await user.click(
  screen.getByRole("button", {
    name: "Search",
  })
);

expect(onSearch)
  .toHaveBeenCalledWith("octocat");
```

여기서 테스트 대상은 다음뿐입니다.

> 사용자가 검색했을 때 `Search`가 부모에게 올바른 username을 전달하는가?

---

# 8. 중급 — 호출마다 다른 결과 만들기

실제 UI 시나리오를 만들 때 유용합니다.

```ts
mockedFetchGithubUser
  .mockResolvedValueOnce(userA)
  .mockRejectedValueOnce(
    new Error("USER_NOT_FOUND")
  )
  .mockResolvedValueOnce(userB);
```

그러면:

```text
첫 번째 검색
→ 성공

두 번째 검색
→ 실패

세 번째 검색
→ 성공
```

같은 테스트를 만들 수 있습니다.

예를 들어 다음 같은 버그를 찾을 수 있습니다.

> 첫 검색 성공 후 다음 검색이 실패했는데 이전 사용자 정보가 계속 남아 있는가?

---

# 9. 중급 — `mockImplementation`

고정된 반환값이 아니라 입력값에 따라 동작을 바꾸고 싶다면 사용합니다.

```ts
mockedFetchGithubUser.mockImplementation(
  async (username) => {
    if (username === "octocat") {
      return mockUser;
    }

    throw new Error("USER_NOT_FOUND");
  }
);
```

예:

```text
octocat
→ 성공

anything-else
→ USER_NOT_FOUND
```

## 주의

Mock 내부에 너무 많은 로직을 넣으면 안 됩니다.

예를 들어 mock에:

```text
조건문
validation
mapping
business logic
```

이 잔뜩 들어가기 시작하면 mock 자체가 너무 복잡해집니다.

Mock은 가능한 한 단순하게 유지합니다.

---

# 10. 고급 — `jest.spyOn()`

`jest.fn()`과 `spyOn()`의 차이를 이해합니다.

```ts
const calculator = {
  add(a: number, b: number) {
    return a + b;
  },
};
```

```ts
const spy = jest.spyOn(
  calculator,
  "add"
);

calculator.add(1, 2);

expect(spy)
  .toHaveBeenCalledWith(1, 2);
```

`spyOn()`의 중요한 특징은 기본적으로 **원래 구현도 실행된다는 것**입니다.

필요하면 구현을 바꿀 수도 있습니다.

```ts
spy.mockImplementation(() => 100);
```

```ts
calculator.add(1, 2);
// 100
```

---

# 11. 고급 — clear / reset / restore

세 가지는 비슷해 보이지만 역할이 다릅니다.

## `mockClear()`

호출 기록만 삭제합니다.

```ts
mockFn.mockClear();
```

초기화되는 것:

```text
calls
instances
contexts
results
```

Mock 구현 자체는 유지됩니다.

---

## `mockReset()`

호출 기록과 mock 구현을 초기화합니다.

```ts
mockFn.mockReset();
```

예를 들어:

```ts
mockFn.mockReturnValue(10);
```

도 제거됩니다.

---

## `mockRestore()`

원래 구현으로 복구합니다.

주로 `jest.spyOn()`과 함께 사용합니다.

```ts
const spy = jest.spyOn(
  calculator,
  "add"
);

spy.mockImplementation(() => 100);

spy.mockRestore();
```

그러면 원래 `add()` 구현으로 돌아갑니다.

### 요약

```text
mockClear()
→ 호출 기록 삭제

mockReset()
→ 호출 기록 + Mock 구현 초기화

mockRestore()
→ 원래 구현으로 복구
```

---

# 12. 고급 — MSW

Jest에서 직접:

```ts
global.fetch = jest.fn(...)
```

을 사용하는 대신 **MSW(Mock Service Worker)**를 사용할 수도 있습니다.

개념적으로:

```text
Component
    ↓
fetchGithubUser()
    ↓
fetch()
    ↓
MSW
    ↓
Mock HTTP Response
```

예:

```text
GET /users/octocat
→ 200

GET /users/unknown
→ 404
```

MSW를 사용하면 실제 애플리케이션의 네트워크 요청 구조는 그대로 두면서 서버 응답만 가짜로 만들 수 있습니다.

따라서 integration test 연습에 좋습니다.

---

# 13. 최종 단계 — 무엇을 Mock하지 않을 것인가

Mock 공부의 최종 목표는 **무조건 많이 mock하는 것**이 아닙니다.

오히려:

> 이건 굳이 mock하지 않아도 된다.

를 판단하는 것이 중요합니다.

## 일반적으로 Mock하지 않는 것

```text
useState
map()
filter()
순수 함수
간단한 UI 컴포넌트
React 내부 구현
```

예를 들어 `useState`:

```tsx
const [username, setUsername] =
  useState("");
```

를 직접 mock하는 대신 사용자 행동을 테스트합니다.

```tsx
await user.type(
  screen.getByRole("searchbox"),
  "octocat"
);

expect(
  screen.getByRole("searchbox")
).toHaveValue("octocat");
```

---

## Mock 후보

다음처럼 외부 환경에 의존하는 것들은 Mock 후보입니다.

```text
외부 API
Database
현재 시간(Date)
random
브라우저 API
외부 라이브러리
다른 레이어의 service 함수
```

---

# GitHub User Search 프로젝트에서의 Mock 경계

현재 프로젝트 구조를 예로 들면:

```text
GithubUserSearch
├── Search
└── Result
       ↓
handleSearch()
       ↓
fetchGithubUser()
       ↓
fetch()
       ↓
GitHub REST API
```

테스트는 다음처럼 나눌 수 있습니다.

## `Search.test.tsx`

```text
실제 Search 사용

onSearch
→ jest.fn()으로 mock
```

검증:

```text
입력 가능
버튼 클릭
onSearch(username) 호출
```

---

## `Result.test.tsx`

가능하면 mock이 거의 필요 없습니다.

```text
user = null
→ 아무것도 렌더링하지 않음

user 있음
→ 사용자 정보 렌더링

loading
→ Loading 표시

error
→ Error 표시
```

---

## `fetchGithubUser.test.ts`

```text
fetchGithubUser
→ 실제 실행

global.fetch
→ mock
```

검증:

```text
200
→ user 반환

404
→ USER_NOT_FOUND

500
→ FETCH_FAILED
```

---

## `GithubUserSearch.test.tsx`

```text
GithubUserSearch
→ 실제 실행

fetchGithubUser
→ mock
```

검증:

```text
검색 성공
→ 사용자 결과 표시

검색 실패
→ Error 표시

요청 진행 중
→ Loading 표시
```

---

# 가장 중요한 Mock 사고방식

테스트를 작성하기 전에 항상 다음 질문을 해봅니다.

```text
1. 지금 내가 테스트하려는 대상은 무엇인가?

2. 이 대상이 직접 의존하는 것은 무엇인가?

3. 그 의존성을 실제로 실행할 필요가 있는가?

4. 외부 환경이나 다른 레이어라면 mock할 수 있는가?
```

예를 들어:

```text
fetchGithubUser를 테스트한다
```

라면:

```text
fetchGithubUser   ← 실제
fetch             ← mock
GitHub API        ← 호출 안 함
```

반대로:

```text
GithubUserSearch를 테스트한다
```

라면:

```text
GithubUserSearch  ← 실제
fetchGithubUser   ← mock
fetch             ← 신경 쓰지 않음
GitHub API        ← 호출 안 함
```

이 경계를 잡는 감각이 Jest Mock에서 가장 중요합니다.

---

# 추천 학습 순서

```text
Level 1
jest.fn()

Level 2
mockReturnValue
mockReturnValueOnce

Level 3
mockResolvedValue
mockRejectedValue

Level 4
global.fetch mock

Level 5
module mock

Level 6
RTL + callback mock

Level 7
호출마다 다른 결과

Level 8
mockImplementation

Level 9
jest.spyOn()

Level 10
clear / reset / restore

Level 11
MSW

Level 12
무엇을 mock하지 않을지 판단
```

---

# 최종 목표

다음 상황을 봤을 때 바로 판단할 수 있으면 됩니다.

```text
"이 함수의 로직을 테스트하고 싶다."
        ↓
그 함수는 실제로 실행

"이 함수가 외부 API에 의존한다."
        ↓
외부 API 경계를 mock

"부모 컴포넌트의 callback을 받는다."
        ↓
callback을 jest.fn()으로 mock

"React state가 바뀌는지 보고 싶다."
        ↓
useState를 mock하지 말고 UI 결과 확인
```

Mock의 목적은 테스트 대상의 내부를 전부 가짜로 만드는 것이 아니라,

> **테스트하고 싶은 부분만 실제로 실행하고, 그 밖의 불필요한 외부 의존성을 통제하는 것**

입니다.
