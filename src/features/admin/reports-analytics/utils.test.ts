import { describe, expect, it } from "vitest";
import {
  getExportFileName,
  isValidDateRange,
  parseFilenameFromDisposition,
} from "./utils";

describe("reports-analytics utils", () => {
  it("builds deterministic export file names", () => {
    expect(
      getExportFileName({
        tab: "yield",
        dateFrom: "2026-01-01",
        dateTo: "2026-01-31",
        farmId: "12",
        plotId: "3",
      })
    ).toBe("reports_yield_20260101-20260131_farm-12_plot-3.csv");

    expect(getExportFileName({ tab: "profit" })).toBe(
      "reports_profit_all_farm-all_plot-all.csv"
    );
  });

  it("parses filename from content-disposition", () => {
    expect(
      parseFilenameFromDisposition(
        "attachment; filename*=UTF-8''reports_profit_202601.csv"
      )
    ).toBe("reports_profit_202601.csv");

    expect(
      parseFilenameFromDisposition('attachment; filename="report.csv"')
    ).toBe("report.csv");

    expect(parseFilenameFromDisposition(undefined)).toBeNull();
  });

  it("validates date ranges", () => {
    expect(isValidDateRange("2026-01-01", "2026-01-31")).toBe(true);
    expect(isValidDateRange("2026-01-31", "2026-01-01")).toBe(false);
    expect(isValidDateRange("", "2026-01-01")).toBe(true);
  });
});
