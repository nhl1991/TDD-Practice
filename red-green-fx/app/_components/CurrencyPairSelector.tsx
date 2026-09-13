"use client"
import CurrencySelect from "./CurrencySelect";

export default function CurrencyPairSelector({ setFromCurrency, setToCurrency }: { setFromCurrency: (currency:string) => void, setToCurrency: (currency:string) => void }) {




    return (
        <>
            <section>
                <div className="flex bg-cyan-300">

                    <div>
                        <CurrencySelect id="base" label="From Currency" handler={setFromCurrency} />
                    </div>

                    <div>
                        <CurrencySelect id="target" label="To Currency" handler={setToCurrency} />
                    </div>
                </div>
            </section>
        </>
    )
}