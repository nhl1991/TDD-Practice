import { exchangeRate } from "./exchangeRate"

const mockResponse = {
    "amount": 1.0,
    "base": "KRW",
    "date": "2026-09-10",
    "rates": {
        "JPY": 0.11473
    }
}

describe("exchange rate", () => {
    afterEach(()=> jest.clearAllMocks())
    // clearAllMocks()는 mock 함수 자체는 그대로 두고, 호출 기록만 초기화
    // restoreAllMocks()는 jest.spyOn()으로 바꿔놓은 함수를 원래 구현으로 복원
    it("목표 환전 통화를 선택하고 환율을 반환한다.", async () => {
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        } as Response);

        const rate = await exchangeRate('KRW', 'JPY');

        expect(rate).toBe(0.11473);
    })

    it("Response가 200이 아닌 경우 에러를 던진다.", async () => {
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 404,
            // json: async () => mockResponse,
        } as Response);

        await expect(exchangeRate('KRW', 'USD')).rejects.toThrow();
        // const rate = await exchangeRate('KRW', 'JPY');
        // expect(rate).rejects.toThrow();
    })

    it('입력 값이 올바르지 않은 경우 에러를 던진다.', async () => {
        await expect(exchangeRate('KRW',['USD','JPY'])).rejects.toThrow();
    })
})