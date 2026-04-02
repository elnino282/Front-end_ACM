import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { AdminAlertsPage } from '@/pages/admin/AdminAlertsPage';

const adminAlertMocks = vi.hoisted(() => ({
  list: vi.fn(),
  refresh: vi.fn(),
  send: vi.fn(),
  updateStatus: vi.fn(),
}));
const adminInventoryMocks = vi.hoisted(() => ({
  getOptions: vi.fn(),
}));

vi.mock('@/services/api.admin', () => ({
  adminAlertApi: {
    list: adminAlertMocks.list,
    refresh: adminAlertMocks.refresh,
    send: adminAlertMocks.send,
    updateStatus: adminAlertMocks.updateStatus,
  },
  adminInventoryApi: {
    getOptions: adminInventoryMocks.getOptions,
  },
}));

vi.mock('@/shared/contexts', () => ({
  usePreferences: () => ({ preferences: { locale: 'en-US' } }),
}));

describe('AdminAlertsPage', () => {
  beforeEach(() => {
    adminAlertMocks.list.mockResolvedValue({
      items: [
        {
          id: 1,
          type: 'INVENTORY_EXPIRING',
          severity: 'HIGH',
          status: 'NEW',
          farmId: 4,
          farmName: 'Farm A',
          title: 'Inventory expiring soon',
          message: '2 lots expire soon.',
          suggestedActionUrl: '/admin/inventory?farmId=4&status=RISK&windowDays=30',
          createdAt: '2026-01-10T00:00:00Z',
        },
      ],
      page: 0,
      size: 20,
      totalElements: 1,
      totalPages: 1,
    });
    adminInventoryMocks.getOptions.mockResolvedValue({ farms: [{ id: 4, name: 'Farm A' }], categories: [] });
    adminAlertMocks.refresh.mockResolvedValue([]);
    adminAlertMocks.updateStatus.mockResolvedValue({
      id: 1,
      type: 'INVENTORY_EXPIRING',
      severity: 'HIGH',
      status: 'DISMISSED',
      farmId: 4,
      farmName: 'Farm A',
      title: 'Inventory expiring soon',
      message: '2 lots expire soon.',
      suggestedActionUrl: '/admin/inventory?farmId=4&status=RISK&windowDays=30',
      createdAt: '2026-01-10T00:00:00Z',
    });
    adminAlertMocks.send.mockResolvedValue({
      id: 1,
      type: 'INVENTORY_EXPIRING',
      severity: 'HIGH',
      status: 'SENT',
      farmId: 4,
      farmName: 'Farm A',
      title: 'Inventory expiring soon',
      message: '2 lots expire soon.',
      suggestedActionUrl: '/admin/inventory?farmId=4&status=RISK&windowDays=30',
      createdAt: '2026-01-10T00:00:00Z',
      sentAt: '2026-01-10T01:00:00Z',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sends alerts and updates status', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/alerts']}>
          <AdminAlertsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByText('Inventory expiring soon')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    const sendAlertButton = await screen.findByRole('button', { name: 'Send alert' });
    fireEvent.click(sendAlertButton);

    await waitFor(() =>
      expect(adminAlertMocks.send).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ channel: 'IN_APP', recipientMode: 'ALL_FARMERS_IN_FARM' })
      )
    );

    const sentBadges = await screen.findAllByText('Sent');
    expect(sentBadges.length).toBeGreaterThan(0);
  });
});
