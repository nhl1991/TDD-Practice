import { getUser } from "../src/module/user";


// # 6. 중급 — Module Mock
jest.mock('../src/module/user');

describe("6. 중급 — Module Mock", () => {
  // Module Mock 관련 테스트 케이스 작성
  it("user 모듈을 Mock 처리할 수 있다", async () => {
    // Module Mock 테스트 케이스 작성
    const mockedGetUser = jest.mocked(getUser);
    mockedGetUser.mockResolvedValue({ login: 'octocat' } as any);
    await expect(mockedGetUser('https://api.github.com/users/octocat')).resolves.toEqual({ login: 'octocat' });
  });


});