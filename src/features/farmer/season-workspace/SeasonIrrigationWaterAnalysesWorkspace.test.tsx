import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SeasonIrrigationWaterAnalysesWorkspace } from './SeasonIrrigationWaterAnalysesWorkspace';

const mocks = vi.hoisted(() => ({
  useSeasonById: vi.fn(),
  useSeasonIrrigationWaterAnalyses: vi.fn(),
  useCreateIrrigationWaterAnalysis: vi.fn(),
  mutate: vi.fn(),
  isPending: false,
}));

vi.mock('@/entities/season', () => ({
  useSeasonById: mocks.useSeasonById,
}));

vi.mock('@/entities/irrigation-water-analysis', () => ({
  useSeasonIrrigationWaterAnalyses: mocks.useSeasonIrrigationWaterAnalyses,
  useCreateIrrigationWaterAnalysis: mocks.useCreateIrrigationWaterAnalysis,
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/farmer/seasons/33/workspace/irrigation-water-analyses']}>
      <Routes>
        <Route
          path="/farmer/seasons/:seasonId/workspace/irrigation-water-analyses"
          element={<SeasonIrrigationWaterAnalysesWorkspace />}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('SeasonIrrigationWaterAnalysesWorkspace', () => {
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
    mocks.useSeasonIrrigationWaterAnalyses.mockReturnValue({
      data: [],
      isLoading: false,
    });
    mocks.useCreateIrrigationWaterAnalysis.mockImplementation(() => ({
      mutate: mocks.mutate,
      isPending: mocks.isPending,
    }));
  });

  it('renders irrigation form fields', () => {
    renderPage();

    expect(screen.getByTestId('irrigation-analysis-form')).toBeInTheDocument();
    expect(screen.getByTestId('irrigation-sample-date-input')).toBeInTheDocument();
    expect(screen.getByTestId('irrigation-volume-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-irrigation-analysis')).toBeInTheDocument();
  });

  it('blocks submit when concentration and required fields are missing', async () => {
    renderPage();

    fireEvent.change(screen.getByTestId('irrigation-total-n-input'), { target: { value: '' } });
    fireEvent.change(screen.getByTestId('irrigation-nitrate-input'), { target: { value: '' } });
    fireEvent.change(screen.getByTestId('irrigation-ammonium-input'), { target: { value: '' } });
    fireEvent.change(screen.getByTestId('irrigation-volume-input'), { target: { value: '' } });
    fireEvent.click(screen.getByTestId('submit-irrigation-analysis'));

    await waitFor(() => {
      expect(mocks.mutate).not.toHaveBeenCalled();
    });
  });

  it('submits irrigation payload with backend contract shape', async () => {
    renderPage();

    fireEvent.change(screen.getByTestId('irrigation-nitrate-input'), { target: { value: '4.2' } });
    fireEvent.change(screen.getByTestId('irrigation-ammonium-input'), { target: { value: '1.8' } });
    fireEvent.change(screen.getByTestId('irrigation-volume-input'), { target: { value: '500' } });
    fireEvent.change(screen.getByTestId('irrigation-sample-date-input'), {
      target: { value: '2026-03-18' },
    });

    fireEvent.click(screen.getByTestId('submit-irrigation-analysis'));

    await waitFor(() => {
      expect(mocks.mutate).toHaveBeenCalledWith({
        plotId: 22,
        sampleDate: '2026-03-18',
        nitrateMgPerL: 4.2,
        ammoniumMgPerL: 1.8,
        totalNmgPerL: undefined,
        irrigationVolumeM3: 500,
        sourceType: 'user_entered',
        sourceDocument: undefined,
        labReference: undefined,
        note: undefined,
      });
    });
  });

  it('shows pending state on submit buttons while mutation is running', () => {
    mocks.isPending = true;
    mocks.useCreateIrrigationWaterAnalysis.mockImplementation(() => ({
      mutate: mocks.mutate,
      isPending: true,
    }));

    renderPage();

    expect(screen.getByTestId('submit-irrigation-analysis')).toBeDisabled();
    expect(screen.getByTestId('submit-irrigation-analysis-dashboard')).toBeDisabled();
  });
});
