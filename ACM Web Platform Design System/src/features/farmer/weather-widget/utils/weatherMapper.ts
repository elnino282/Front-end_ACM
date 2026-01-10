import {
    Sun,
    Cloud,
    CloudRain,
    CloudSnow,
    CloudDrizzle,
    CloudFog,
    CloudSun,
    Wind,
    Snowflake,
    CloudLightning,
    type LucideIcon,
} from "lucide-react";
import type { WeatherData, ForecastDay, AgriAlert } from "../types";
import type {
    CurrentWeatherResponse,
    ForecastWeatherResponse,
    ForecastDayResponse,
    LocationSuggestion,
} from "../services/weatherApi";

/**
 * Map WeatherAPI condition code to Lucide icon
 * Reference: https://www.weatherapi.com/docs/weather_conditions.json
 */
export function getWeatherIcon(conditionCode: number, conditionText: string): LucideIcon {
    // Sunny/Clear
    if (conditionCode === 1000) return Sun;
    
    // Partly cloudy
    if (conditionCode === 1003) return CloudSun;
    
    // Cloudy/Overcast
    if (conditionCode === 1006 || conditionCode === 1009) return Cloud;
    
    // Mist/Fog/Freezing fog
    if ([1030, 1135, 1147].includes(conditionCode)) return CloudFog;
    
    // Patchy rain possible/Light rain/Moderate rain
    if ([1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(conditionCode)) {
        return CloudRain;
    }
    
    // Patchy snow possible/Light snow/Moderate snow/Heavy snow
    if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(conditionCode)) {
        return CloudSnow;
    }
    
    // Patchy sleet/Ice pellets/Blizzard
    if ([1069, 1072, 1168, 1171, 1198, 1201, 1204, 1207, 1237, 1249, 1252, 1261, 1264].includes(conditionCode)) {
        return Snowflake;
    }
    
    // Thundery outbreaks/Thunder
    if ([1087, 1273, 1276, 1279, 1282].includes(conditionCode)) {
        return CloudLightning;
    }
    
    // Drizzle
    if ([1150, 1153, 1168, 1171].includes(conditionCode)) {
        return CloudDrizzle;
    }
    
    // Blowing snow/Blizzard
    if ([1114, 1117].includes(conditionCode)) {
        return Wind;
    }
    
    // Default based on text
    const text = conditionText.toLowerCase();
    if (text.includes("sunny") || text.includes("clear")) return Sun;
    if (text.includes("partly cloudy")) return CloudSun;
    if (text.includes("cloud")) return Cloud;
    if (text.includes("rain") || text.includes("shower")) return CloudRain;
    if (text.includes("snow")) return CloudSnow;
    if (text.includes("thunder") || text.includes("storm")) return CloudLightning;
    if (text.includes("drizzle")) return CloudDrizzle;
    if (text.includes("fog") || text.includes("mist")) return CloudFog;
    
    // Default fallback
    return Cloud;
}

/**
 * Format time from "HH:MM AM/PM" to "HH:MM"
 */
function formatTime(timeString: string): string {
    // Input format: "07:15 AM" or "06:15 PM"
    // Return as is or convert if needed
    return timeString;
}

/**
 * Get relative time string
 */
function getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    return "Today";
}

/**
 * Map API response to internal WeatherData format
 */
export function mapCurrentWeatherToWeatherData(
    response: CurrentWeatherResponse,
    forecastDay?: ForecastDayResponse
): WeatherData {
    const { current, location } = response;
    
    return {
        temperature: Math.round(current.temp_c),
        feelsLike: Math.round(current.feelslike_c),
        condition: current.condition.text,
        icon: getWeatherIcon(current.condition.code, current.condition.text),
        humidity: current.humidity,
        windSpeed: Math.round(current.wind_kph),
        windDirection: current.wind_dir,
        visibility: current.vis_km,
        pressure: Math.round(current.pressure_mb),
        uvIndex: current.uv,
        sunrise: forecastDay ? formatTime(forecastDay.astro.sunrise) : "06:00 AM",
        sunset: forecastDay ? formatTime(forecastDay.astro.sunset) : "06:00 PM",
        highTemp: forecastDay ? Math.round(forecastDay.day.maxtemp_c) : Math.round(current.temp_c),
        lowTemp: forecastDay ? Math.round(forecastDay.day.mintemp_c) : Math.round(current.temp_c),
        precipitation: Math.round(current.precip_mm),
        lastUpdated: getRelativeTime(current.last_updated),
    };
}

