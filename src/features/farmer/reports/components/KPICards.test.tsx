import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KPICards } from './KPICards';

vi.mock('@/shared/contexts', () => ({
    usePreferences: () => ({
        preferences: {
            currency: 'USD',
            weightUnit: 'KG',
            locale: 'en-US',
        },
    }),
}));

describe('KPICards', () => {
    it('renders formatted money values', () => {
        render(
            <KPICards
                totalCost={125000000}
                netProfit={45200000}
                totalYieldKg={2580}
                onTimeTasksPercent={92}
            />
        );
        expect(screen.getByText(/\$5,000\.00/)).toBeInTheDocument();
        expect(screen.getByText(/\$1,808\.00/)).toBeInTheDocument();
        expect(screen.getByText(/2,580 kg/i)).toBeInTheDocument();
        expect(screen.getByText(/92%/i)).toBeInTheDocument();
    });
});
