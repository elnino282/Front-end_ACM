import type {
    AITip,
    Payable,
    CategoryData,
    MonthlyTrendData,
    CategoryComparisonData,
} from "./types";

// Category Colors
export const CATEGORY_COLORS: Record<string, string> = {
    Fertilizer: "var(--primary)",
    Seeds: "var(--secondary)",
    Equipment: "var(--accent)",
    Pesticide: "var(--chart-4)",
    Labor: "var(--muted-foreground)",
    Transportation: "var(--primary)",
    Utilities: "var(--secondary)",
    Maintenance: "var(--chart-5)",
    Other: "var(--muted-foreground)",
};

// Select Options
export const SEASON_OPTIONS = [
    { value: "all", label: "All Seasons" },
    { value: "Rice Season 2025", label: "Rice Season 2025" },
    { value: "Corn Season 2025", label: "Corn Season 2025" },
    { value: "Wheat Season 2025", label: "Wheat Season 2025" },
];

export const CATEGORY_OPTIONS = [
    { value: "all", label: "Tất cả danh mục" },
    { value: "Fertilizer", label: "Phân bón" },
    { value: "Seeds", label: "Giống cây" },
    { value: "Labor", label: "Nhân công" },
    { value: "Equipment", label: "Thiết bị" },
    { value: "Pesticide", label: "Thuốc BVTV" },
    { value: "Transportation", label: "Vận chuyển" },
    { value: "Utilities", label: "Tiện ích" },
    { value: "Maintenance", label: "Bảo trì" },
    { value: "Other", label: "Khác" },
];

export const STATUS_OPTIONS = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "PAID", label: "Đã thanh toán" },
    { value: "PENDING", label: "Chờ thanh toán" },
    { value: "UNPAID", label: "Chưa thanh toán" },
];