/**
 * Map forecast response to internal WeatherData format
 */
export function mapForecastToWeatherData(
    response: ForecastWeatherResponse
): WeatherData {
    const todayForecast = response.forecast.forecastday[0];
    return mapCurrentWeatherToWeatherData(
        {
            location: response.location,
            current: response.current,
        },
        todayForecast
    );
}

/**
 * Get day name from date string
 */
function getDayName(dateString: string, index: number): string {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // If it's tomorrow
    if (date.toDateString() === tomorrow.toDateString()) {
        return "Tomorrow";
    }
    
    // Get day abbreviation
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
}

/**
 * Map forecast days to internal ForecastDay format
 */
export function mapForecastDays(
    forecastDays: ForecastDayResponse[],
    skipToday: boolean = true
): ForecastDay[] {
    // Skip first day (today) if requested
    const daysToMap = skipToday ? forecastDays.slice(1) : forecastDays;
    
    return daysToMap.map((day, index) => ({
        day: getDayName(day.date, index),
        icon: getWeatherIcon(day.day.condition.code, day.day.condition.text),
        high: Math.round(day.day.maxtemp_c),
        low: Math.round(day.day.mintemp_c),
        precipitation: day.day.daily_chance_of_rain,
    }));
}

/**
 * Generate agricultural alerts based on weather data
 */
export function generateAgriAlerts(weatherData: WeatherData): AgriAlert[] {
    const alerts: AgriAlert[] = [];
    
    // Heat stress warning
    if (weatherData.temperature > 30) {
        alerts.push({
            type: "heat",
            severity: weatherData.temperature > 35 ? "high" : "medium",
            title: "Heat Stress Warning",
            description: "High temperatures expected. Increase irrigation for sensitive crops.",
        });
    }
    
    // Frost warning
    if (weatherData.lowTemp < 5) {
        alerts.push({
            type: "frost",
            severity: weatherData.lowTemp < 0 ? "high" : "medium",
            title: "Frost Warning",
            description: "Low temperatures may damage sensitive plants. Consider protection measures.",
        });
    }
    
    // Wind warning for spraying
    if (weatherData.windSpeed > 15) {
        alerts.push({
            type: "wind",
            severity: weatherData.windSpeed > 25 ? "high" : "medium",
            title: "High Wind Warning",
            description: "Wind speed too high for pesticide application. Wait for calmer conditions.",
        });
    } else if (weatherData.windSpeed >= 5 && weatherData.windSpeed <= 15) {
        alerts.push({
            type: "wind",
            severity: "low",
            title: "Good Spray Conditions",
            description: `Wind speed optimal for pesticide application.`,
        });
    }
    
    // Rain warning
    if (weatherData.precipitation > 10) {
        alerts.push({
            type: "rain",
            severity: weatherData.precipitation > 50 ? "high" : "medium",
            title: "Heavy Rain Expected",
            description: "Delay spraying operations. Monitor field drainage and soil moisture.",
        });
    }
    
    return alerts;
}

/**
 * Format location suggestion for display
 */
export function formatLocationDisplay(suggestion: LocationSuggestion): string {
    const parts = [suggestion.name];
    if (suggestion.region && suggestion.region !== suggestion.name) {
        parts.push(suggestion.region);
    }
    parts.push(suggestion.country);
    return parts.join(", ");
}

/**
 * Convert API location suggestion to internal format
 */
export function mapLocationSuggestion(apiSuggestion: LocationSuggestion): LocationSuggestion & { displayName: string } {
    return {
        ...apiSuggestion,
        displayName: formatLocationDisplay(apiSuggestion),
    };
}




