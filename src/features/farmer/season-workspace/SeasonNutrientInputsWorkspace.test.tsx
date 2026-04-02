import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SeasonNutrientInputsWorkspace } from './SeasonNutrientInputsWorkspace';

const mocks = vi.hoisted(() => ({
  useSeasonById: vi.fn(),
  useSeasonNutrientInputs: vi.fn(),
  useCreateNutrientInput: vi.fn(),
  mutate: vi.fn(),
  isPending: false,
}));

vi.mock('@/entities/season', () => ({
  useSeasonById: mocks.useSeasonById,
}));

vi.mock('@/entities/nutrient-input', () => ({
  useSeasonNutrientInputs: mocks.useSeasonNutrientInputs,
  useCreateNutrientInput: mocks.useCreateNutrientInput,
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/farmer/seasons/33/workspace/nutrient-inputs']}>
      <Routes>
        <Route
          path="/farmer/seasons/:seasonId/workspace/nutrient-inputs"
          element={<SeasonNutrientInputsWorkspace />}
        />
      </Routes>
    </MemoryRouter>
  );
}

const ensurePointerCapturePolyfill = () => {
  if (!HTMLElement.prototype.hasPointerCapture) {
    Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
      value: () => false,
      configurable: true,
    });
  }
  if (!HTMLElement.prototype.setPointerCapture) {
    Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
      value: () => undefined,
      configurable: true,
    });
  }
  if (!HTMLElement.prototype.releasePointerCapture) {
    Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', {
      value: () => undefined,
      configurable: true,
    });
  }
  if (!Element.prototype.scrollIntoView) {
    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      value: () => undefined,
      configurable: true,
    });
  }
};

async function chooseInputSource(optionPattern: RegExp) {
  const inputSourceTrigger = screen.getAllByRole('combobox')[0];
  fireEvent.mouseDown(inputSourceTrigger);
  if (inputSourceTrigger.getAttribute('aria-expanded') !== 'true') {
    fireEvent.click(inputSourceTrigger);
  }

  await waitFor(() => {
    expect(inputSourceTrigger).toHaveAttribute('aria-expanded', 'true');
  });

  const option = await screen.findByRole('option', { name: optionPattern });
  fireEvent.click(option);

  await waitFor(() => {
    expect(inputSourceTrigger).toHaveTextContent(optionPattern);
  });
}

describe('SeasonNutrientInputsWorkspace', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ensurePointerCapturePolyfill();
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
    mocks.useSeasonNutrientInputs.mockReturnValue({
      data: [],
      isLoading: false,
    });
    mocks.useCreateNutrientInput.mockImplementation(() => ({
      mutate: mocks.mutate,
      isPending: mocks.isPending,
    }));
  });

  it('renders ingestion form fields and season context', () => {
    renderPage();

    expect(screen.getAllByText(/nutrient inputs/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Plot A')).toBeInTheDocument();
    expect(screen.getByTestId('nutrient-input-form')).toBeInTheDocument();
    expect(screen.getByTestId('submit-nutrient-input')).toBeInTheDocument();
  });

  it('blocks submit when required fields are missing', async () => {
    renderPage();

    fireEvent.change(screen.getByTestId('nutrient-value-input'), { target: { value: '' } });
    fireEvent.change(screen.getByTestId('nutrient-recorded-at-input'), { target: { value: '' } });
    fireEvent.click(screen.getByTestId('submit-nutrient-input'));

    await waitFor(() => {
      expect(mocks.mutate).not.toHaveBeenCalled();
    });
  });

  it('submits payload in backend contract shape', async () => {
    renderPage();

    fireEvent.change(screen.getByTestId('nutrient-value-input'), {
      target: { value: '24.5' },
    });
    fireEvent.change(screen.getByTestId('nutrient-recorded-at-input'), {
      target: { value: '2026-03-17' },
    });

    fireEvent.click(screen.getByTestId('submit-nutrient-input'));

    await waitFor(() => {
      expect(mocks.mutate).toHaveBeenCalledWith({
        plotId: 22,
        inputSource: 'MINERAL_FERTILIZER',
        value: 24.5,
        unit: 'kg_n',
        recordedAt: '2026-03-17',
        sourceType: 'user_entered',
        sourceDocument: undefined,
        note: undefined,
      });
    });
  });

  it('limits aggregate nutrient form to fertilizer-only sources', async () => {
    renderPage();

    await chooseInputSource(/manure/i);
    fireEvent.change(screen.getByTestId('nutrient-value-input'), {
      target: { value: '8.9' },
    });
    fireEvent.change(screen.getByTestId('nutrient-recorded-at-input'), {
      target: { value: '2026-03-21' },
    });

    fireEvent.click(screen.getByTestId('submit-nutrient-input'));

    await waitFor(() => {
      expect(mocks.mutate).toHaveBeenCalledWith({
        plotId: 22,
        inputSource: 'ORGANIC_FERTILIZER',
        value: 8.9,
        unit: 'kg_n',
        recordedAt: '2026-03-21',
        sourceType: 'user_entered',
        sourceDocument: undefined,
        note: undefined,
      });
    });
  });

  it('does not expose deprecated legacy authoring options in aggregate nutrient form', async () => {
    renderPage();

    const inputSourceTrigger = screen.getAllByRole('combobox')[0];
    fireEvent.mouseDown(inputSourceTrigger);
    if (inputSourceTrigger.getAttribute('aria-expanded') !== 'true') {
      fireEvent.click(inputSourceTrigger);
    }

    await waitFor(() => {
      expect(inputSourceTrigger).toHaveAttribute('aria-expanded', 'true');
    });

    expect(screen.queryByRole('option', { name: /irrigation/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /soil/i })).not.toBeInTheDocument();
  });

  it('shows loading state on submit buttons while mutation is pending', () => {
    mocks.isPending = true;
    mocks.useCreateNutrientInput.mockImplementation(() => ({
      mutate: mocks.mutate,
      isPending: true,
    }));

    renderPage();

    expect(screen.getByTestId('submit-nutrient-input')).toBeDisabled();
    expect(screen.getByTestId('submit-nutrient-input-dashboard')).toBeDisabled();
  });
});
