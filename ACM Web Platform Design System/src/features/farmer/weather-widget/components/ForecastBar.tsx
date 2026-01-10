import React from "react";
import { Calendar, CloudRain } from "lucide-react";
import type { ForecastDay } from "../types";

interface ForecastBarProps {
    forecast: ForecastDay[];
}

/**
 * Forecast Bar Component
 * Displays 3-day weather forecast in a compact horizontal layout
 */
export const ForecastBar = React.memo<ForecastBarProps>(({ forecast }) => {
    return (
        <div
            className="px-4 py-3 border-b border-border"
            style={{
                background: "linear-gradient(to right, var(--background), var(--card))",
            }}
        >
            <div className="flex items-center gap-1 mb-2">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">3-Day Forecast</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
                {forecast.map((day, index) => {
                    const DayIcon = day.icon;
                    return (
                        <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <DayIcon className="w-4 h-4 text-secondary" />
                                <div>
                                    <div className="text-xs text-muted-foreground">{day.day}</div>
                                    <div className="flex items-center gap-1 text-[0.65rem]">
                                        <span className="numeric text-destructive">{day.high}°</span>
                                        <span className="text-muted-foreground">/</span>
                                        <span className="numeric text-secondary">{day.low}°</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <CloudRain className="w-3 h-3 text-secondary" />
                                <span className="text-[0.65rem] numeric text-muted-foreground">
                                    {day.precipitation}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

ForecastBar.displayName = "ForecastBar";



