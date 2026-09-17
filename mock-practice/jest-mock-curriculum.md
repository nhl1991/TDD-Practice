# Jest Mock Curriculum

React/RTL/컴포넌트 테스트를 제외하고, **Jest Mock 자체를 익히기 위한 커리큘럼**입니다.

---

## 1. Beginner — Mock 기본

### 핵심 개념

- `jest.fn()`
- `toHaveBeenCalled()`
- `toHaveBeenCalledTimes()`
- `toHaveBeenCalledWith()`
- `mock.calls`
- `mock.results`

### 예제

```ts
const callback = jest.fn();

function runCallback(cb: (value: string) => void) {
  cb("hello");
}

runCallback(callback);

expect(callback).toHaveBeenCalledWith("hello");
```

### 반환값 Mock

- `mockReturnValue()`
- `mockReturnValueOnce()`

```ts
const mockFn = jest.fn()
  .mockReturnValueOnce(10)
  .mockReturnValueOnce(20)
  .mockReturnValue(30);
```

### 비동기 Mock

- `mockResolvedValue()`
- `mockRejectedValue()`

```ts
const mockApi = jest.fn()
  .mockResolvedValue({ id: 1 });

await expect(mockApi())
  .resolves.toEqual({ id: 1 });
```

---

## 2. Intermediate — 실제 의존성 Mock

테스트 대상 함수는 실제 구현을 사용하고, 그 아래 의존성을 Mock 처리합니다.

```text
fetchUser
   ↓
global.fetch ← Mock
```

### 성공 응답

```ts
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  status: 200,
  json: async () => ({ login: "octocat" }),
});
```

### HTTP 404 / 500

```ts
global.fetch = jest.fn().mockResolvedValue({
  ok: false,
  status: 404,
});
```

HTTP 404나 500은 **fetch 자체가 reject되는 것이 아니라 Response 객체로 resolve**됩니다.

### 네트워크 오류

```ts
global.fetch = jest.fn().mockRejectedValue(
  new TypeError("Failed to fetch")
);
```

이 경우는 fetch 자체가 reject됩니다.

### 권장 실습

```text
200 → 성공
404 → wrapper가 NOT_FOUND throw
500 → wrapper가 SERVER_ERROR throw
network error → fetch 자체 reject
```

---

## 3. Intermediate — `mockImplementation()`

입력값에 따라 Mock 함수의 동작을 다르게 만들 때 사용합니다.

```ts
const mockFn = jest.fn().mockImplementation(
  (value: number) => value * 2
);

expect(mockFn(2)).toBe(4);
expect(mockFn(10)).toBe(20);
```

### fetch에 적용

```ts
global.fetch = jest.fn().mockImplementation(
  async (url) => {
    if (url === "/users/octocat") {
      return {
        ok: true,
        status: 200,
        json: async () => ({ login: "octocat" }),
      } as Response;
    }

    return {
      ok: false,
      status: 404,
    } as Response;
  }
);
```

### 호출 횟수별 다른 동작

- `mockImplementationOnce()`
- `mockResolvedValueOnce()`
- `mockRejectedValueOnce()`

```ts
global.fetch = jest.fn()
  .mockRejectedValueOnce(new Error("network"))
  .mockResolvedValueOnce({
    ok: true,
    json: async () => ({ success: true }),
  });
```

재시도 로직 테스트에 유용합니다.

---

## 4. Intermediate — Module Mock

### 핵심 API

- `jest.mock()`
- `jest.mocked()`

```ts
import { getUser } from "../src/user";

jest.mock("../src/user");

const mockedGetUser = jest.mocked(getUser);
```

### 역할 차이

```text
jest.mock()
→ 실제 module을 Mock으로 교체

jest.mocked()
→ 이미 Mock된 함수에 TypeScript Mock 타입을 적용
```

### 예제

```ts
mockedGetUser.mockResolvedValue({
  login: "octocat",
});
```

### Mock 경계

```text
A → B → C
```

A를 테스트한다면:

