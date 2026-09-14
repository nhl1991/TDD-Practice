


describe("mock", () => {
    const { execute } = require("../src/execute");
    // jest-mock-tutorial.md #1
    it("calls function", () => {
        const mockFn = jest.fn();
        execute(mockFn);
        expect(mockFn).toHaveBeenCalled();
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith("hello");
        mockFn.mockReset();
        // expect(mockFn).toHaveBeenCalled();
        // expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith("hello");
    })



})

describe("2. 초급 — 반환값 조작하기", () => {
    const mockFn = jest.fn();
    it("호출마다 다른 값 반환하기", () => {
        mockFn.mockReturnValueOnce(10).mockReturnValueOnce(20).mockReturnValue(30);

        expect(mockFn()).toBe(10);
        expect(mockFn()).toBe(20);
        expect(mockFn()).toBe(30);
        expect(mockFn()).toBe(30);
        mockFn.mockClear();
        expect(mockFn()).toBe(30);
        mockFn.mockReset();
        expect(mockFn()).toBe(undefined);
    })
})

describe("3. 초급 — 비동기 Mock", () => {
    it("## Promise 성공", async () => {
        const mockApi = jest.fn()
            .mockResolvedValue({
                name: "Octocat",
            });
        await expect(mockApi()).resolves.toEqual({
            name: "Octocat",
        });

    })
    it("## Promise 실패", async () => {
        const mockApi = jest.fn()
            .mockRejectedValue(new Error("NOT_FOUND"))
        await expect(mockApi()).rejects.toThrow("NOT_FOUND")

    })

})


/**
 * mockClear()
= 호출 기록 초기화

 * mockReset()
= 호출 기록 초기화
+ 반환값/구현 초기화

 * mockRestore()
= 주로 spyOn()에서 원래 함수 구현으로 되돌리는 것
 */