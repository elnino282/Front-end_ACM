# Weather Widget - API Integration

This weather widget integrates with [WeatherAPI.com](https://www.weatherapi.com/) to provide real-time weather data for farmers.

## Features

### ✅ Implemented
- **Location Autocomplete**: Search and select locations with real-time suggestions
- **Current Weather**: Temperature, feels like, conditions, wind, humidity, etc.
- **3-Day Forecast**: Tomorrow and 2 days ahead with high/low temps and precipitation
- **Agricultural Alerts**: Automatic alerts for heat stress, frost, wind, and rain based on weather conditions
- **Spray Conditions**: Intelligent calculation of optimal spraying conditions
- **UV Index**: Color-coded UV index with protection recommendations

### 🔧 API Integration

#### Search API (Autocomplete)
- **Endpoint**: `https://api.weatherapi.com/v1/search.json`
- **Purpose**: Provides location suggestions as user types
- **Debounce**: 300ms to prevent excessive API calls
- **Response**: List of locations with name, region, country, and coordinates

#### Forecast API
- **Endpoint**: `https://api.weatherapi.com/v1/forecast.json`
- **Purpose**: Fetches current weather + multi-day forecast
- **Days**: 4 days (today + 3 forecast days)
- **Response**: Complete weather data including current conditions, forecast, and astronomical data

## Usage

### Compact Variant (with Popover)
```tsx
import { WeatherWidget } from "@/features/farmer/weather-widget";

function MyComponent() {
  return <WeatherWidget variant="compact" />;
}
```

### Detailed Variant (Full Card)
```tsx
import { WeatherWidget } from "@/features/farmer/weather-widget";

function MyComponent() {
  return <WeatherWidget variant="detailed" />;
}
```

## How to Use

1. **Initial Load**: Widget automatically loads weather data for "Vietnam" on first render
2. **Change Location**: Click on location name to open search input
3. **Search Location**: 
   - Type city name (e.g., "Ho Chi Minh", "Hanoi", "Da Nang")
   - Autocomplete suggestions appear as you type (with 300ms debounce)
   - Click on a suggestion or press Enter to select
4. **View Weather**: Weather data loads automatically for selected location
5. **Refresh**: Click refresh icon (🔄) to update weather data
6. **Cancel**: Press Escape or click X to cancel location editing

## Architecture

### Directory Structure
```
weather-widget/
├── services/
│   └── weatherApi.ts          # API calls to WeatherAPI.com
├── utils/
│   └── weatherMapper.ts       # Transform API responses to internal format
├── hooks/
│   └── useWeatherWidget.tsx   # Business logic and state management
├── components/
│   ├── LocationHeader.tsx     # Location search with autocomplete
│   ├── CompactView.tsx        # Minimal weather display
│   ├── DetailedView.tsx       # Full weather information
│   ├── CurrentWeather.tsx     # Current conditions
│   ├── ForecastBar.tsx        # 3-day forecast
│   ├── FieldConditions.tsx    # Spray conditions
│   ├── WeatherDetails.tsx     # Wind, humidity, UV, etc.
│   ├── AdditionalInfo.tsx     # Sunrise, sunset, pressure
│   ├── AgriAlerts.tsx         # Agricultural alerts
│   └── ...
├── types.ts                   # TypeScript interfaces
├── constants.ts               # Configuration and thresholds
└── index.tsx                  # Main entry point
```

### Data Flow
```
User Input → Search API → Suggestions Dropdown
  ↓
User Selects Location → Forecast API → Weather Data
  ↓
Transform & Calculate → Display Components
```

## Configuration

API configuration in `constants.ts`:

```typescript
export const API_CONFIG = {
    WEATHER_API_KEY: "7ad902a7acdf44d791675824251212",
    WEATHER_API_BASE_URL: "https://api.weatherapi.com/v1",
    DEFAULT_LOCATION: "My Farm Location",
    AUTOCOMPLETE_DEBOUNCE_MS: 300,
    FORECAST_DAYS: 4,
} as const;
```

## Removed Features

- **Soil Moisture**: Not available from Weather API (removed from UI)
  - Consider integrating IoT sensors or alternative data sources if needed

## Agricultural Intelligence

The widget automatically generates farming-specific alerts:

- **Heat Stress**: When temp > 30°C (high severity > 35°C)
- **Frost Warning**: When low temp < 5°C (high severity < 0°C)
- **Wind Warning**: When wind speed > 15 km/h (high severity > 25 km/h)
- **Spray Conditions**: Good when 5-15 km/h wind, 50-70% humidity, temp < 30°C
- **Heavy Rain**: When precipitation > 10mm (high severity > 50mm)

## Error Handling

- Network failures show user-friendly error messages
- Invalid locations are caught and reported
- Empty search queries are handled gracefully
- Loading states for all async operations

## Future Enhancements

- [ ] Hourly forecast (available in API)
- [ ] Historical weather data
- [ ] Weather radar/maps
- [ ] Push notifications for severe weather
- [ ] Soil moisture from IoT sensors
- [ ] Crop-specific recommendations
- [ ] Weather data caching with React Query

