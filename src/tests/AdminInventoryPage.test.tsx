import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { AdminInventoryPage } from '@/pages/admin/AdminInventoryPage';

const adminInventoryMocks = vi.hoisted(() => ({
  listRiskLots: vi.fn(),
  getOptions: vi.fn(),
  getLotDetail: vi.fn(),
  getLotMovements: vi.fn(),
}));

vi.mock('@/services/api.admin', () => ({
  adminInventoryApi: {
    listRiskLots: adminInventoryMocks.listRiskLots,
    getOptions: adminInventoryMocks.getOptions,
    getLotDetail: adminInventoryMocks.getLotDetail,
    getLotMovements: adminInventoryMocks.getLotMovements,
  },
}));

vi.mock('@/shared/contexts', () => ({
  usePreferences: () => ({ preferences: { locale: 'en-US' } }),
}));

describe('AdminInventoryPage', () => {
  beforeEach(() => {
    adminInventoryMocks.listRiskLots.mockResolvedValue({
      items: [
        {
          lotId: 1,
          itemName: 'Urea',
          lotCode: 'LOT-001',
          farmId: 1,
          farmName: 'Farm A',
          expiryDate: '2026-01-10',
          onHand: 5,
          daysToExpiry: 5,
          status: 'EXPIRING',
          unit: 'kg',
        },
      ],
      page: 0,
      size: 20,
      totalElements: 1,
      totalPages: 1,
    });
    adminInventoryMocks.getOptions.mockResolvedValue({ farms: [{ id: 1, name: 'Farm A' }], categories: [] });
    adminInventoryMocks.getLotDetail.mockResolvedValue({
      lotId: 1,
      itemName: 'Urea',
      lotCode: 'LOT-001',
      unit: 'kg',
      supplierName: 'Supplier A',
      expiryDate: '2026-01-10',
      status: 'IN_STOCK',
      onHandTotal: 5,
      balances: [],
    });
    adminInventoryMocks.getLotMovements.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders inventory lots and triggers search filter', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/inventory?farmId=1&status=RISK&windowDays=30']}>
          <AdminInventoryPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByText('Urea')).toBeInTheDocument();
    expect(adminInventoryMocks.listRiskLots).toHaveBeenCalled();

    vi.useFakeTimers();
    fireEvent.change(screen.getByPlaceholderText('Search item or lot code'), {
      target: { value: 'urea' },
    });

    await act(async () => {
      vi.advanceTimersByTime(450);
    });

    expect(adminInventoryMocks.listRiskLots).toHaveBeenCalledTimes(2);
    expect(adminInventoryMocks.listRiskLots.mock.calls[1][0].q).toBe('urea');

    vi.useRealTimers();
  });
});
