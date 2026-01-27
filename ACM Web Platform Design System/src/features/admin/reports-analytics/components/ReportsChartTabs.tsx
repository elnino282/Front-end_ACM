import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  CostCategoryRow,
  CostTimeRow,
  CostVendorRow,
  ProfitRow,
  RevenueRow,
  YieldAnalyticsRow,
} from "@/services/api.admin";
import { usePreferences } from "@/shared/contexts";
import { convertWeight, formatMoney, getWeightUnitLabel } from "@/shared/lib";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface YieldTotals {
  actualYield: number;
  harvestCount: number;
}

export interface CostTotals {
  totalCost: number;
  expenseCount: number;
}

export interface RevenueTotals {
  totalQuantity: number;
  totalRevenue: number;
  avgPrice: number | null;
}

export interface ProfitTotals {
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  marginPercent: number | null;
}

interface ReportsChartTabsProps {
  yieldRows: YieldAnalyticsRow[];
  yieldTotals?: YieldTotals | null;
  costRows: CostCategoryRow[];
  costTotals?: CostTotals | null;
  costVendorRows: CostVendorRow[];
  costTimeSeries: CostTimeRow[];
  revenueRows: RevenueRow[];
  revenueTotals?: RevenueTotals | null;
  profitRows: ProfitRow[];
  profitTotals?: ProfitTotals | null;
  activeTab: "yield" | "cost" | "revenue" | "profit";
  onTabChange: (tab: "yield" | "cost" | "revenue" | "profit") => void;
  onReset?: () => void;
  isLoading?: boolean;
  costGranularity: "DAY" | "WEEK" | "MONTH";
  onCostGranularityChange: (value: "DAY" | "WEEK" | "MONTH") => void;
  drilldownAvailable?: boolean;
  onRowClick?: (
    tab: "yield" | "cost" | "revenue" | "profit",
    row: unknown,
  ) => void;
}

const formatNumber = (
  num: number,
  locale: string,
  maximumFractionDigits?: number,
) => new Intl.NumberFormat(locale, { maximumFractionDigits }).format(num);

const formatCompactNumber = (num: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);

const buildYieldLabel = (row: YieldAnalyticsRow) => {
  const parts = [
    row.farmName,
    row.plotName,
    row.cropName,
    row.varietyName,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" / ") : "Unknown";
};

const buildCropPlotLabel = (row: {
  cropName?: string | null;
  plotName?: string | null;
}) => {
  const parts = [row.cropName, row.plotName].filter(Boolean);
  return parts.length > 0 ? parts.join(" / ") : "Unknown";
};

const getCategoryLabel = (category?: string | null) =>
  category?.trim() || "Uncategorized";
const getVendorLabel = (vendor?: string | null) =>
  vendor?.trim() || "Unassigned";

// Empty state component
const EmptyState: React.FC<{ onReset?: () => void }> = ({ onReset }) => (
  <div className="h-[320px] flex flex-col items-center justify-center text-muted-foreground">
    <p className="mb-2 text-sm">No data for selected filters</p>
    {onReset && (
      <Button variant="link" onClick={onReset} className="text-primary text-sm">
        Reset filters
      </Button>
    )}
  </div>
);

