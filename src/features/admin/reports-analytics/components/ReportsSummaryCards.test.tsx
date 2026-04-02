import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ReportsSummaryCards } from "./ReportsSummaryCards";

vi.mock("@/shared/contexts", () => ({
  usePreferences: () => ({
    preferences: {
      currency: "USD",
      weightUnit: "KG",
      locale: "en-US",
    },
  }),
}));

describe("ReportsSummaryCards", () => {
  it("renders KPI values from summary stats", () => {
    render(
      <ReportsSummaryCards
        stats={{
          actualYield: 2500,
          totalCost: 125000000,
          costPerTon: 50000,
          revenue: 250000000,
          grossProfit: 125000000,
          marginPercent: 50,
        }}
        warnings={["No harvested yield in selected range while expenses exist"]}
      />,
    );

    expect(screen.getByText("2,500 kg")).toBeInTheDocument();
    expect(screen.getByText("$10,000.00")).toBeInTheDocument();
    expect(screen.getByText("$2.00/kg")).toBeInTheDocument();
    expect(screen.getByText("50.0% margin")).toBeInTheDocument();
    expect(
      screen.getByText("No harvested yield in selected range while expenses exist"),
    ).toBeInTheDocument();

    // Total Cost and Gross Profit both equal 125,000,000 VND -> 5,000 USD.
    expect(screen.getAllByText("$5,000.00").length).toBeGreaterThanOrEqual(2);
  });

  it("falls back to zero-like values when stats are missing", () => {
    render(<ReportsSummaryCards stats={null} warnings={[]} />);

    expect(screen.getByText("0 kg")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.getAllByText("$0.00").length).toBeGreaterThanOrEqual(2);
  });
});
