import { convertCurrency } from "./currency";

describe("convertCurrency", () => {

    it("금액에 환율을 적용해 환전된 금액을 반환한다", () => {
        expect(convertCurrency(100, 150)).toBe(15000);
    });


    it.each([
        ["", 100],
        [true, 100],
        ["1.5", 100],
        [NaN, 100],
        [undefined, 100],
        [Infinity, 100],
        [-100, 150],
        [0, 150],
        [100, ""],
        [100, NaN],
        [100, undefined],
        [100, Infinity],
        [100, -1],
        [100, 0],
    ])("amount와 rate는 유한한 양수 number외에 에러를 던진다.", (amount, rate) => {
        expect(() => convertCurrency(amount, rate)).toThrow();
    })

    it.each([
        [100, 150, 15000],
        [100, 1.5, 150],
        [10.5, 2, 21],
    ])(
        "유효한 amount와 rate를 계산한다.",
        (amount, rate, expected) => {
            expect(convertCurrency(amount, rate)).toBe(expected);
        }
    );

    it('부동 소수 검증', () => {
        expect(convertCurrency(0.1,0.2)).toBe(0.02);
    })

});