import React from "react";
import {
    Droplets,
    Wind,
    Sun,
    Eye,
    Compass,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import type { WeatherData } from "../types";

interface WeatherDetailsProps {
    weatherData: WeatherData;
    getUVIndexColor: (index: number) => string;
    getUVIndexLabel: (index: number) => string;
}

/**
 * Weather Details Grid Component
 * Displays detailed weather metrics in a grid layout with tooltips
 */
export const WeatherDetails = React.memo<WeatherDetailsProps>(
    ({ weatherData, getUVIndexColor, getUVIndexLabel }) => {
        return (
            <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Humidity */}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="bg-secondary/10 rounded-xl p-3 cursor-help hover:bg-secondary/15 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <Droplets className="w-5 h-5 text-secondary" />
                                    <span className="text-xs text-muted-foreground">Humidity</span>
                                </div>
                                <div className="numeric text-2xl text-foreground">
                                    {weatherData.humidity}%
                                </div>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-xs">Relative humidity level</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Ideal for most crops
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {/* Wind */}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="bg-primary/10 rounded-xl p-3 cursor-help hover:bg-primary/15 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <Wind className="w-5 h-5 text-primary" />
                                    <span className="text-xs text-muted-foreground">Wind Speed</span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="numeric text-2xl text-foreground">
                                        {weatherData.windSpeed}
                                    </span>
                                    <span className="text-sm text-muted-foreground">km/h</span>
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                    <Compass className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">
                                        {weatherData.windDirection}
                                    </span>
                                </div>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-xs">Wind speed and direction</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Light breeze from northeast
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {/* UV Index */}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="bg-accent/10 rounded-xl p-3 cursor-help hover:bg-accent/10 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sun className="w-5 h-5 text-accent" />
                                    <span className="text-xs text-muted-foreground">UV Index</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="numeric text-2xl text-foreground">
                                        {weatherData.uvIndex}
                                    </span>
                                    <Badge
                                        className={`text-xs ${getUVIndexColor(
                                            weatherData.uvIndex
                                        )} bg-transparent border-0 px-0`}
                                    >
                                        {getUVIndexLabel(weatherData.uvIndex)}
                                    </Badge>
                                </div>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-xs">UV radiation level</p>
                            <p className="text-xs text-accent mt-1">
                                ⚠ High - Take precautions
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {/* Visibility */}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="bg-muted/30 rounded-xl p-3 cursor-help hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <Eye className="w-5 h-5 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">Visibility</span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="numeric text-2xl text-foreground">
                                        {weatherData.visibility}
                                    </span>
                                    <span className="text-sm text-muted-foreground">km</span>
                                </div>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-xs">Horizontal visibility distance</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Excellent visibility
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        );
    }
);

WeatherDetails.displayName = "WeatherDetails";



