import { useState, useCallback, useEffect, useRef } from "react";
import {
    Sun,
    CloudRain,
    Wind,
    Snowflake,
    AlertTriangle,
} from "lucide-react";
import type {
    UseWeatherWidgetReturn,
    SprayConditions,
    SoilMoistureInfo,
    LocationSuggestion,
    WeatherData,
    ForecastDay,
} from "../types";
import {
    DEFAULT_AGRI_ALERTS,
    API_CONFIG,
    UV_INDEX,
    UV_COLORS,
    UV_LABELS,
    SPRAY_CONDITIONS,
    SPRAY_COLORS,
    SOIL_MOISTURE,
    SOIL_COLORS,
    ALERT_COLORS,
} from "../constants";
import { searchLocations, getForecast } from "../services/weatherApi";
import {
    mapForecastToWeatherData,
    mapForecastDays,
    generateAgriAlerts,
    mapLocationSuggestion,
} from "../utils/weatherMapper";

// LocalStorage key for persisting user's location preference
const WEATHER_LOCATION_KEY = 'acm_weather_location';

/**
 * Get farm location from user profile
 * TODO: Integrate with actual API when available
 */
const getFarmLocation = async (): Promise<string | null> => {
    try {
        // Example: const response = await api.getUserProfile();
        // return response.farm?.location || null;
        return null; // Not implemented yet
    } catch (error) {
        console.error('Failed to load farm location:', error);
        return null;
    }
};

/**
 * Custom Hook: Weather Widget Controller
 * Encapsulates all business logic, state management, and data fetching
 */
