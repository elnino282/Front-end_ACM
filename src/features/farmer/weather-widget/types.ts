import type { LucideIcon } from "lucide-react";

/**
 * Widget Display Variant
 */
export type WeatherWidgetVariant = "compact" | "detailed";

/**
 * Alert Types for Agricultural Operations
 */
export type AlertType = "frost" | "heat" | "wind" | "rain";

/**
 * Alert Severity Levels
 */
export type AlertSeverity = "low" | "medium" | "high";

/**
 * Spray Conditions Status
 */
export type SprayConditionsStatus = "poor" | "fair" | "excellent";

/**
 * Soil Moisture Status
 */
export type SoilMoistureStatus = "dry" | "optimal" | "wet";

/**
 * Props for the main WeatherWidget component
 */
export interface WeatherWidgetProps {
    variant?: WeatherWidgetVariant;
}

/**
 * Weather Data Structure
 */
export interface WeatherData {
    temperature: number;
    feelsLike: number;
    condition: string;
    icon: LucideIcon;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    visibility: number;
    pressure: number;
    uvIndex: number;
    sunrise: string;
    sunset: string;
    highTemp: number;
    lowTemp: number;
    precipitation: number;
    lastUpdated: string;
}

/**
 * Single Day Forecast
 */
export interface ForecastDay {
    day: string;
    icon: LucideIcon;
    high: number;
    low: number;
    precipitation: number;
}

/**
 * Agricultural Alert
 */
export interface AgriAlert {
    type: AlertType;
    severity: AlertSeverity;
    title: string;
    description: string;
}

/**
 * UV Index Information
 */
export interface UVIndexInfo {
    color: string;
    label: string;
}

/**
 * Spray Conditions Information
 */
export interface SprayConditions {
    status: SprayConditionsStatus;
    color: string;
    label: string;
}

/**
 * Soil Moisture Information
 * @deprecated Soil moisture data not available from Weather API
 */
export interface SoilMoistureInfo {
    color: string;
    label: string;
    bg: string;
}

/**
 * Location Suggestion for Autocomplete
 */
export interface LocationSuggestion {
    id: number;
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    displayName: string;
}

/**
 * Location State
 */
export interface LocationState {
    location: string;
    isEditingLocation: boolean;
    tempLocation: string;
}

/**
 * Loading State
 */
export interface LoadingState {
    isLoading: boolean;
    error: string | null;
}

/**
 * Hook Return Type - Controller API
 */
export interface UseWeatherWidgetReturn {
    // Weather Data
    weatherData: WeatherData | null;
    forecast: ForecastDay[];
    agriAlerts: AgriAlert[];

    // Location State
    location: string | null;
    isEditingLocation: boolean;
    tempLocation: string;
    locationSuggestions: LocationSuggestion[];
    isSearchingLocations: boolean;

    // Loading/Error State
    isLoading: boolean;
    error: string | null;

    // Handlers
    setTempLocation: (value: string) => void;
    setIsEditingLocation: (value: boolean) => void;
    handleSaveLocation: (selectedLocation?: LocationSuggestion) => Promise<void>;
    handleCancelLocation: () => void;
    handleRefresh: () => Promise<void>;
    setError: (error: string | null) => void;
    handleLocationSearch: (query: string) => void;
    clearLocationSuggestions: () => void;

    // Computed Values
    getUVIndexColor: (index: number) => string;
    getUVIndexLabel: (index: number) => string;
    getSprayConditions: () => SprayConditions;
    getSoilMoistureStatus: (moisture: number) => SoilMoistureInfo;
    getAlertIcon: (type: string) => JSX.Element;
    getAlertColor: (severity: string) => string;
}



