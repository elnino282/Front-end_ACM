/**
 * Weather API Service
 * Handles all API calls to WeatherAPI.com
 */

const WEATHER_API_KEY = "7ad902a7acdf44d791675824251212";
const WEATHER_API_BASE_URL = "https://api.weatherapi.com/v1";

/**
 * Location Suggestion from Search API
 */
export interface LocationSuggestion {
    id: number;
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    url: string;
}

/**
 * Current Weather API Response
 */
export interface CurrentWeatherResponse {
    location: {
        name: string;
        region: string;
        country: string;
        lat: number;
        lon: number;
        tz_id: string;
        localtime: string;
    };
    current: {
        last_updated: string;
        temp_c: number;
        feelslike_c: number;
        condition: {
            text: string;
            icon: string;
            code: number;
        };
        wind_kph: number;
        wind_dir: string;
        pressure_mb: number;
        precip_mm: number;
        humidity: number;
        cloud: number;
        vis_km: number;
        uv: number;
    };
}

/**
 * Forecast Day in API Response
 */
export interface ForecastDayResponse {
    date: string;
    day: {
        maxtemp_c: number;
        mintemp_c: number;
        avgtemp_c: number;
        maxwind_kph: number;
        totalprecip_mm: number;
        avghumidity: number;
        daily_chance_of_rain: number;
        condition: {
            text: string;
            icon: string;
            code: number;
        };
    };
    astro: {
        sunrise: string;
        sunset: string;
    };
}

/**
 * Forecast API Response
 */
export interface ForecastWeatherResponse {
    location: {
        name: string;
        region: string;
        country: string;
        lat: number;
        lon: number;
        tz_id: string;
        localtime: string;
    };
    current: CurrentWeatherResponse["current"];
    forecast: {
        forecastday: ForecastDayResponse[];
    };
}

/**
 * API Error Response
 */
export interface WeatherApiError {
    error: {
        code: number;
        message: string;
    };
}

/**
 * Search for location suggestions
 * @param query - Search query (city name)
 * @returns Array of location suggestions
 */
export async function searchLocations(
    query: string
): Promise<LocationSuggestion[]> {
    if (!query.trim()) {
        return [];
    }

    try {
        const response = await fetch(
            `${WEATHER_API_BASE_URL}/search.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(
                query
            )}`
        );

        if (!response.ok) {
            const error: WeatherApiError = await response.json();
            throw new Error(error.error.message || "Failed to search locations");
        }

        const data: LocationSuggestion[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error searching locations:", error);
        throw error;
    }
}

/**
 * Get current weather data for a location
 * @param location - Location query (city name, coordinates, etc.)
 * @returns Current weather data
 */
export async function getCurrentWeather(
    location: string
): Promise<CurrentWeatherResponse> {
    try {
        const response = await fetch(
            `${WEATHER_API_BASE_URL}/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(
                location
            )}&aqi=no`
        );

        if (!response.ok) {
            const error: WeatherApiError = await response.json();
            throw new Error(error.error.message || "Failed to fetch weather data");
        }

        const data: CurrentWeatherResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching current weather:", error);
        throw error;
    }
}

/**
 * Get weather forecast for a location
 * @param location - Location query (city name, coordinates, etc.)
 * @param days - Number of days to forecast (1-14)
 * @returns Forecast weather data including current conditions
 */
export async function getForecast(
    location: string,
    days: number = 3
): Promise<ForecastWeatherResponse> {
    try {
        const response = await fetch(
            `${WEATHER_API_BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(
                location
            )}&days=${days}&aqi=no&alerts=no`
        );

        if (!response.ok) {
            const error: WeatherApiError = await response.json();
            throw new Error(error.error.message || "Failed to fetch forecast data");
        }

        const data: ForecastWeatherResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching forecast:", error);
        throw error;
    }
}




