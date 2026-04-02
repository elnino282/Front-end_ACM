import {
    FileText,
    Image as ImageIcon,
    Video,
    FileSpreadsheet,
    BookOpen,
} from "lucide-react";

// Note: MOCK_DOCUMENTS removed - now using entity API hooks

export const CROP_OPTIONS = ["Rice", "Corn", "Wheat", "Soybean", "Barley"];

export const STAGE_OPTIONS = ["Planting", "Growing", "Harvest", "Post-Harvest"];

export const TOPIC_OPTIONS = [
    "Best Practices",
    "Pest Management",
    "Water Management",
    "Soil Management",
    "Farm Planning",
    "Climate Adaptation",
    "Farm Operations",
];

export const TYPE_OPTIONS = [
    { value: "pdf" as const, label: "PDF Documents", icon: FileText },
    { value: "image" as const, label: "Images", icon: ImageIcon },
    { value: "video" as const, label: "Videos", icon: Video },
    { value: "spreadsheet" as const, label: "Spreadsheets", icon: FileSpreadsheet },
    { value: "guide" as const, label: "Guides", icon: BookOpen },
];

export const SEASON_OPTIONS = ["Spring 2025", "Summer 2025", "Fall 2024", "Winter 2024"];



