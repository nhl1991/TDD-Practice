// 테스트 대상 함수는 실제 구현을 사용하고, 그 아래 의존성을 Mock 처리합니다.

// ```text
// fetchUser
//    ↓
// global.fetch ← Mock
// ```
describe("", () => {
  it("### 성공 응답", async () => {
    const mockApi = (global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ login: "testuser" }),
    }));

    await expect(mockApi()).resolves.toHaveProperty("status", 200);
  });

  it("### HTTP 404 / 500", async () => {
    const mockApi = (global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: jest.fn().mockResolvedValue(null),
    }));

    await expect(mockApi()).resolves.toHaveProperty("status", 404);
  });

  it("### HTTP 404 / 500", async () => {
    const mockApi = (global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValue(null),
    }));

    await expect(mockApi()).resolves.toHaveProperty("status", 500);
  });

  it("### 네트워크 오류", async () => {
    const mockApi = (global.fetch = jest
      .fn()
      .mockRejectedValue(new Error("Network Error")));

    await expect(mockApi()).rejects.toThrow("Network Error");
  });
});

describe("## 3. Intermediate — `mockImplementation()`", () => {
  it("동기 함수의 mockImplementation", () => {
    const mock = jest.fn().mockImplementation((value: number) => {
      if (value % 2 === 0) return "even";
      return "odd";
    });

    expect(mock(2)).toBe("even");
    expect(mock(3)).toBe("odd");
  });

  it("비동기 함수의 mockImplementation #1", async () => {
    const mock = jest.fn().mockImplementation(async (value: number) => {
      if (value % 2 === 0) return "even";
      return "odd";
    });

    await expect(mock(2)).resolves.toBe("even");
    await expect(mock(3)).resolves.toBe("odd");
  });
  it("비동기 함수의 mockImplementation #2", async () => {
    const mock = jest
      .fn()
      .mockImplementationOnce(async (value: number) => {
        if (value % 2 === 0) return "even";
        return "odd";
      })
      .mockImplementationOnce(async (value: number) => {
        return value % 2;
      });

    await expect(mock(2)).resolves.toBe("even");
    await expect(mock(3)).resolves.toBe(1);
  });
});