export function useWeatherWidget(): UseWeatherWidgetReturn {
    // Location State - Start with null, will be loaded from localStorage or farm profile
    const [location, setLocation] = useState<string | null>(null);
    const [isEditingLocation, setIsEditingLocation] = useState(false);
    const [tempLocation, setTempLocation] = useState<string>(location || "");
    const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
    const [isSearchingLocations, setIsSearchingLocations] = useState(false);

    // Loading/Error State
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Weather Data State
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [forecast, setForecast] = useState<ForecastDay[]>([]);
    const [agriAlerts, setAgriAlerts] = useState(DEFAULT_AGRI_ALERTS);

    // Debounce timer ref
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    // Initial load ref to fetch weather on mount
    const hasInitialLoadRef = useRef(false);

    /**
     * Fetch Weather Data for a Location
     */
    const fetchWeatherData = useCallback(async (locationQuery: string) => {
        if (!locationQuery) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await getForecast(locationQuery, API_CONFIG.FORECAST_DAYS);
            
            // Map current weather data
            const mappedWeatherData = mapForecastToWeatherData(response);
            setWeatherData(mappedWeatherData);
            
            // Map forecast data (skip today)
            const mappedForecast = mapForecastDays(response.forecast.forecastday, true);
            setForecast(mappedForecast);
            
            // Generate agricultural alerts
            const alerts = generateAgriAlerts(mappedWeatherData);
            setAgriAlerts(alerts);
            
            setIsLoading(false);
        } catch (err) {
            console.error("Error fetching weather data:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch weather data");
            setIsLoading(false);
        }
    }, []);

    /**
     * Handle Location Search with Debouncing
     */
    const handleLocationSearch = useCallback((query: string) => {
        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // If query is empty, clear suggestions
        if (!query.trim()) {
            setLocationSuggestions([]);
            setIsSearchingLocations(false);
            return;
        }

        // Set searching state
        setIsSearchingLocations(true);

        // Debounce the search
        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const results = await searchLocations(query);
                const mappedResults = results.map(mapLocationSuggestion);
                setLocationSuggestions(mappedResults);
                setIsSearchingLocations(false);
            } catch (err) {
                console.error("Error searching locations:", err);
                setLocationSuggestions([]);
                setIsSearchingLocations(false);
            }
        }, API_CONFIG.AUTOCOMPLETE_DEBOUNCE_MS);
    }, []);

    /**
     * Clear Location Suggestions
     */
    const clearLocationSuggestions = useCallback(() => {
        setLocationSuggestions([]);
        setIsSearchingLocations(false);
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
    }, []);

    /**
     * Save Location Handler
     * Updates location and fetches new weather data
     * Persists location to localStorage
     */
    const handleSaveLocation = useCallback(
        async (selectedLocation?: LocationSuggestion) => {
            const newLocation = selectedLocation
                ? selectedLocation.displayName
                : tempLocation.trim();

            if (!newLocation) {
                setError("Please enter a valid location");
                return;
            }

            setIsLoading(true);
            setError(null);
            clearLocationSuggestions();

            try {
                // Use the selected location query (name or coordinates)
                const locationQuery = selectedLocation
                    ? `${selectedLocation.lat},${selectedLocation.lon}`
                    : newLocation;

                await fetchWeatherData(locationQuery);
                setLocation(newLocation);
                
                // Save location to localStorage for future sessions
                localStorage.setItem(WEATHER_LOCATION_KEY, newLocation);
                
                setIsEditingLocation(false);
            } catch (err) {
                console.error("Error saving location:", err);
                setError(
                    err instanceof Error ? err.message : "Failed to fetch weather data"
                );
            } finally {
                setIsLoading(false);
            }
        },
        [tempLocation, fetchWeatherData, clearLocationSuggestions]
    );

    /**
     * Cancel Location Edit Handler
     */
    const handleCancelLocation = useCallback(() => {
        setTempLocation(location || "");
        setIsEditingLocation(false);
        setError(null);
        clearLocationSuggestions();
    }, [location, clearLocationSuggestions]);

    /**
     * Refresh Weather Data Handler
     */
    const handleRefresh = useCallback(async () => {
        if (!location) {
            setError("Please select a location first");
            return;
        }
        await fetchWeatherData(location);
    }, [location, fetchWeatherData]);

    /**
     * Get UV Index Color
     * Pure function to determine color based on UV index value
     */
    const getUVIndexColor = useCallback((index: number): string => {
        if (index <= UV_INDEX.LOW_THRESHOLD) return UV_COLORS.LOW;
        if (index <= UV_INDEX.MODERATE_THRESHOLD) return UV_COLORS.MODERATE;
        if (index <= UV_INDEX.HIGH_THRESHOLD) return UV_COLORS.HIGH;
        return UV_COLORS.VERY_HIGH;
    }, []);

    /**
     * Get UV Index Label
     * Pure function to determine label based on UV index value
     */
    const getUVIndexLabel = useCallback((index: number): string => {
        if (index <= UV_INDEX.LOW_THRESHOLD) return UV_LABELS.LOW;
        if (index <= UV_INDEX.MODERATE_THRESHOLD) return UV_LABELS.MODERATE;
        if (index <= UV_INDEX.HIGH_THRESHOLD) return UV_LABELS.HIGH;
        return UV_LABELS.VERY_HIGH;
    }, []);

    /**
     * Get Spray Conditions
     * Calculate optimal spray conditions based on weather parameters
     */
    const getSprayConditions = useCallback((): SprayConditions => {
        if (!weatherData) {
            return {
                status: "fair",
                color: SPRAY_COLORS.FAIR,
                label: "Unknown",
            };
        }

        const { windSpeed, humidity, temperature } = weatherData;

        if (windSpeed > SPRAY_CONDITIONS.MAX_WIND_SPEED) {
            return {
                status: "poor",
                color: SPRAY_COLORS.POOR,
                label: "Too Windy",
            };
        }

        if (temperature > SPRAY_CONDITIONS.MAX_TEMPERATURE) {
            return {
                status: "poor",
                color: SPRAY_COLORS.POOR,
                label: "Too Hot",
            };
        }

        if (
            windSpeed < SPRAY_CONDITIONS.MIN_WIND_SPEED &&
            humidity >= SPRAY_CONDITIONS.MIN_HUMIDITY &&
            humidity <= SPRAY_CONDITIONS.MAX_HUMIDITY
        ) {
            return {
                status: "excellent",
                color: SPRAY_COLORS.EXCELLENT,
                label: "Excellent",
            };
        }

        return {
            status: "fair",
            color: SPRAY_COLORS.FAIR,
            label: "Fair",
        };
    }, [weatherData]);

    /**
     * Get Soil Moisture Status
     * Determine soil moisture level with color coding
     * @deprecated Soil moisture data not available from Weather API
     */
    const getSoilMoistureStatus = useCallback(
        (moisture: number): SoilMoistureInfo => {
            if (moisture < SOIL_MOISTURE.DRY_THRESHOLD) return SOIL_COLORS.DRY;
            if (moisture > SOIL_MOISTURE.WET_THRESHOLD) return SOIL_COLORS.WET;
            return SOIL_COLORS.OPTIMAL;
        },
        []
    );

    /**
     * Get Alert Icon
     * Map alert type to corresponding icon component
     */
    const getAlertIcon = useCallback((type: string): JSX.Element => {
        switch (type) {
            case "frost":
                return <Snowflake className="w-4 h-4" />;
            case "heat":
                return <Sun className="w-4 h-4" />;
            case "wind":
                return <Wind className="w-4 h-4" />;
            case "rain":
                return <CloudRain className="w-4 h-4" />;
            default:
                return <AlertTriangle className="w-4 h-4" />;
        }
    }, []);

    /**
     * Get Alert Color
     * Map severity to color classes
     */
    const getAlertColor = useCallback((severity: string): string => {
        switch (severity) {
            case "high":
                return ALERT_COLORS.HIGH;
            case "medium":
                return ALERT_COLORS.MEDIUM;
            case "low":
                return ALERT_COLORS.LOW;
            default:
                return "";
        }
    }, []);

    /**
     * Wrapped State Setters
     * Wrap setState functions to match type signature
     */
    const handleSetTempLocation = useCallback((value: string) => {
        setTempLocation(value);
        handleLocationSearch(value);
    }, [handleLocationSearch]);

    const handleSetIsEditingLocation = useCallback((value: boolean) => {
        setIsEditingLocation(value);
        if (!value) {
            clearLocationSuggestions();
        }
    }, [clearLocationSuggestions]);

    /**
     * Smart Initial Location Loading
     * Priority: 1) Farm location, 2) localStorage, 3) null (empty state)
     */
    useEffect(() => {
        const loadInitialLocation = async () => {
            if (hasInitialLoadRef.current) return;
            hasInitialLoadRef.current = true;

            // Try to get farm location first (future feature)
            const farmLocation = await getFarmLocation();
            if (farmLocation) {
                setLocation(farmLocation);
                setTempLocation(farmLocation);
                fetchWeatherData(farmLocation);
                return;
            }

            // Fallback to localStorage
            const savedLocation = localStorage.getItem(WEATHER_LOCATION_KEY);
            if (savedLocation) {
                setLocation(savedLocation);
                setTempLocation(savedLocation);
                fetchWeatherData(savedLocation);
            }
            // If neither exists, location stays null and empty state is shown
        };

        loadInitialLocation();
    }, [fetchWeatherData]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // Return clean API surface
    return {
        // Weather Data
        weatherData,
        forecast,
        agriAlerts,

        // Location State
        location,
        isEditingLocation,
        tempLocation,
        locationSuggestions,
        isSearchingLocations,

        // Loading/Error State
        isLoading,
        error,

        // Handlers
        setTempLocation: handleSetTempLocation,
        setIsEditingLocation: handleSetIsEditingLocation,
        handleSaveLocation,
        handleCancelLocation,
        handleRefresh,
        setError,
        handleLocationSearch,
        clearLocationSuggestions,

        // Computed Values
        getUVIndexColor,
        getUVIndexLabel,
        getSprayConditions,
        getSoilMoistureStatus,
        getAlertIcon,
        getAlertColor,
    };
}



