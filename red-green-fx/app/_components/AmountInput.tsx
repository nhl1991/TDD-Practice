import { ChangeEvent } from "react";

export default function AmountInput({ handleOnChange }: { handleOnChange: (e: ChangeEvent<HTMLInputElement>) => void }) {

    return (
        <>
            <input type="text" onChange={handleOnChange} />
        </>
    )
}