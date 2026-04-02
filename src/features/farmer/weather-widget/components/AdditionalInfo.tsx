import React from "react";
import { Gauge } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { WeatherData } from "../types";

interface AdditionalInfoProps {
    weatherData: WeatherData;
}

/**
 * Additional Info Component
 * Displays supplementary weather information like pressure, sunrise/sunset
 */
export const AdditionalInfo = React.memo<AdditionalInfoProps>(
    ({ weatherData }) => {
        return (
            <div className="pt-3 border-t border-border">
                <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Pressure</span>
                        <div className="flex items-center gap-1">
                            <Gauge className="w-3 h-3 text-muted-foreground" />
                            <span className="numeric text-foreground">
                                {weatherData.pressure} mb
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Sunrise</span>
                        <span className="numeric text-foreground">
                            {weatherData.sunrise}
                        </span>
                    </div>
                </div>
                <Separator className="my-2" />
                <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Sunset</span>
                        <span className="numeric text-foreground">
                            {weatherData.sunset}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Today's Range</span>
                        <span className="numeric text-foreground">
                            {weatherData.lowTemp}° - {weatherData.highTemp}°
                        </span>
                    </div>
                </div>
            </div>
        );
    }
);

AdditionalInfo.displayName = "AdditionalInfo";



