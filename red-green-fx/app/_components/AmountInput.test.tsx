import { render, screen } from "@testing-library/react"
import AmountInput from "./AmountInput";


describe("Amount Input Test", () => {
    const onChange = jest.fn();
    it("컴포넌트를 로드하고 표시한다.", () => {
        render(<AmountInput handleOnChange={onChange} />)
        expect(screen.getByRole("textbox")).toBeInTheDocument();

    })
})