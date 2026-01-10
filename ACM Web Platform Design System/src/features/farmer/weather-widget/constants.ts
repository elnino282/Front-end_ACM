import type { AgriAlert } from "./types";

/**
 * API Configuration
 */
export const API_CONFIG = {
    WEATHER_API_KEY: "7ad902a7acdf44d791675824251212",
    WEATHER_API_BASE_URL: "https://api.weatherapi.com/v1",
    DEFAULT_LOCATION: "My Farm Location",
    AUTOCOMPLETE_DEBOUNCE_MS: 300,
    FORECAST_DAYS: 4, // Request 4 days to get today + 3 forecast days
} as const;

/**
 * UV Index Thresholds
 */
export const UV_INDEX = {
    LOW_THRESHOLD: 2,
    MODERATE_THRESHOLD: 5,
    HIGH_THRESHOLD: 7,
} as const;

/**
 * UV Index Color Mapping
 */
export const UV_COLORS = {
    LOW: "text-primary",
    MODERATE: "text-accent",
    HIGH: "text-accent",
    VERY_HIGH: "text-destructive",
} as const;

/**
 * UV Index Label Mapping
 */
export const UV_LABELS = {
    LOW: "Low",
    MODERATE: "Moderate",
    HIGH: "High",
    VERY_HIGH: "Very High",
} as const;

/**
 * Spray Conditions Thresholds
 */
export const SPRAY_CONDITIONS = {
    MAX_WIND_SPEED: 15,
    MIN_WIND_SPEED: 5,
    MAX_TEMPERATURE: 30,
    MIN_HUMIDITY: 50,
    MAX_HUMIDITY: 70,
} as const;

/**
 * Spray Condition Color Mapping
 */
export const SPRAY_COLORS = {
    POOR: "text-destructive",
    FAIR: "text-accent",
    EXCELLENT: "text-primary",
} as const;

/**
 * Soil Moisture Thresholds
 */
export const SOIL_MOISTURE = {
    DRY_THRESHOLD: 40,
    WET_THRESHOLD: 80,
} as const;

/**
 * Soil Moisture Status Colors
 */
export const SOIL_COLORS = {
    DRY: {
        color: "text-destructive",
        label: "Dry",
        bg: "bg-destructive",
    },
    WET: {
        color: "text-secondary",
        label: "Wet",
        bg: "bg-secondary",
    },
    OPTIMAL: {
        color: "text-primary",
        label: "Optimal",
        bg: "bg-primary",
    },
} as const;

/**
 * Alert Severity Colors
 */
export const ALERT_COLORS = {
    HIGH: "border-destructive bg-destructive/5 text-destructive",
    MEDIUM: "border-accent bg-accent/5 text-accent",
    LOW: "border-primary bg-primary/5 text-primary",
} as const;

/**
 * Default Agricultural Alerts (when no weather data available)
 */
export const DEFAULT_AGRI_ALERTS: AgriAlert[] = [];



