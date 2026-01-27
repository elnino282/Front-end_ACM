import type { ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { PreferencesProvider } from '@/shared/contexts';
import { preferencesApi } from '@/entities/preferences/api/client';
import { preferencesKeys } from '@/entities/preferences/model/keys';
import { PreferencesForm } from './PreferencesForm';

vi.mock('@/features/auth', () => ({
    useAuth: () => ({ isAuthenticated: true }),
}));

vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock('@/components/ui/select', () => {
    const Select = ({
        value,
        onValueChange,
        disabled,
        children,
    }: {
        value?: string;
        onValueChange?: (value: string) => void;
        disabled?: boolean;
        children?: ReactNode;
    }) => (
        <select
            data-testid="select"
            value={value}
            disabled={disabled}
            onChange={(event) => onValueChange?.(event.target.value)}
        >
            {children}
        </select>
    );

    const SelectContent = ({ children }: { children?: ReactNode }) => <>{children}</>;
    const SelectItem = ({ value, children }: { value: string; children?: ReactNode }) => (
        <option value={value}>{typeof children === 'string' ? children : value}</option>
    );
    const SelectTrigger = () => null;
    const SelectValue = () => null;

    return {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
    };
});

vi.mock('@/entities/preferences/api/client', () => ({
    preferencesApi: {
        getMe: vi.fn(),
        updateMe: vi.fn(),
    },
}));

const renderWithClient = (queryClient: QueryClient) => {
    return render(
        <QueryClientProvider client={queryClient}>
            <PreferencesProvider>
                <PreferencesForm />
            </PreferencesProvider>
        </QueryClientProvider>
    );
};

describe('PreferencesForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('updates preferences and cache on save', async () => {
        const initialPreferences = { currency: 'VND', weightUnit: 'KG', locale: 'vi-VN' };
        const updatedPreferences = { currency: 'USD', weightUnit: 'TON', locale: 'en-US' };
        const mockedPreferencesApi = preferencesApi as unknown as {
            getMe: ReturnType<typeof vi.fn>;
            updateMe: ReturnType<typeof vi.fn>;
        };
        mockedPreferencesApi.getMe.mockResolvedValue(initialPreferences);
        mockedPreferencesApi.updateMe.mockResolvedValue(updatedPreferences);

        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });

        renderWithClient(queryClient);

        await waitFor(() => {
            expect(preferencesApi.getMe).toHaveBeenCalled();
        });

        const selects = screen.getAllByTestId('select');
        fireEvent.change(selects[0], { target: { value: 'USD' } });
        fireEvent.change(selects[1], { target: { value: 'TON' } });
        fireEvent.change(selects[2], { target: { value: 'en-US' } });

        fireEvent.click(screen.getByRole('button', { name: /save preferences/i }));

        await waitFor(() => {
            const cached = queryClient.getQueryData(preferencesKeys.me());
            expect(cached).toMatchObject(updatedPreferences);
        });

        await waitFor(() => {
            expect(preferencesApi.updateMe).toHaveBeenCalled();
        });
        const calls = (preferencesApi.updateMe as unknown as { mock: { calls: unknown[][] } }).mock.calls;
        expect(calls[0]?.[0]).toEqual(updatedPreferences);
    });
});