// Loading spinner
const LoadingSpinner: React.FC = () => (
  <div className="h-[320px] flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

export const ReportsChartTabs: React.FC<ReportsChartTabsProps> = ({
  yieldRows,
  yieldTotals,
  costRows,
  costTotals,
  costVendorRows,
  costTimeSeries,
  revenueRows,
  revenueTotals,
  profitRows,
  profitTotals,
  activeTab,
  onTabChange,
  onReset,
  isLoading = false,
  costGranularity,
  onCostGranularityChange,
  drilldownAvailable = false,
  onRowClick,
}) => {
  const { preferences } = usePreferences();
  const unitLabel = getWeightUnitLabel(preferences.weightUnit);
  const weightDecimals = preferences.weightUnit === "G" ? 0 : 2;
  const [showTable, setShowTable] = useState(false);
  const canDrilldown = drilldownAvailable && !!onRowClick;

  const displayYieldData = useMemo(() => {
    return yieldRows.map((row) => {
      const actual = convertWeight(
        row.actualYield ?? 0,
        preferences.weightUnit,
      );
      return {
        label: buildYieldLabel(row),
        actual,
        harvestCount: row.harvestCount ?? 0,
        row,
      };
    });
  }, [yieldRows, preferences.weightUnit]);

  const displayCostCategories = useMemo(() => {
    return costRows.map((row) => ({
      label: getCategoryLabel(row.category),
      totalCost: row.totalCost ?? 0,
      expenseCount: row.expenseCount ?? 0,
      row,
    }));
  }, [costRows]);

  const displayRevenueData = useMemo(() => {
    return revenueRows.map((row) => ({
      label: buildCropPlotLabel(row),
      totalRevenue: row.totalRevenue ?? 0,
      totalQuantity: row.totalQuantity ?? 0,
      avgPrice: row.avgPrice ?? null,
      row,
    }));
  }, [revenueRows]);

  const displayProfitData = useMemo(() => {
    return profitRows.map((row) => ({
      label: buildCropPlotLabel(row),
      totalRevenue: row.totalRevenue ?? 0,
      totalCost: row.totalCost ?? 0,
      grossProfit: row.grossProfit ?? 0,
      marginPercent: row.marginPercent ?? null,
      row,
    }));
  }, [profitRows]);

  const formatWeightValue = (value: number) =>
    formatNumber(value, preferences.locale, weightDecimals);
  const formatCurrencyValue = (value: number) =>
    formatMoney(value, preferences.currency, preferences.locale);

  const isEmpty = (() => {
    switch (activeTab) {
      case "yield":
        return yieldRows.length === 0;
      case "cost":
        return (
          costRows.length === 0 &&
          costVendorRows.length === 0 &&
          costTimeSeries.length === 0
        );
      case "revenue":
        return revenueRows.length === 0;
      case "profit":
        return profitRows.length === 0;
      default:
        return true;
    }
  })();

  const handleRowClick = (
    tab: "yield" | "cost" | "revenue" | "profit",
    row: unknown,
  ) => {
    if (canDrilldown && onRowClick) {
      onRowClick(tab, row);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Header with Controls */}
      <div className="flex items-center justify-between">
        {/* Tab List */}
        <Tabs
          value={activeTab}
          onValueChange={(v) =>
            onTabChange(v as "yield" | "cost" | "revenue" | "profit")
          }
        >
          <TabsList className="h-10 p-1 rounded-[18px] bg-muted border-0">
            <TabsTrigger
              value="yield"
              className="h-8 px-4 rounded-[18px] text-sm font-medium text-muted-foreground data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground transition-all"
            >
              Yield
            </TabsTrigger>
            <TabsTrigger
              value="cost"
              className="h-8 px-4 rounded-[18px] text-sm font-medium text-muted-foreground data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground transition-all"
            >
              Cost
            </TabsTrigger>
            <TabsTrigger
              value="revenue"
              className="h-8 px-4 rounded-[18px] text-sm font-medium text-muted-foreground data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground transition-all"
            >
              Revenue
            </TabsTrigger>
            <TabsTrigger
              value="profit"
              className="h-8 px-4 rounded-[18px] text-sm font-medium text-muted-foreground data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground transition-all"
            >
              Profit
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          {activeTab === "cost" && (
            <Select
              value={costGranularity}
              onValueChange={(value) =>
                onCostGranularityChange(value as "DAY" | "WEEK" | "MONTH")
              }
            >
              <SelectTrigger className="h-8 w-[140px] rounded-[14px] border-border bg-card text-foreground text-sm">
                <SelectValue placeholder="Granularity" />
              </SelectTrigger>
              <SelectContent className="rounded-[14px]">
                <SelectItem value="DAY">By Day</SelectItem>
                <SelectItem value="WEEK">By Week</SelectItem>
                <SelectItem value="MONTH">By Month</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Show Table Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTable(!showTable)}
            className="h-8 px-3 rounded-[14px] border-border bg-muted hover:bg-muted/80 text-foreground font-medium text-sm"
          >
            Show table
            <ChevronDown
              className={`w-4 h-4 ml-2 transition-transform ${showTable ? "rotate-180" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Chart Card */}
      <Card className="!rounded-[18px] border-border bg-card shadow-sm">
        <CardContent className="p-6">
          {/* Chart Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col gap-0.5">
              <h3 className="text-xl font-medium text-foreground">
                {activeTab === "yield" && "Yield by Farm, Plot, Crop"}
                {activeTab === "cost" && "Cost Breakdown by Category"}
                {activeTab === "revenue" && "Revenue by Crop and Plot"}
                {activeTab === "profit" && "Profit by Crop and Plot"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {activeTab === "yield" &&
                  "Actual harvested yield for applied filters"}
                {activeTab === "cost" && "All expenses grouped by category"}
                {activeTab === "revenue" &&
                  "Total revenue for each crop and plot"}
                {activeTab === "profit" &&
                  "Revenue, cost, and gross profit comparison"}
              </p>
            </div>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : isEmpty ? (
            <EmptyState onReset={onReset} />
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              {activeTab === "yield" && (
                <BarChart
                  data={displayYieldData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  barCategoryGap="18%"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={({ x, y, payload }) => {
                      const label = payload.value;
                      const shortLabel =
                        label.length > 20 ? `${label.slice(0, 20)}...` : label;
                      return (
                        <g transform={`translate(${x},${y})`}>
                          <title>{label}</title>
                          <text
                            x={0}
                            y={0}
                            dy={16}
                            textAnchor="middle"
                            fill="var(--muted-foreground)"
                            fontSize={12}
                          >
                            {shortLabel}
                          </text>
                        </g>
                      );
                    }}
                    tickLine={false}
                    axisLine={{ stroke: "var(--border)" }}
                    height={50}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) =>
                      formatCompactNumber(value as number, preferences.locale)
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      formatWeightValue(value),
                      `Yield (${unitLabel})`,
                    ]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--card)",
                      color: "var(--foreground)",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      padding: "12px",
                    }}
                    cursor={{ fill: "rgba(0, 0, 0, 0.04)" }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    wrapperStyle={{ paddingTop: "20px" }}
                  />
                  <Bar
                    dataKey="actual"
                    name={`Yield (${unitLabel})`}
                    fill="#4ade80"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={100}
                  />
                </BarChart>
              )}

              {activeTab === "cost" && (
                <BarChart
                  data={displayCostCategories}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  barCategoryGap="18%"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={({ x, y, payload }) => {
                      const label = payload.value;
                      const shortLabel =
                        label.length > 18 ? `${label.slice(0, 18)}...` : label;
                      return (
                        <g transform={`translate(${x},${y})`}>
                          <title>{label}</title>
                          <text
                            x={0}
                            y={0}
                            dy={16}
                            textAnchor="middle"
                            fill="var(--muted-foreground)"
                            fontSize={12}
                          >
                            {shortLabel}
                          </text>
                        </g>
                      );
                    }}
                    tickLine={false}
                    axisLine={{ stroke: "var(--border)" }}
                    height={50}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) =>
                      formatCompactNumber(value as number, preferences.locale)
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      formatCurrencyValue(value),
                      "Total Cost",
                    ]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--card)",
                      color: "var(--foreground)",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      padding: "12px",
                    }}
                    cursor={{ fill: "rgba(0, 0, 0, 0.04)" }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    wrapperStyle={{ paddingTop: "20px" }}
                  />
                  <Bar
                    dataKey="totalCost"
                    name={`Total Cost (${preferences.currency})`}
                    fill="#f59e0b"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={100}
                  />
                </BarChart>
              )}

              {activeTab === "revenue" && (
                <BarChart
                  data={displayRevenueData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  barCategoryGap="18%"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={({ x, y, payload }) => {
                      const label = payload.value;
                      const shortLabel =
                        label.length > 18 ? `${label.slice(0, 18)}...` : label;
                      return (
                        <g transform={`translate(${x},${y})`}>
                          <title>{label}</title>
                          <text
                            x={0}
                            y={0}
                            dy={16}
                            textAnchor="middle"
                            fill="var(--muted-foreground)"
                            fontSize={12}
                          >
                            {shortLabel}
                          </text>
                        </g>
                      );
                    }}
                    tickLine={false}
                    axisLine={{ stroke: "var(--border)" }}
                    height={50}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) =>
                      formatCompactNumber(value as number, preferences.locale)
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      formatCurrencyValue(value),
                      "Revenue",
                    ]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--card)",
                      color: "var(--foreground)",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      padding: "12px",
                    }}
                    cursor={{ fill: "rgba(0, 0, 0, 0.04)" }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    wrapperStyle={{ paddingTop: "20px" }}
                  />
                  <Bar
                    dataKey="totalRevenue"
                    name={`Revenue (${preferences.currency})`}
                    fill="#4ade80"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={100}
                  />
                </BarChart>
              )}

              {activeTab === "profit" && (
                <BarChart
                  data={displayProfitData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  barCategoryGap="18%"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={({ x, y, payload }) => {
                      const label = payload.value;
                      const shortLabel =
                        label.length > 18 ? `${label.slice(0, 18)}...` : label;
                      return (
                        <g transform={`translate(${x},${y})`}>
                          <title>{label}</title>
                          <text
                            x={0}
                            y={0}
                            dy={16}
                            textAnchor="middle"
                            fill="var(--muted-foreground)"
                            fontSize={12}
                          >
                            {shortLabel}
                          </text>
                        </g>
                      );
                    }}
                    tickLine={false}
                    axisLine={{ stroke: "var(--border)" }}
                    height={50}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) =>
                      formatCompactNumber(value as number, preferences.locale)
                    }
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      const labels: Record<string, string> = {
                        totalRevenue: "Revenue",
                        totalCost: "Cost",
                        grossProfit: "Gross Profit",
                      };
                      return [formatCurrencyValue(value), labels[name] || name];
                    }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--card)",
                      color: "var(--foreground)",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      padding: "12px",
                    }}
                    cursor={{ fill: "rgba(0, 0, 0, 0.04)" }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    wrapperStyle={{ paddingTop: "20px" }}
                  />
                  <Bar
                    dataKey="totalRevenue"
                    name={`Revenue (${preferences.currency})`}
                    fill="#4ade80"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={70}
                  />
                  <Bar
                    dataKey="totalCost"
                    name={`Cost (${preferences.currency})`}
                    fill="#f59e0b"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={70}
                  />
                  <Bar
                    dataKey="grossProfit"
                    name={`Gross Profit (${preferences.currency})`}
                    fill="#2563eb"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={70}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Data Tables (Collapsible) */}
      {showTable && (
        <Card className="!rounded-[18px] border-border bg-card shadow-sm">
          <CardContent className="p-6 space-y-6">
            {/* Yield Table */}
            {activeTab === "yield" && (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border hover:bg-transparent">
                    <TableHead className="text-sm font-medium text-foreground">
                      Farm
                    </TableHead>
                    <TableHead className="text-sm font-medium text-foreground">
                      Plot
                    </TableHead>
                    <TableHead className="text-sm font-medium text-foreground">
                      Crop
                    </TableHead>
                    <TableHead className="text-sm font-medium text-foreground">
                      Variety
                    </TableHead>
                    <TableHead className="text-sm font-medium text-foreground text-right">
                      Yield ({unitLabel})
                    </TableHead>
                    <TableHead className="text-sm font-medium text-foreground text-right">
                      Harvests
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {yieldRows.map((row, index) => {
                    const displayYield = convertWeight(
                      row.actualYield ?? 0,
                      preferences.weightUnit,
                    );
                    return (
                      <TableRow
                        key={index}
                        onClick={() => handleRowClick("yield", row)}
                        title={!canDrilldown ? "Page not available" : undefined}
                        className={`border-b border-border/50 ${canDrilldown ? "hover:bg-muted/50 cursor-pointer" : "cursor-not-allowed"}`}
                      >
                        <TableCell className="text-sm text-foreground font-medium">
                          {row.farmName ?? "—"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {row.plotName ?? "—"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {row.cropName ?? "—"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {row.varietyName ?? "—"}
                        </TableCell>
                        <TableCell className="text-sm text-foreground text-right">
                          {formatWeightValue(displayYield)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground text-right">
                          {row.harvestCount ?? 0}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {yieldTotals && (
                    <TableRow className="border-t border-border bg-muted/50">
                      <TableCell
                        className="text-sm font-semibold text-foreground"
                        colSpan={4}
                      >
                        Totals
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-foreground text-right">
                        {formatWeightValue(
                          convertWeight(
                            yieldTotals.actualYield ?? 0,
                            preferences.weightUnit,
                          ),
                        )}
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-foreground text-right">
                        {yieldTotals.harvestCount ?? 0}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}

            {/* Cost Tables */}
            {activeTab === "cost" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-foreground">
                    Category breakdown
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-border hover:bg-transparent">
                        <TableHead className="text-sm font-medium text-foreground">
                          Category
                        </TableHead>
                        <TableHead className="text-sm font-medium text-foreground text-right">
                          Total Cost ({preferences.currency})
                        </TableHead>
                        <TableHead className="text-sm font-medium text-foreground text-right">
                          Expenses
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {costRows.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-sm text-muted-foreground text-center py-6"
                          >
                            No category data
                          </TableCell>
                        </TableRow>
                      )}
                      {costRows.map((row, index) => (
                        <TableRow
                          key={index}
                          onClick={() => handleRowClick("cost", row)}
                          title={
                            !canDrilldown ? "Page not available" : undefined
                          }
                          className={`border-b border-border/50 ${canDrilldown ? "hover:bg-muted/50 cursor-pointer" : "cursor-not-allowed"}`}
                        >
                          <TableCell className="text-sm text-foreground font-medium">
                            {getCategoryLabel(row.category)}
                          </TableCell>
                          <TableCell className="text-sm text-foreground text-right">
                            {formatCurrencyValue(row.totalCost ?? 0)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground text-right">
                            {row.expenseCount ?? 0}
                          </TableCell>
                        </TableRow>
                      ))}
                      {costTotals && (
                        <TableRow className="border-t border-border bg-muted/50">
                          <TableCell className="text-sm font-semibold text-foreground">
                            Totals
                          </TableCell>
                          <TableCell className="text-sm font-semibold text-foreground text-right">
                            {formatCurrencyValue(costTotals.totalCost ?? 0)}
                          </TableCell>
                          <TableCell className="text-sm font-semibold text-foreground text-right">
                            {costTotals.expenseCount ?? 0}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-semibold text-foreground">
                    Vendor breakdown
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-border hover:bg-transparent">
                        <TableHead className="text-sm font-medium text-foreground">
                          Vendor
                        </TableHead>
                        <TableHead className="text-sm font-medium text-foreground text-right">
                          Total Cost ({preferences.currency})
                        </TableHead>
                        <TableHead className="text-sm font-medium text-foreground text-right">
                          Expenses
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {costVendorRows.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-sm text-muted-foreground text-center py-6"
                          >
                            No vendor data
                          </TableCell>
                        </TableRow>
                      )}
                      {costVendorRows.map((row, index) => (
                        <TableRow
                          key={index}
                          onClick={() => handleRowClick("cost", row)}
                          title={
                            !canDrilldown ? "Page not available" : undefined
                          }
                          className={`border-b border-border/50 ${canDrilldown ? "hover:bg-muted/50 cursor-pointer" : "cursor-not-allowed"}`}
                        >
                          <TableCell className="text-sm text-foreground font-medium">
                            {getVendorLabel(row.vendorName)}
                          </TableCell>
                          <TableCell className="text-sm text-foreground text-right">
                            {formatCurrencyValue(row.totalCost ?? 0)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground text-right">
                            {row.expenseCount ?? 0}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-semibold text-foreground">
                    Time series
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-border hover:bg-transparent">
                        <TableHead className="text-sm font-medium text-foreground">
                          Period
                        </TableHead>
                        <TableHead className="text-sm font-medium text-foreground text-right">
                          Total Cost ({preferences.currency})
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {costTimeSeries.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            className="text-sm text-muted-foreground text-center py-6"
                          >
                            No time series data
                          </TableCell>
                        </TableRow>
                      )}
                      {costTimeSeries.map((row, index) => (
                        <TableRow
                          key={index}
                          onClick={() => handleRowClick("cost", row)}
                          title={
                            !canDrilldown ? "Page not available" : undefined
                          }
                          className={`border-b border-border/50 ${canDrilldown ? "hover:bg-muted/50 cursor-pointer" : "cursor-not-allowed"}`}
                        >
                          <TableCell className="text-sm text-foreground font-medium">
                            {row.label ?? row.periodStart ?? "—"}
                          </TableCell>
                          <TableCell className="text-sm text-foreground text-right">
                            {formatCurrencyValue(row.totalCost ?? 0)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Revenue Table */}
            {activeTab === "revenue" && (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border hover:bg-transparent">
                    <TableHead className="text-sm font-medium text-foreground">
                      Crop
                    </TableHead>
                    <TableHead className="text-sm font-medium text-foreground">
                      Plot
                    </TableHead>
                    <TableHead className="text-sm font-medium text-foreground text-right">
                      Quantity ({unitLabel})
                    </TableHead>
                    <TableHead className="text-sm font-medium text-foreground text-right">
                      Revenue ({preferences.currency})
                    </TableHead>
                    <TableHead className="text-sm font-medium text-foreground text-right">
                      Avg Price
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenueRows.map((row, index) => {
                    const displayQuantity = convertWeight(
                      row.totalQuantity ?? 0,
                      preferences.weightUnit,
                    );
                    const avgPriceLabel =
                      row.avgPrice != null
                        ? `${formatCurrencyValue(row.avgPrice)}/${unitLabel}`
                        : "—";
                    return (
                      <TableRow
                        key={index}
                        onClick={() => handleRowClick("revenue", row)}
                        title={!canDrilldown ? "Page not available" : undefined}
                        className={`border-b border-border/50 ${canDrilldown ? "hover:bg-muted/50 cursor-pointer" : "cursor-not-allowed"}`}
                      >
                        <TableCell className="text-sm text-foreground font-medium">
                          {row.cropName ?? "—"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {row.plotName ?? "—"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground text-right">
                          {formatWeightValue(displayQuantity)}
                        </TableCell>
                        <TableCell className="text-sm text-foreground text-right">
                          {formatCurrencyValue(row.totalRevenue ?? 0)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground text-right">
                          {avgPriceLabel}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {revenueTotals && (
                    <TableRow className="border-t border-border bg-muted/50">
                      <TableCell
                        className="text-sm font-semibold text-foreground"
                        colSpan={2}
                      >
                        Totals
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-foreground text-right">
                        {formatWeightValue(
                          convertWeight(
                            revenueTotals.totalQuantity ?? 0,
                            preferences.weightUnit,
                          ),
                        )}
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-foreground text-right">
                        {formatCurrencyValue(revenueTotals.totalRevenue ?? 0)}
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-foreground text-right">
                        {revenueTotals.avgPrice != null
                          ? `${formatCurrencyValue(revenueTotals.avgPrice)}/${unitLabel}`
                          : "—"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}

            {/* Profit Table */}
            {activeTab === "profit" && (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border hover:bg-transparent">
                    <TableHead className="text-sm font-medium text-foreground">
                      Crop
                    </TableHead>
                    <TableHead className="text-sm font-medium text-foreground">
                      Plot
                    </TableHead>
                    <TableHead className="text-sm font-medium text-foreground text-right">
                      Revenue ({preferences.currency})
                    </TableHead>
                    <TableHead className="text-sm font-medium text-foreground text-right">
                      Cost ({preferences.currency})
                    </TableHead>
                    <TableHead className="text-sm font-medium text-foreground text-right">
                      Gross Profit ({preferences.currency})
                    </TableHead>
                    <TableHead className="text-sm font-medium text-foreground text-right">
                      Margin
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profitRows.map((row, index) => (
                    <TableRow
                      key={index}
                      onClick={() => handleRowClick("profit", row)}
                      title={!canDrilldown ? "Page not available" : undefined}
                      className={`border-b border-border/50 ${canDrilldown ? "hover:bg-muted/50 cursor-pointer" : "cursor-not-allowed"}`}
                    >
                      <TableCell className="text-sm text-foreground font-medium">
                        {row.cropName ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {row.plotName ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm text-foreground text-right">
                        {formatCurrencyValue(row.totalRevenue ?? 0)}
                      </TableCell>
                      <TableCell className="text-sm text-warning text-right">
                        {formatCurrencyValue(row.totalCost ?? 0)}
                      </TableCell>
                      <TableCell
                        className={`text-sm text-right font-medium ${(row.grossProfit ?? 0) >= 0 ? "text-success" : "text-destructive"}`}
                      >
                        {(row.grossProfit ?? 0) >= 0 ? "+" : ""}
                        {formatCurrencyValue(row.grossProfit ?? 0)}
                      </TableCell>
                      <TableCell
                        className={`text-sm text-right font-medium ${(row.marginPercent ?? 0) >= 0 ? "text-success" : "text-destructive"}`}
                      >
                        {row.marginPercent != null
                          ? `${row.marginPercent.toFixed(1)}%`
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {profitTotals && (
                    <TableRow className="border-t border-border bg-muted/50">
                      <TableCell
                        className="text-sm font-semibold text-foreground"
                        colSpan={2}
                      >
                        Totals
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-foreground text-right">
                        {formatCurrencyValue(profitTotals.totalRevenue ?? 0)}
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-foreground text-right">
                        {formatCurrencyValue(profitTotals.totalCost ?? 0)}
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-foreground text-right">
                        {formatCurrencyValue(profitTotals.grossProfit ?? 0)}
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-foreground text-right">
                        {profitTotals.marginPercent != null
                          ? `${profitTotals.marginPercent.toFixed(1)}%`
                          : "—"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
