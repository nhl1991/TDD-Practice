
export function convertCurrency(amount: unknown, rate: unknown) {

    if (
        typeof amount !== "number" || amount <= 0 || !Number.isFinite(amount) ||
        typeof rate !== "number" || rate <= 0 || !Number.isFinite(rate)
    ) {
        throw new Error("Invalid input.");
    }

    const result = amount * rate;
    return Number(result.toFixed(4));
}