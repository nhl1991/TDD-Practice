import { validateAmountInput } from "./validateAmountInput";


describe("Validate user input", () => {

    it("유저로 부터 입력 받은 값이 숫자인지 검증한다.", () => {
        expect(validateAmountInput('2')).toBe(true);
    })

    it.each(['20a', 'abc', undefined, NaN, Infinity, null, ['1','2']])("number, string 외에 타입은 false를 반환한다.", (amount) => {
        expect(validateAmountInput(amount)).toBe(false);
    })

})