import { describe, it, expect } from 'vitest';
import {
    formatMoney,
    convertWeight,
    convertWeightToKg,
    formatWeight,
    USD_TO_VND_RATE,
    convertCurrency,
    convertToDisplayCurrency,
    convertFromDisplayCurrency,
} from './formatters';

describe('formatters', () => {
    it('formats VND without decimals', () => {
        const decimal = new Intl.NumberFormat('en-US')
            .formatToParts(1.1)
            .find((part) => part.type === 'decimal')?.value ?? '.';
        const formatted = formatMoney(1.5, 'VND', 'en-US');
        expect(formatted.includes(decimal)).toBe(false);
    });

    it('formats USD with two decimals', () => {
        const formatted = formatMoney(1, 'USD', 'en-US');
        expect(formatted).toMatch(/\.00/);
    });

    it('converts weight units', () => {
        expect(convertWeight(1, 'G')).toBe(1000);
        expect(convertWeight(1000, 'TON')).toBe(1);
    });

    it('converts to kg', () => {
        expect(convertWeightToKg(1000, 'G')).toBe(1);
        expect(convertWeightToKg(2, 'TON')).toBe(2000);
    });

    it('formats weight with unit', () => {
        const formatted = formatWeight(1.5, 'KG', 'en-US');
        expect(formatted).toMatch(/kg$/);
    });
});

describe('currency conversion', () => {
    it('has correct exchange rate constant', () => {
        expect(USD_TO_VND_RATE).toBe(25000);
    });

    it('converts VND to USD correctly', () => {
        expect(convertCurrency(25000, 'VND', 'USD')).toBe(1);
        expect(convertCurrency(50000, 'VND', 'USD')).toBe(2);
        expect(convertCurrency(12500, 'VND', 'USD')).toBe(0.5);
    });

    it('converts USD to VND correctly', () => {
        expect(convertCurrency(1, 'USD', 'VND')).toBe(25000);
        expect(convertCurrency(2, 'USD', 'VND')).toBe(50000);
        expect(convertCurrency(0.5, 'USD', 'VND')).toBe(12500);
    });

    it('returns same value for same currency', () => {
        expect(convertCurrency(1000, 'VND', 'VND')).toBe(1000);
        expect(convertCurrency(10, 'USD', 'USD')).toBe(10);
    });

    it('converts to display currency from VND', () => {
        expect(convertToDisplayCurrency(25000, 'USD')).toBe(1);
        expect(convertToDisplayCurrency(25000, 'VND')).toBe(25000);
        expect(convertToDisplayCurrency(1250000, 'USD')).toBe(50);
    });

    it('converts from display currency to VND', () => {
        expect(convertFromDisplayCurrency(1, 'USD')).toBe(25000);
        expect(convertFromDisplayCurrency(25000, 'VND')).toBe(25000);
        expect(convertFromDisplayCurrency(50, 'USD')).toBe(1250000);
    });
});
