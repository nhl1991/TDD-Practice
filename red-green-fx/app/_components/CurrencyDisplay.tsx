export default function CurrencyDisplay({ base, target } : { base: string, target: string} ){


    return(
        <div className="flex justify-between bg-purple-400 gap-x-4">
            <p>{base} → {target}</p>
        </div>
    )
}