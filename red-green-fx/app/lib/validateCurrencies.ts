import { currencies } from "./curruncies";
export function validateCurrencies(target: unknown) {
    if (typeof target !== 'string') return false;
    // if(target in currencies) return true;

    // return false;

    return Object.hasOwn(currencies, target);
}