"use client"
import { ChangeEvent, useEffect, useState } from "react";
import CurrencyPairSelector from "./CurrencyPairSelector";
import CurrencyDisplay from "./CurrencyDisplay";
import AmountInput from "./AmountInput";
import { exchangeRate } from "../lib/exchangeRate";
import { validateAmountInput } from "../lib/validateAmountInput";
import { convertCurrency } from "../lib/currency";
export default function CurrencyConverter() {

    const [base, setBase] = useState('KRW');
    const [target, setTarget] = useState('JPY');
    const [amount, setAmount] = useState<number>(0);
    const [rate, setRate] = useState<number>(0);

    function setFromCurrency(currency: string) {
        setBase(currency)
    };

    function setToCurrency(currency: string) {
        setTarget(currency)
    };

    function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
        if (validateAmountInput(e.target.value))
            setAmount(Number(e.target.value))
    }

    useEffect(() => {
        async function getRate() {
            const rate = await exchangeRate(base, target);
            console.log(rate);
            setRate(rate);
        }
        if (base !== '' && target !== '')
            getRate()

        // return () => {
        //     setBase('');
        //     setTarget('');
        // }
    }, [base, target, rate])

    return (
        <>
            <CurrencyPairSelector setFromCurrency={setFromCurrency} setToCurrency={setToCurrency} />
            <CurrencyDisplay base={base} target={target} />
            <AmountInput handleOnChange={handleOnChange} />
            <>
                <p>입력 : {amount}</p>
                <p>환율 : {rate}</p>
            </>
            {amount > 0 && rate > 0 ? <p>환전 : {convertCurrency(amount, rate)}{target}</p> : null}

        </>
    )
}

