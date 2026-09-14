

describe("notify test", () => {
    // callback이 정확히 1번 호출됨
    // "done"을 인자로 받음
    it("#1 callback이 1번 실행되고, done을 인자로 받는다", () => {
        const { notify } = require("../src/execute");

        const mockFn = jest.fn();

        notify(mockFn);

        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith("done")

    })

    // 100
    // 200
    // 300
    // 300

    it("#2 mock 호출 결과 순서대로 100, 200, 300, 300이 출력된다.", () => {
        const mockFn = jest.fn().mockReturnValueOnce(100).mockReturnValueOnce(200).mockReturnValue(300);

        expect(mockFn()).toBe(100);
        expect(mockFn()).toBe(200);
        expect(mockFn()).toBe(300);
        expect(mockFn()).toBe(300);
    })


    it("#3 mockClear 이후의 값.", () => {
        const mockFn = jest.fn()
            .mockReturnValue(50);

        mockFn("hello");
        mockFn("world");

        mockFn.mockClear();
        // mockClear는 함수 호출 정보를 초기화. returnValue는 초기화 X
        expect(mockFn.mock.calls.length).toBe(0) // 0
        expect(mockFn()).toBe(50); // 50
    })
    // # 4
    it("#4 mock api test", async () => {
  throw new Error("TEST IS RUNNING");
    })

    it("#5 rejects and returns Error", async () => {
        const mockApi = jest.fn().mockRejectedValue(new Error("SERVER_ERROR"));

        await expect(mockApi()).rejects.toThrow("SERVER_ERROR");

        /**
         * jest 내부
         * const actualWrapper = typeof actual === 'function' ? actual() : actual;
         * 
         * .resolves와 .rejects 둘 다 expect()에 들어온 값이 함수이면 
         * Jest가 그 함수를 직접 호출한다.
         * resolves나 rejects가 붙으면,
         * await expect(mockApi()) 또는 await expect(mockApi)여도 상관없다.
         */
    })

})