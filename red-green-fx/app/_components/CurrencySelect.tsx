import { currencies } from "../lib/curruncies"

export default function CurrencySelect({ id, label, handler }: { id: string, label: string, handler: (value: string) => void }) {

    return (
        <div className="flex flex-col">
            <label htmlFor={id}>{label}</label>
            <select id={id} onChange={(e)=> handler(e.target.value)}>
                {
                    Object.entries(currencies).map((currency, index) => {
                        return <option value={currency[0]} key={index} aria-label={currency[0]}>{currency[1]}</option>
                    })
                }
            </select>
        </div>
    )
}