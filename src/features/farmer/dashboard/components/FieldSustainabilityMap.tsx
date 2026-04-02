import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { DashboardFieldMapItem, FdnAlertLevel } from '@/entities/dashboard';
import { FDN_LEVEL_COLORS } from '@/entities/dashboard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface FieldSustainabilityMapProps {
  items: DashboardFieldMapItem[];
  isLoading: boolean;
}

const GOOGLE_MAPS_SCRIPT_ID = 'google-maps-js';
let googleMapsPromise: Promise<void> | null = null;

function ensureGoogleMaps(apiKey: string): Promise<void> {
  if ((window as Window & { google?: unknown }).google) {
    return Promise.resolve();
  }
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Google Maps script')), {
        once: true,
      });
      return;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));
    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

function colorByLevel(level: FdnAlertLevel): string {
  return FDN_LEVEL_COLORS[level];
}

function formatPercent(value: number | null): string {
  if (value === null || !Number.isFinite(value)) {
    return '--';
  }
  return `${value.toFixed(2)}%`;
}

function formatInput(value: number | null): string {
  if (value === null || !Number.isFinite(value)) {
    return '--';
  }
  return value.toFixed(2);
}

function setBoundsByDataLayer(googleMaps: any, dataLayer: any, map: any) {
  const bounds = new googleMaps.maps.LatLngBounds();
  const extendGeometry = (geometry: any) => {
    if (!geometry) {
      return;
    }
    const type = geometry.getType();
    if (type === 'Point') {
      bounds.extend(geometry.get());
      return;
    }
    geometry.getArray().forEach((item: any) => extendGeometry(item));
  };

  dataLayer.forEach((feature: any) => {
    extendGeometry(feature.getGeometry());
  });

  if (!bounds.isEmpty()) {
    map.fitBounds(bounds, 48);
  }
}

