import { validateCurrencies } from "./validateCurrencies"

export async function exchangeRate(base: string, target: string) {

    if (!validateCurrencies(base) || !validateCurrencies(target)) throw new Error('Invalid input type.');
    try {
        const response = await fetch(`https://api.frankfurter.dev/v1/latest?base=${base}&symbols=${target}`, {
            method: 'GET'
        })
        
        if(!response.ok) throw new Error(`${response.status} : Network Error`);

        const result = await response.json();
        
        const rate =  result.rates[target];
        return Number(rate);

    } catch(error) {
        console.log(error);
        throw error;
    }


    // if(!response.ok) throw Error('network_error');

    // const result = await response.json();

    // if(!result.rate) throw Error('not_found');

}