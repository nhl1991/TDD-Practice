import { render, screen } from "@testing-library/react"
import CurrencyDisplay from "./CurrencyDisplay"


describe("Selected Currency Display", () => {
    it("2개의 <p> 태그를 생성한다.", () => {
        render(<CurrencyDisplay base="JPY" target="KRW" />)
        expect(screen.getAllByRole('paragraph')).toHaveLength(2);

    })

    it("화폐를 선택 한 후 텍스트를 출력한다.", () => {
        render(<CurrencyDisplay base="JPY" target="KRW" />)
        expect(screen.getByText('JPY')).toBeInTheDocument();
        expect(screen.getByText('KRW')).toBeInTheDocument();

    })
})