```text
A 테스트
→ B Mock
→ 실제 B와 C는 실행되지 않음
```

B를 테스트한다면:

```text
B 테스트
→ C Mock
```

즉, Mock한 지점 아래의 실제 구현은 실행되지 않습니다.

---

## 5. Intermediate — `jest.spyOn()`

기존 함수를 감시하면서 실제 구현을 유지하고 싶을 때 사용합니다.

```ts
const math = {
  add(a: number, b: number) {
    return a + b;
  },
};

const spy = jest.spyOn(math, "add");

math.add(1, 2);

expect(spy).toHaveBeenCalledWith(1, 2);
```

### 구현 변경

```ts
jest.spyOn(math, "add")
  .mockImplementation(() => 100);
```

### async 함수

```ts
jest.spyOn(api, "getUser")
  .mockResolvedValue(mockUser);
```

---

## 6. Advanced — Clear / Reset / Restore

### 개별 Mock

```text
mockClear()
→ 호출 기록만 삭제

mockReset()
→ 호출 기록 + Mock 구현 초기화

mockRestore()
→ spyOn으로 변경한 실제 함수 원복
```

### 전체 Mock

```ts
jest.clearAllMocks();
jest.resetAllMocks();
jest.restoreAllMocks();
```

### 주의

```ts
global.fetch = jest.fn();
```

처럼 직접 교체한 경우:

```ts
jest.resetAllMocks();
```

를 호출해도 원래 fetch 함수로 자동 복구되지는 않습니다.

---

## 7. Advanced — 시간 Mock

현재 시각에 의존하는 코드를 테스트할 때 사용합니다.

```ts
jest.useFakeTimers();

jest.setSystemTime(
  new Date("2026-09-17T10:00:00")
);

expect(new Date().getMonth()).toBe(8);

jest.useRealTimers();
```

### 연습 대상

- 현재 월에 따라 달라지는 로직
- 캐시 만료 시간
- 토큰 만료
- 일정 시간 이후 재시도

---

## 8. Advanced — Random / 환경변수 / 외부 상태

### Random

```ts
jest.spyOn(Math, "random")
  .mockReturnValue(0.5);
```

### 환경변수

```ts
process.env.API_KEY = "test-key";
```

테스트가 끝난 뒤 원래 상태로 복구하는 것도 중요합니다.

```ts
const originalEnv = process.env;

afterEach(() => {
  process.env = originalEnv;
});
```

---

## 9. Advanced — Partial Module Mock

모듈 전체가 아니라 일부 함수만 Mock 처리할 수 있습니다.

```ts
jest.mock("../utils", () => {
  const actual = jest.requireActual("../utils");

  return {
    ...actual,
    getCurrentTime: jest.fn(() => 12345),
  };
});
```

구조는 다음과 같습니다.

```text
module
├─ 함수 A → 실제 구현
├─ 함수 B → 실제 구현
└─ 함수 C → Mock
```

---

## 10. Advanced — Mock을 쓰지 말아야 할 때 판단

Mock 자체를 잘 쓰는 것보다 **어디에서 Mock을 끊을지 판단하는 능력**이 더 중요합니다.

### Mock할 가능성이 높은 대상

```text
fetch
DB
filesystem
Date
random
외부 SDK
다른 service/module
```

### 웬만하면 실제 구현을 사용하는 대상

```text
단순 순수 함수
map/filter
단순 데이터 변환
상수
type
```

---

# 추천 학습 순서

```text
Beginner

jest.fn
→ calls
→ returnValue
→ resolved/rejected


Intermediate

global.fetch
→ HTTP error vs reject
→ mockImplementation
→ module mock
→ jest.mocked
→ spyOn


Advanced

clear/reset/restore
→ Date/timer
→ random/env
→ partial mock
→ Mock 경계 설계
```

특히 다음 5개를 반복해서 연습하면 Mock 감각을 빠르게 잡을 수 있습니다.

```text
global.fetch
→ mockImplementation
→ jest.mock
→ jest.mocked
→ spyOn
```
