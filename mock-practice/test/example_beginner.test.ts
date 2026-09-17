// ### 핵심 개념

import { runCallback, runCallbackWithReturn } from "../src/example_beginner";

// - `jest.fn()`
// - `toHaveBeenCalled()`
// - `toHaveBeenCalledTimes()`
// - `toHaveBeenCalledWith()`
// - `mock.calls`
// - `mock.results`

describe("Beginner Mock Test Suite", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("", () => {
    const mockFn = jest.fn();

    runCallback(mockFn);
    expect(mockFn).toHaveBeenCalled();
    // 콜백이 한 번 이상 호출되었는지 확인

    expect(mockFn).toHaveBeenCalledTimes(1);
    // 콜백이 정확히 한 번 호출되었는지 확인

    expect(mockFn).toHaveBeenCalledWith("hello"); // mockFn.mock.calls[0][0] === "hello"
    // 콜백이 "hello"라는 인자로 호출되었는지 확인

    console.log(mockFn.mock.calls);
    // 각 호출에서 전달된 인자 목록 확인
    // 예: [ ["hello"] ]

    console.log(mockFn.mock.results);
    // 각 호출의 결과 확인
    // 예: [ { type: "return", value: undefined } ]
  });

  it("", () => {
    const mockFn = jest.fn((value: string) => value + " world");

    const result = runCallbackWithReturn(mockFn);

    expect(mockFn.mock.results[0].type).toBe("return");
    expect(mockFn.mock.results[0].value).toBe("hello world");

    console.log(mockFn.mock.calls); // [ [ 'hello' ] ]
    console.log(mockFn.mock.results); // [ { type: 'return', value: 'hello world' } ]
  });

  it("에러를 반환하는 경우 mockFn.mock.results 내의 타입은 throw이다.", () => {
    const mockFn = jest.fn((value: string) => {
      throw new Error("Test error");
    });
    try {
      runCallback(mockFn);
    } catch {}

    expect(mockFn.mock.results[0].type).toBe("throw");
  });

  // ### 반환값 Mock

  // - `mockReturnValue()`
  // - `mockReturnValueOnce()`
  it("반환값 몫", () => {
    const mockFn = jest
      .fn()
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(20)
      .mockReturnValue(30);

    expect(mockFn()).toBe(10);
    expect(mockFn()).toBe(20);
    expect(mockFn()).toBe(30);
    expect(mockFn()).toBe(30);
    /**
     * mockReturnValueOnce를 사용하면 순서대로 반환값을 지정할 수 있다. 지정된 값을 한번만 반환한다.
     * mockReturnValue는 이후 호출에 대해 기본 반환값을 지정한다.
     */
  });

  // ### 비동기 Mock

  // - `mockResolvedValue()`
  // - `mockRejectedValue()`
  it("mockResolvedValue와 mockRejectedValue 예제", async () => {
    const mockResolvedFn = jest.fn().mockResolvedValue("resolved value");
    const mockRejectedFn = jest.fn().mockRejectedValue(new Error("rejected value"));

    await expect(mockResolvedFn()).resolves.toBe("resolved value");
    await expect(mockRejectedFn()).rejects.toThrow("rejected value");

  })
});