export function FieldSustainabilityMap({ items, isLoading }: FieldSustainabilityMapProps) {
  const { t } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const dataLayerRef = useRef<any>(null);

  const [googleError, setGoogleError] = useState<string | null>(null);
  const [selectedFarm, setSelectedFarm] = useState<string>('all');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedFieldId, setSelectedFieldId] = useState<number | null>(null);

  const farmOptions = useMemo(() => {
    const optionMap = new Map<string, string>();
    items.forEach((item) => {
      if (item.farmId !== null) {
        optionMap.set(
          String(item.farmId),
          item.farmName ??
            t('dashboard.fdn.map.farmFallback', {
              defaultValue: 'Farm {{id}}',
              id: item.farmId,
            })
        );
      }
    });
    return [...optionMap.entries()].map(([value, label]) => ({ value, label }));
  }, [items, t]);

  const cropOptions = useMemo(() => {
    const values = new Set<string>();
    items.forEach((item) => {
      if (item.cropName) {
        values.add(item.cropName);
      }
    });
    return [...values];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedFarm !== 'all' && String(item.farmId ?? '') !== selectedFarm) {
        return false;
      }
      if (selectedCrop !== 'all' && item.cropName !== selectedCrop) {
        return false;
      }
      if (selectedLevel !== 'all' && item.fdnLevel !== selectedLevel) {
        return false;
      }
      return true;
    });
  }, [items, selectedFarm, selectedCrop, selectedLevel]);

  useEffect(() => {
    if (!filteredItems.length) {
      setSelectedFieldId(null);
      return;
    }
    if (!filteredItems.some((item) => item.fieldId === selectedFieldId)) {
      setSelectedFieldId(filteredItems[0].fieldId);
    }
  }, [filteredItems, selectedFieldId]);

  useEffect(() => {
    if (!mapContainerRef.current) {
      return;
    }
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setGoogleError(
        t('dashboard.fdn.map.missingKey', {
          defaultValue: 'Missing VITE_GOOGLE_MAPS_API_KEY.',
        })
      );
      return;
    }

    ensureGoogleMaps(apiKey)
      .then(() => {
        const googleMaps = (window as Window & { google?: any }).google;
        if (!googleMaps || !mapContainerRef.current) {
          setGoogleError(
            t('dashboard.fdn.map.unavailable', {
              defaultValue: 'Google Maps is unavailable.',
            })
          );
          return;
        }
        if (!mapRef.current) {
          mapRef.current = new googleMaps.maps.Map(mapContainerRef.current, {
            center: { lat: 16.0471, lng: 108.2062 },
            zoom: 6,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
          });

          dataLayerRef.current = new googleMaps.maps.Data({ map: mapRef.current });
          dataLayerRef.current.setStyle((feature: any) => {
            const level = feature.getProperty('fdnLevel') as FdnAlertLevel;
            return {
              fillColor: colorByLevel(level),
              fillOpacity: 0.35,
              strokeColor: colorByLevel(level),
              strokeWeight: 2,
            };
          });

          dataLayerRef.current.addListener('click', (event: any) => {
            const fieldId = Number(event.feature.getProperty('fieldId'));
            if (!Number.isNaN(fieldId)) {
              setSelectedFieldId(fieldId);
            }
          });
        }
        setGoogleError(null);
      })
      .catch((error: Error) => {
        setGoogleError(error.message);
      });
  }, [t]);

  useEffect(() => {
    const googleMaps = (window as Window & { google?: any }).google;
    if (!googleMaps || !mapRef.current || !dataLayerRef.current) {
      return;
    }

    const dataLayer = dataLayerRef.current;
    const toRemove: any[] = [];
    dataLayer.forEach((feature: any) => {
      toRemove.push(feature);
    });
    toRemove.forEach((feature) => dataLayer.remove(feature));

    const features = filteredItems
      .filter((item) => item.geometry)
      .map((item) => ({
        type: 'Feature' as const,
        geometry: item.geometry,
        properties: {
          fieldId: item.fieldId,
          fdnLevel: item.fdnLevel,
        },
      }));

    if (features.length > 0) {
      dataLayer.addGeoJson({
        type: 'FeatureCollection',
        features,
      });
      setBoundsByDataLayer(googleMaps, dataLayer, mapRef.current);
    }
  }, [filteredItems]);

  const selectedItem = filteredItems.find((item) => item.fieldId === selectedFieldId) ?? null;
  const missingGeometryCount = filteredItems.filter((item) => !item.geometry).length;
  const hasRenderableGeometry = filteredItems.some((item) => item.geometry);
  const mapUnavailableReason = googleError
    ? googleError
    : !hasRenderableGeometry
      ? t('dashboard.fdn.map.noGeometryForFilters', {
          defaultValue: 'No field geometry available for current filters.',
        })
      : null;

  if (isLoading) {
    return (
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>
            {t('dashboard.fdn.map.title', { defaultValue: 'Field Sustainability Map' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[420px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="space-y-3">
        <CardTitle>
          {t('dashboard.fdn.map.title', { defaultValue: 'Field Sustainability Map' })}
        </CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Select value={selectedFarm} onValueChange={setSelectedFarm}>
            <SelectTrigger>
              <SelectValue
                placeholder={t('dashboard.fdn.map.filterFarm', {
                  defaultValue: 'Filter farm',
                })}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t('dashboard.fdn.map.allFarms', { defaultValue: 'All farms' })}
              </SelectItem>
              {farmOptions.map((farm) => (
                <SelectItem key={farm.value} value={farm.value}>
                  {farm.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger>
              <SelectValue
                placeholder={t('dashboard.fdn.map.filterCrop', {
                  defaultValue: 'Filter crop',
                })}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t('dashboard.fdn.map.allCrops', { defaultValue: 'All crops' })}
              </SelectItem>
              {cropOptions.map((crop) => (
                <SelectItem key={crop} value={crop}>
                  {crop}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger>
              <SelectValue
                placeholder={t('dashboard.fdn.map.filterAlert', {
                  defaultValue: 'Filter alert level',
                })}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t('dashboard.fdn.map.allLevels', { defaultValue: 'All alert levels' })}
              </SelectItem>
              <SelectItem value="low">
                {t('dashboard.fdn.map.low', { defaultValue: 'Low' })}
              </SelectItem>
              <SelectItem value="medium">
                {t('dashboard.fdn.map.medium', { defaultValue: 'Medium' })}
              </SelectItem>
              <SelectItem value="high">
                {t('dashboard.fdn.map.high', { defaultValue: 'High' })}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: colorByLevel('low') }} />
            <span>{t('dashboard.fdn.map.low', { defaultValue: 'Low' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: colorByLevel('medium') }} />
            <span>{t('dashboard.fdn.map.medium', { defaultValue: 'Medium' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: colorByLevel('high') }} />
            <span>{t('dashboard.fdn.map.high', { defaultValue: 'High' })}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr] gap-4">
          <div className="rounded-lg border border-border overflow-hidden">
            {mapUnavailableReason ? (
              <div className="h-[420px] p-4 bg-muted/20 flex flex-col gap-3 overflow-auto">
                <p className="text-sm text-foreground font-medium">
                  {t('dashboard.fdn.map.fallbackTitle', {
                    defaultValue: 'Map is currently unavailable',
                  })}
                </p>
                <p className="text-sm text-muted-foreground">{mapUnavailableReason}</p>
                <p className="text-xs text-muted-foreground">
                  {t('dashboard.fdn.map.fallbackHint', {
                    defaultValue:
                      'You can still review field sustainability in list view and add missing boundaries from farm management.',
                  })}
                </p>
                <Link
                  to="/farmer/farms"
                  className="inline-flex w-fit rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted"
                >
                  {t('dashboard.fdn.map.manageFieldsCta', {
                    defaultValue: 'Go to Farms & Plots',
                  })}
                </Link>
                <div className="rounded-md border border-border bg-background p-3">
                  <p className="text-xs font-medium mb-2">
                    {t('dashboard.fdn.map.listFallbackTitle', {
                      defaultValue: 'Field list fallback',
                    })}
                  </p>
                  {filteredItems.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      {t('dashboard.fdn.map.noFieldMatch', {
                        defaultValue: 'No field matches current filters.',
                      })}
                    </p>
                  ) : (
                    <ul className="space-y-2 text-xs">
                      {filteredItems.map((item) => (
                        <li key={item.fieldId} className="flex items-center justify-between gap-2">
                          <span className="text-foreground">{item.fieldName}</span>
                          <span className="text-muted-foreground">
                            {formatPercent(item.fdnTotal)} | {item.fdnLevel}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ) : (
              <div ref={mapContainerRef} className="h-[420px] w-full" />
            )}
          </div>

          <div className="rounded-lg border border-border p-4 space-y-3">
            {selectedItem ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('dashboard.fdn.map.field', { defaultValue: 'Field' })}
                  </p>
                  <p className="font-semibold">{selectedItem.fieldName}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedItem.farmName ?? 'N/A'} | {selectedItem.cropName} | {selectedItem.seasonName}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>{t('dashboard.fdn.map.fdnTotal', { defaultValue: 'FDN total' })}</div>
                  <div className="font-medium">{formatPercent(selectedItem.fdnTotal)}</div>
                  <div>{t('dashboard.fdn.map.fdnMineral', { defaultValue: 'FDN mineral' })}</div>
                  <div className="font-medium">{formatPercent(selectedItem.fdnMineral)}</div>
                  <div>{t('dashboard.fdn.map.fdnOrganic', { defaultValue: 'FDN organic' })}</div>
                  <div className="font-medium">{formatPercent(selectedItem.fdnOrganic)}</div>
                  <div>{t('dashboard.fdn.map.nue', { defaultValue: 'NUE' })}</div>
                  <div className="font-medium">{formatPercent(selectedItem.nue)}</div>
                  <div>{t('dashboard.fdn.map.confidence', { defaultValue: 'Confidence' })}</div>
                  <div className="font-medium">
                    {selectedItem.confidence !== null && Number.isFinite(selectedItem.confidence)
                      ? `${Math.round(selectedItem.confidence * 100)}%`
                      : '--'}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {t('dashboard.fdn.map.inputBreakdown', { defaultValue: 'N input breakdown' })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Mineral {formatInput(selectedItem.inputsBreakdown.mineralFertilizerN)} | Organic{' '}
                    {formatInput(selectedItem.inputsBreakdown.organicFertilizerN)} | Irrigation{' '}
                    {formatInput(selectedItem.inputsBreakdown.irrigationWaterN)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {t('dashboard.fdn.map.assistant', {
                      defaultValue: 'Assistant recommendations',
                    })}
                  </p>
                  {selectedItem.recommendations.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      {t('dashboard.fdn.map.noRecommendation', {
                        defaultValue: 'No recommendation available.',
                      })}
                    </p>
                  ) : (
                    <ul className="space-y-1">
                      {selectedItem.recommendations.slice(0, 4).map((item, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground">
                          - {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t('dashboard.fdn.map.noFieldMatch', {
                  defaultValue: 'No field matches current filters.',
                })}
              </p>
            )}
          </div>
        </div>

        {missingGeometryCount > 0 && (
          <p className="text-xs text-amber-700">
            {t('dashboard.fdn.map.missingGeometry', {
              defaultValue:
                '{{count}} field(s) do not have boundary geometry yet and cannot be rendered on the map.',
              count: missingGeometryCount,
            })}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
