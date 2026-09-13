import { render, screen, } from '@testing-library/react';
import CurrencySelect from './CurrencySelect';
import userEvent from '@testing-library/user-event'

describe('loads and displays 30 currencies.', () => {

    beforeEach(() => {
        const hanlder = jest.fn();
        render(<CurrencySelect id="FromCurrency" label="base" handler={hanlder} />);
    });

    it('제공되는 환율 정보 30개가 렌더링되는지 검증', () => {
        expect(screen.getAllByRole('option')).toHaveLength(30);
    })

    it("통화를 선택할 수 있다", async () => {
        const user = userEvent.setup();

        // const select = screen.getByRole("combobox");
        await user.selectOptions(screen.getByRole("combobox"), "KRW");
        // await user.selectOptions(select, "South Korean Won");

        // expect(select).toHaveValue('KRW')
        // expect(select).not.toHaveValue('JPY')
    });


})