import React, { useRef, useEffect } from "react";
import {
    MapPin,
    Search,
    X,
    ChevronDown,
    RefreshCw,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { LocationSuggestion } from "../types";

interface LocationHeaderProps {
    location: string | null;
    isEditingLocation: boolean;
    tempLocation: string;
    isLoading: boolean;
    error: string | null;
    lastUpdated: string;
    locationSuggestions: LocationSuggestion[];
    isSearchingLocations: boolean;
    onTempLocationChange: (value: string) => void;
    onSetEditingLocation: (value: boolean) => void;
    onSaveLocation: (selectedLocation?: LocationSuggestion) => void;
    onCancelLocation: () => void;
    onRefresh: () => void;
    onErrorClear: () => void;
    onClearSuggestions: () => void;
}

/**
 * Location Header Component
 * Handles location display, editing, and refresh functionality with autocomplete
 */
export const LocationHeader = React.memo<LocationHeaderProps>(
    ({
        location,
        isEditingLocation,
        tempLocation,
        isLoading,
        error,
        lastUpdated,
        locationSuggestions,
        isSearchingLocations,
        onTempLocationChange,
        onSetEditingLocation,
        onSaveLocation,
        onCancelLocation,
        onRefresh,
        onErrorClear,
        onClearSuggestions,
    }) => {
        const [selectedIndex, setSelectedIndex] = React.useState(-1);
        const inputRef = useRef<HTMLInputElement>(null);
        const suggestionsRef = useRef<HTMLDivElement>(null);

        // Reset selected index when suggestions change
        useEffect(() => {
            setSelectedIndex(-1);
        }, [locationSuggestions]);

        // Handle click outside to close suggestions
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (
                    suggestionsRef.current &&
                    !suggestionsRef.current.contains(event.target as Node) &&
                    inputRef.current &&
                    !inputRef.current.contains(event.target as Node)
                ) {
                    onClearSuggestions();
                }
            };

            if (isEditingLocation && locationSuggestions.length > 0) {
                document.addEventListener("mousedown", handleClickOutside);
            }

            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [isEditingLocation, locationSuggestions, onClearSuggestions]);

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (locationSuggestions.length > 0) {
                if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                        prev < locationSuggestions.length - 1 ? prev + 1 : prev
                    );
                } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                } else if (e.key === "Enter") {
                    e.preventDefault();
                    if (selectedIndex >= 0) {
                        handleSelectLocation(locationSuggestions[selectedIndex]);
                    } else {
                        onSaveLocation();
                    }
                } else if (e.key === "Escape") {
                    onCancelLocation();
                }
            } else {
                if (e.key === "Enter") {
                    e.preventDefault();
                    onSaveLocation();
                } else if (e.key === "Escape") {
                    onCancelLocation();
                }
            }
        };

        const handleSelectLocation = (suggestion: LocationSuggestion) => {
            onTempLocationChange(suggestion.displayName);
            onSaveLocation(suggestion);
            onClearSuggestions();
        };

        return (
            <div
                className="px-4 py-3 relative"
                style={{
                    background:
                        "linear-gradient(to right, var(--secondary), color-mix(in oklab, var(--secondary) 80%, transparent))",
                }}
            >
                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2 flex-1 relative">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        {isEditingLocation ? (
                            <div className="flex items-center gap-2 flex-1 relative">
                                <div className="relative flex-1">
                                    <Input
                                        ref={inputRef}
                                        value={tempLocation}
                                        onChange={(e) => {
                                            onTempLocationChange(e.target.value);
                                            onErrorClear();
                                        }}
                                        className="h-7 text-sm bg-card/20 border-white/30 text-white placeholder:text-white/70 focus:bg-card/30"
                                        placeholder="Search location..."
                                        onKeyDown={handleKeyDown}
                                        disabled={isLoading}
                                        autoFocus
                                    />
                                    {/* Autocomplete Dropdown */}
                                    {(locationSuggestions.length > 0 || isSearchingLocations) && (
                                        <div
                                            ref={suggestionsRef}
                                            className="absolute top-full left-0 right-0 mt-1 bg-card rounded-md shadow-lg border border-border z-50 max-h-[200px] overflow-y-auto"
                                        >
                                            {isSearchingLocations ? (
                                                <div className="px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                    <span>Searching...</span>
                                                </div>
                                            ) : (
                                                locationSuggestions.map((suggestion, index) => (
                                                    <button
                                                        key={suggestion.id}
                                                        onClick={() => handleSelectLocation(suggestion)}
                                                        className={`w-full text-left px-3 py-2 text-sm hover:bg-secondary/10 transition-colors ${
                                                            index === selectedIndex
                                                                ? "bg-secondary/10"
                                                                : ""
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-foreground truncate">
                                                                    {suggestion.name}
                                                                </div>
                                                                <div className="text-[0.7rem] text-muted-foreground truncate">
                                                                    {suggestion.region && `${suggestion.region}, `}
                                                                    {suggestion.country}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 px-2 text-white hover:bg-card/20"
                                    onClick={() => onSaveLocation()}
                                    disabled={isLoading || !tempLocation.trim()}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <Search className="w-3.5 h-3.5" />
                                    )}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 px-2 text-white hover:bg-card/20"
                                    onClick={onCancelLocation}
                                    disabled={isLoading}
                                >
                                    <X className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        ) : (
                            <button
                                onClick={() => onSetEditingLocation(true)}
                                className="text-sm hover:underline flex items-center gap-1"
                                disabled={isLoading}
                            >
                                {location || "Select Location"}
                                <ChevronDown className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[0.65rem] opacity-90">{lastUpdated}</span>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-white hover:bg-card/20"
                            onClick={onRefresh}
                            disabled={isLoading}
                        >
                            <RefreshCw
                                className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
                            />
                        </Button>
                    </div>
                </div>
                {error && (
                    <div className="mt-2 text-xs text-white bg-destructive/10 px-2 py-1 rounded">
                        {error}
                    </div>
                )}
            </div>
        );
    }
);

LocationHeader.displayName = "LocationHeader";



