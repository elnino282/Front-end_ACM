import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useWeatherWidget } from "./hooks/useWeatherWidget";
import { CompactView } from "./components/CompactView";
import { DetailedView } from "./components/DetailedView";
import type { WeatherWidgetProps } from "./types";

/**
 * Weather Widget - Composition Root
 * Main entry point that initializes the hook and composes the view
 */
export function WeatherWidget({ variant = "compact" }: WeatherWidgetProps) {
    const controller = useWeatherWidget();

    if (variant === "compact") {
        return (
            <Popover>
                <PopoverTrigger asChild>
                    <CompactView
                        weatherData={controller.weatherData}
                        location={controller.location}
                    />
                </PopoverTrigger>
                <PopoverContent className="w-[480px] p-0" align="end" sideOffset={8}>
                    <DetailedView {...controller} />
                </PopoverContent>
            </Popover>
        );
    }

    return (
        <Card
            className="border-border rounded-2xl shadow-sm overflow-hidden"
            style={{
                background:
                    "linear-gradient(to bottom right, color-mix(in oklab, var(--secondary) 5%, transparent), var(--card), color-mix(in oklab, var(--accent) 5%, transparent))",
            }}
        >
            <DetailedView {...controller} />
        </Card>
    );
}



