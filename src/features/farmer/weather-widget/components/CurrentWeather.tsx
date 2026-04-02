import React from "react";
import {
    Thermometer,
    ChevronUp,
    ChevronDown,
    CloudRain,
} from "lucide-react";
import type { WeatherData } from "../types";

interface CurrentWeatherProps {
    weatherData: WeatherData;
}

/**
 * Current Weather Component
 * Displays main temperature, condition, feels-like, and high/low temps
 */
export const CurrentWeather = React.memo<CurrentWeatherProps>(({ weatherData }) => {
    const WeatherIcon = weatherData.icon;

    return (
        <div className="flex items-start justify-between mb-5">
            {/* Temperature & Condition */}
            <div className="flex items-center gap-4">
                <div className="relative">
                    <div
                        className="absolute inset-0 rounded-full blur-xl"
                        style={{
                            backgroundColor: "color-mix(in oklab, var(--accent) 20%, transparent)",
                        }}
                    />
                    <div
                        className="relative p-4 rounded-2xl shadow-lg"
                        style={{
                            background:
                                "linear-gradient(to bottom right, var(--accent), color-mix(in oklab, var(--accent) 70%, transparent))",
                        }}
                    >
                        <WeatherIcon className="w-10 h-10 text-white" />
                    </div>
                </div>
                <div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="numeric text-5xl text-foreground">
                            {weatherData.temperature}
                        </span>
                        <span className="text-2xl text-muted-foreground">°C</span>
                    </div>
                    <div className="text-sm text-secondary mt-1">
                        {weatherData.condition}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1.5">
                        <Thermometer className="w-3.5 h-3.5" />
                        <span>
                            Feels like <span className="numeric">{weatherData.feelsLike}°C</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* High/Low & Precipitation */}
            <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                    <ChevronUp className="w-4 h-4 text-destructive" />
                    <span className="numeric text-lg text-destructive">
                        {weatherData.highTemp}°
                    </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <ChevronDown className="w-4 h-4 text-secondary" />
                    <span className="numeric text-lg text-secondary">
                        {weatherData.lowTemp}°
                    </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
                    <CloudRain className="w-3.5 h-3.5 text-secondary" />
                    <span className="numeric">{weatherData.precipitation}%</span>
                    <span>rain</span>
                </div>
            </div>
        </div>
    );
});

CurrentWeather.displayName = "CurrentWeather";



