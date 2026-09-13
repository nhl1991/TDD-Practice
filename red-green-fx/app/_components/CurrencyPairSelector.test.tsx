import { render, screen } from "@testing-library/react"
import CurrencyPairSelector from "./CurrencyPairSelector"
import userEvent from "@testing-library/user-event";


describe("CurrencyPairSelector",()=>{

    it("현재 화폐와 환전 목표 화폐를 표시한다.",()=>{
        const onChange = jest.fn();
        render(<CurrencyPairSelector setFromCurrency={onChange} setToCurrency={onChange} />);
        expect(screen.getAllByRole('combobox')).toHaveLength(2);
        expect(screen.getAllByRole('combobox')).not.toHaveLength(1);
        expect(screen.getAllByRole('combobox')).not.toHaveLength(3);
    })
    // ex) South Korea Won => KRW, Japanese YEN => JPY
    it("유저가 화폐를 선택하면 화폐 단위를 표시한다.",async ()=>{
        const onChange = jest.fn();
        render(<CurrencyPairSelector setFromCurrency={onChange} setToCurrency={onChange} />);
        await userEvent.selectOptions(screen.getByRole('combobox', {name: 'From Currency'}), 'JPY')
        await userEvent.selectOptions(screen.getByRole('combobox', {name: 'To Currency'}), 'KRW')
        // ByRole로 paragraph 검색 시 name을 쓸 경우 aria-label이 필요.
        // expect(screen.getByRole("paragraph", { name: "JPY" })).toBeInTheDocument();
    })

})