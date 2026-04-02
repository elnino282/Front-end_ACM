import React, { useCallback, useMemo } from "react";
import { CardContent } from "@/components/ui/card";
import { LocationHeader } from "./LocationHeader";
import { ForecastBar } from "./ForecastBar";
import { CurrentWeather } from "./CurrentWeather";
import { AgriAlerts } from "./AgriAlerts";
import { FieldConditions } from "./FieldConditions";
import { WeatherDetails } from "./WeatherDetails";
import { AdditionalInfo } from "./AdditionalInfo";
import { FarmingRecommendation } from "./FarmingRecommendation";
import { LoadingSkeleton } from "./LoadingSkeleton";
import type { UseWeatherWidgetReturn } from "../types";

type DetailedViewProps = UseWeatherWidgetReturn;

export const DetailedView = React.memo<DetailedViewProps>((props) => {
    const {
        weatherData,
        forecast,
        agriAlerts,
        location,
        isEditingLocation,
        tempLocation,
        isLoading,
        error,
        locationSuggestions,
        isSearchingLocations,
        setTempLocation,
        setIsEditingLocation,
        handleSaveLocation,
        handleCancelLocation,
        handleRefresh,
        setError,
        getUVIndexColor,
        getUVIndexLabel,
        getSprayConditions,
        clearLocationSuggestions,
        getAlertIcon,
        getAlertColor,
    } = props;

    const handleTempLocationChange = useCallback(
        (value: string) => setTempLocation(value),
        [setTempLocation]
    );

    const handleErrorClear = useCallback(() => setError(null), [setError]);

    const sprayConditions = useMemo(() => getSprayConditions(), [getSprayConditions]);

    // Don't render weather content if no data available
    if (!weatherData && !isLoading) {
        return (
            <CardContent className="p-0">
                <LocationHeader
                    location={location}
                    isEditingLocation={isEditingLocation}
                    tempLocation={tempLocation}
                    isLoading={isLoading}
                    error={error}
                    lastUpdated="Not loaded"
                    locationSuggestions={locationSuggestions}
                    isSearchingLocations={isSearchingLocations}
                    onTempLocationChange={handleTempLocationChange}
                    onSetEditingLocation={setIsEditingLocation}
                    onSaveLocation={handleSaveLocation}
                    onCancelLocation={handleCancelLocation}
                    onRefresh={handleRefresh}
                    onErrorClear={handleErrorClear}
                    onClearSuggestions={clearLocationSuggestions}
                />
                <div className="p-6 text-center space-y-3">
                    <p className="text-sm text-muted-foreground font-medium">
                        Welcome! Set your location to view weather data
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Click the location name above to search and select your area
                    </p>
                </div>
            </CardContent>
        );
    }

    return (
        <CardContent className="p-0">
            <LocationHeader
                location={location}
                isEditingLocation={isEditingLocation}
                tempLocation={tempLocation}
                isLoading={isLoading}
                error={error}
                lastUpdated={weatherData?.lastUpdated || "Not loaded"}
                locationSuggestions={locationSuggestions}
                isSearchingLocations={isSearchingLocations}
                onTempLocationChange={handleTempLocationChange}
                onSetEditingLocation={setIsEditingLocation}
                onSaveLocation={handleSaveLocation}
                onCancelLocation={handleCancelLocation}
                onRefresh={handleRefresh}
                onErrorClear={handleErrorClear}
                onClearSuggestions={clearLocationSuggestions}
            />

            {isLoading ? (
                <LoadingSkeleton />
            ) : weatherData ? (
                <>
                    <ForecastBar forecast={forecast} />
                    <div className="p-5">
                        <CurrentWeather weatherData={weatherData} />
                        <AgriAlerts
                            agriAlerts={agriAlerts}
                            getAlertIcon={getAlertIcon}
                            getAlertColor={getAlertColor}
                        />
                        <FieldConditions sprayConditions={sprayConditions} />
                        <WeatherDetails
                            weatherData={weatherData}
                            getUVIndexColor={getUVIndexColor}
                            getUVIndexLabel={getUVIndexLabel}
                        />
                        <AdditionalInfo weatherData={weatherData} />
                        <FarmingRecommendation />
                    </div>
                </>
            ) : null}
        </CardContent>
    );
});

DetailedView.displayName = "DetailedView";



