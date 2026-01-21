import { useState, useEffect } from 'react';
import { MapPin, Navigation, X, Loader2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert } from './ui/alert';
import { BusLine, BusStop } from '../types/bus';

export interface UserLocation {
  latitude: number;
  longitude: number;
  name?: string;
}

interface LocationPickerProps {
  currentLocation: UserLocation | null;
  onLocationChange: (location: UserLocation | null) => void;
  busLines: BusLine[];
}

export function LocationPicker({ currentLocation, onLocationChange, busLines }: LocationPickerProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showManualPicker, setShowManualPicker] = useState(false);

  // Get all unique stops for manual selection
  const allStops: BusStop[] = [];
  const stopNames = new Set<string>();
  
  busLines.forEach(line => {
    line.stops.forEach(stop => {
      if (!stopNames.has(stop.name)) {
        stopNames.add(stop.name);
        allStops.push(stop);
      }
    });
  });

  allStops.sort((a, b) => a.name.localeCompare(b.name));

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          name: 'Current GPS Location',
        };
        onLocationChange(location);
        setIsGettingLocation(false);
      },
      (error) => {
        setIsGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please enable location access.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An error occurred while getting your location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const handleManualSelect = (stop: BusStop) => {
    const location: UserLocation = {
      latitude: stop.latitude,
      longitude: stop.longitude,
      name: stop.name,
    };
    onLocationChange(location);
    setShowManualPicker(false);
  };

  const handleClearLocation = () => {
    onLocationChange(null);
    setLocationError(null);
  };

  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            <h3 className="text-gray-900 dark:text-gray-100">Your Location</h3>
          </div>
          {currentLocation && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearLocation}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {currentLocation ? (
          <div className="space-y-3">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-green-600 dark:text-green-400" />
                <div className="flex-1">
                  <p className="text-sm text-green-900 dark:text-green-100">
                    {currentLocation.name || 'Custom Location'}
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
                  </p>
                </div>
                <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100">
                  Active
                </Badge>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Stops are now sorted by distance from your location
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Set your location to see nearby bus stops and get better recommendations
            </p>

            {locationError && (
              <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                <p className="text-sm text-red-900 dark:text-red-100">{locationError}</p>
              </Alert>
            )}

            <div className="flex flex-col gap-2">
              <Button
                onClick={handleUseGPS}
                disabled={isGettingLocation}
                className="w-full"
              >
                {isGettingLocation ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4 mr-2" />
                    Use My GPS Location
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowManualPicker(!showManualPicker)}
                className="w-full"
              >
                <MapPin className="w-4 h-4 mr-2" />
                {showManualPicker ? 'Hide' : 'Pick'} Location Manually
              </Button>
            </div>

            {showManualPicker && (
              <div className="mt-3 space-y-2 max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                <p className="text-xs text-gray-600 dark:text-gray-400 px-2 py-1">
                  Select a stop as your current location:
                </p>
                {allStops.map((stop) => (
                  <button
                    key={stop.id}
                    onClick={() => handleManualSelect(stop)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm text-gray-900 dark:text-gray-100"
                  >
                    {stop.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
