
// # Intermediate Test Cases for Mock Practice 1

import { fetchUser } from "../src/intermediate";
import { getUser } from "../src/module/user";

// import된 getUser의 실제 구현을 Jest mock으로 교체
jest.mock("../src/module/user");
describe("4. 중급 — HTTP 404와 Promise reject의 차이", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });
  // fetch 자체는 HTTP 404나 500을 반환해도 reject되지 않는다.
  it("fetch는 HTTP 404를 반환해도 reject되지 않는다", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 404,
      ok: false,
    });

    // response.ok가 false여도 fetch는 reject되지 않는다.
    await expect(global.fetch('https://api.github.com/users/octocat')).resolves.toEqual({
      status: 404,
      ok: false,
    });

    await expect(fetchUser('https://api.github.com/users/octocat')).rejects.toThrow('User not found');
  });

  it("fetch는 HTTP 500를 반환해도 reject되지 않는다", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 500,
      ok: false,
    });

    // const response =  await fetchUser('https://api.github.com/users/octocat');
    await expect(global.fetch('https://api.github.com/users/octocat')).resolves.toEqual({
      status: 500,
      ok: false,
    });

    await expect(fetchUser('https://api.github.com/users/octocat')).rejects.toThrow('Server error');
  });

  it("# 6. 중급 — Module Mock", async () => {
    // Module Mock 테스트 케이스 작성
    // TypeScript에게 이 함수가 Jest mock이라는 타입 정보 제공
    const mockedGetUser = jest.mocked(getUser);
    mockedGetUser.mockResolvedValue({ login: 'octocat' } as any);
    await expect(mockedGetUser('https://api.github.com/users/octocat')).resolves.toEqual({ login: 'octocat' });
  });
});

// # 5. 중급 — `global.fetch` Mock



/**
 * 404와 reject
 * fetch() 는 response.ok가 false여도 reject 되지 않는다.
 * 테스트 시, resolves 를 사용하여 테스트 해야한다.
 */

/** 테스트의 경계
 * 테스트의 경계는 테스트 대상의 직접 의존성을 기준으로 설정할 수 있다.
 * A(테스트 대상) → B → C 의존 관계에서
 * A의 unit test라면 B를 Mock 처리할 수 있다.
 
 * 이 경우 B의 실제 구현은 실행되지 않으므로,
 * B 내부에서 호출되는 C 역시 실행되지 않는다.

 * B와 C의 동작은 각각의 테스트에서 별도로 검증한다.
 */

