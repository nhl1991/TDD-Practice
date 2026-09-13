

export function validateAmountInput(amount: unknown) {

    if (typeof amount !== "string" && typeof amount !== "number") {
        return false;
    }

    const value = Number(amount);

    return Number.isFinite(value) && value > 0;
}