import { validateCurrencies } from "./validateCurrencies";


describe("유효한 통화 검증", () => {
    it("string을 받아 boolean을 반환한다.", () => {
        expect(validateCurrencies('KRW')).toBe(true);
    })
    it("지원하지 않는 통화는 false를 반환한다.", () => {
        expect(validateCurrencies('JENNI')).toBe(false);
    })

    it.each([0, 1, 1.5, ['a','b','c'], undefined, Infinity, null, NaN, true])("string 이외의 타입은 false를 반환한다.", (target) => {
        expect(validateCurrencies(target)).toBe(false);
    })
})