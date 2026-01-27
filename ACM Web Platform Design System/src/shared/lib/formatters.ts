import type { CurrencyCode, WeightUnit } from '@/entities/preferences';

const THOUSAND = 1000;

// Currency exchange rate constant: 1 USD = 25,000 VND
export const USD_TO_VND_RATE = 25000;

/**
 * Convert amount between currencies using the fixed exchange rate.
 * @param amount - The amount to convert
 * @param fromCurrency - Source currency code
 * @param toCurrency - Target currency code
 * @returns Converted amount
 */
export function convertCurrency(
    amount: number,
    fromCurrency: CurrencyCode,
    toCurrency: CurrencyCode
): number {
    if (fromCurrency === toCurrency) return amount;
    if (fromCurrency === 'VND' && toCurrency === 'USD') {
        return amount / USD_TO_VND_RATE;
    }
    if (fromCurrency === 'USD' && toCurrency === 'VND') {
        return amount * USD_TO_VND_RATE;
    }
    return amount;
}

/**
 * Convert amount from VND (canonical storage) to display currency.
 * @param amountInVND - Amount stored in VND
 * @param displayCurrency - User's preferred display currency
 * @returns Amount in display currency
 */
export function convertToDisplayCurrency(
    amountInVND: number,
    displayCurrency: CurrencyCode
): number {
    return convertCurrency(amountInVND, 'VND', displayCurrency);
}

/**
 * Convert amount from display currency back to VND for storage.
 * @param amountInDisplay - Amount in user's display currency
 * @param displayCurrency - User's preferred display currency
 * @returns Amount in VND for storage
 */
export function convertFromDisplayCurrency(
    amountInDisplay: number,
    displayCurrency: CurrencyCode
): number {
    return convertCurrency(amountInDisplay, displayCurrency, 'VND');
}

const WEIGHT_LABELS: Record<WeightUnit, string> = {
    KG: 'kg',
    G: 'g',
    TON: 'ton',
};

export function formatMoney(valueInCanonical: number, currency: CurrencyCode, locale: string): string {
    const options =
        currency === 'VND'
            ? { minimumFractionDigits: 0, maximumFractionDigits: 0 }
            : { minimumFractionDigits: 2, maximumFractionDigits: 2 };

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        ...options,
    }).format(valueInCanonical);
}

export function convertWeight(valueKg: number, toUnit: WeightUnit): number {
    switch (toUnit) {
        case 'G':
            return valueKg * THOUSAND;
        case 'TON':
            return valueKg / THOUSAND;
        case 'KG':
        default:
            return valueKg;
    }
}

export function convertWeightToKg(value: number, fromUnit: WeightUnit): number {
    switch (fromUnit) {
        case 'G':
            return value / THOUSAND;
        case 'TON':
            return value * THOUSAND;
        case 'KG':
        default:
            return value;
    }
}

export function formatWeight(valueKg: number, unit: WeightUnit, locale = 'vi-VN'): string {
    const converted = convertWeight(valueKg, unit);
    const maximumFractionDigits = unit === 'G' ? 0 : 2;
    const formatted = new Intl.NumberFormat(locale, {
        maximumFractionDigits,
    }).format(converted);
    return `${formatted} ${WEIGHT_LABELS[unit]}`;
}

export function getWeightUnitLabel(unit: WeightUnit): string {
    return WEIGHT_LABELS[unit];
}

export function normalizeWeightUnit(value?: string | null): WeightUnit | null {
    if (!value) return null;
    const normalized = value.trim().toUpperCase();
    if (normalized === 'KG') return 'KG';
    if (normalized === 'G') return 'G';
    if (normalized === 'TON' || normalized === 'T') return 'TON';
    return null;
}

export function convertCostPerKg(valuePerKg: number, unit: WeightUnit): number {
    switch (unit) {
        case 'G':
            return valuePerKg / THOUSAND;
        case 'TON':
            return valuePerKg * THOUSAND;
        case 'KG':
        default:
            return valuePerKg;
    }
}
