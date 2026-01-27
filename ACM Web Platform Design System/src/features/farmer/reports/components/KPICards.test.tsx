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
        render(<KPICards />);
        expect(screen.getByText(/\$5,000\.00/)).toBeInTheDocument();
        expect(screen.getByText(/\$1,808\.00/)).toBeInTheDocument();
        expect(screen.getByText(/kg\/ha/i)).toBeInTheDocument();
    });
});
