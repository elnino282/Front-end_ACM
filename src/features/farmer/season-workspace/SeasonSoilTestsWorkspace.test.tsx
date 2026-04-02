import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SeasonSoilTestsWorkspace } from './SeasonSoilTestsWorkspace';

const mocks = vi.hoisted(() => ({
  useSeasonById: vi.fn(),
  useSeasonSoilTests: vi.fn(),
  useCreateSoilTest: vi.fn(),
  mutate: vi.fn(),
  isPending: false,
}));

vi.mock('@/entities/season', () => ({
  useSeasonById: mocks.useSeasonById,
}));

vi.mock('@/entities/soil-test', () => ({
  useSeasonSoilTests: mocks.useSeasonSoilTests,
  useCreateSoilTest: mocks.useCreateSoilTest,
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/farmer/seasons/33/workspace/soil-tests']}>
      <Routes>
        <Route path="/farmer/seasons/:seasonId/workspace/soil-tests" element={<SeasonSoilTestsWorkspace />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('SeasonSoilTestsWorkspace', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.isPending = false;
    mocks.useSeasonById.mockReturnValue({
      data: {
        id: 33,
        seasonName: 'Mua 33',
        plotId: 22,
        plotName: 'Plot A',
        cropName: 'Lua',
      },
      isLoading: false,
    });
    mocks.useSeasonSoilTests.mockReturnValue({
      data: [],
      isLoading: false,
    });
    mocks.useCreateSoilTest.mockImplementation(() => ({
      mutate: mocks.mutate,
      isPending: mocks.isPending,
    }));
  });

  it('renders soil test form fields', () => {
    renderPage();

    expect(screen.getByTestId('soil-test-form')).toBeInTheDocument();
    expect(screen.getByTestId('soil-sample-date-input')).toBeInTheDocument();
    expect(screen.getByTestId('soil-mineral-n-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-soil-test')).toBeInTheDocument();
  });

  it('blocks submit when required fields are missing', async () => {
    renderPage();

    fireEvent.change(screen.getByTestId('soil-mineral-n-input'), { target: { value: '' } });
    fireEvent.change(screen.getByTestId('soil-sample-date-input'), { target: { value: '' } });
    fireEvent.click(screen.getByTestId('submit-soil-test'));

    await waitFor(() => {
      expect(mocks.mutate).not.toHaveBeenCalled();
    });
  });

  it('submits soil-test payload with backend contract shape', async () => {
    renderPage();

    fireEvent.change(screen.getByTestId('soil-mineral-n-input'), { target: { value: '14.5' } });
    fireEvent.change(screen.getByTestId('soil-som-input'), { target: { value: '2.1' } });
    fireEvent.change(screen.getByTestId('soil-sample-date-input'), {
      target: { value: '2026-03-18' },
    });

    fireEvent.click(screen.getByTestId('submit-soil-test'));

    await waitFor(() => {
      expect(mocks.mutate).toHaveBeenCalledWith({
        plotId: 22,
        sampleDate: '2026-03-18',
        soilOrganicMatterPct: 2.1,
        mineralNKgPerHa: 14.5,
        nitrateMgPerKg: undefined,
        ammoniumMgPerKg: undefined,
        sourceType: 'user_entered',
        sourceDocument: undefined,
        labReference: undefined,
        note: undefined,
      });
    });
  });

  it('shows pending state on submit buttons while mutation is running', () => {
    mocks.isPending = true;
    mocks.useCreateSoilTest.mockImplementation(() => ({
      mutate: mocks.mutate,
      isPending: true,
    }));

    renderPage();

    expect(screen.getByTestId('submit-soil-test')).toBeDisabled();
    expect(screen.getByTestId('submit-soil-test-dashboard')).toBeDisabled();
  });
});
