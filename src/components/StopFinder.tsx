import { useState, useMemo } from 'react';
import { BusLine, BusStop } from '../types/bus';
import { MapPin, Bus, Search, Navigation } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { UserLocation } from './LocationPicker';
import { calculateDistance, formatDistance } from '../utils/location';

interface StopFinderProps {
  busLines: BusLine[];
  onSelectLine: (line: BusLine, stop: BusStop) => void;
  userLocation?: UserLocation | null;
}

interface StopWithLines {
  stop: BusStop;
  lines: Array<{ line: BusLine; stopOrder: number }>;
  distance?: number;
}

export function StopFinder({ busLines, onSelectLine, userLocation }: StopFinderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStop, setSelectedStop] = useState<StopWithLines | null>(null);

  // Get all unique stops across all bus lines
  const allStops = useMemo(() => {
    const stopMap = new Map<string, StopWithLines>();

    busLines.forEach((line) => {
      line.stops.forEach((stop) => {
        const existing = stopMap.get(stop.name);
        if (existing) {
          // Add this line to the existing stop
          existing.lines.push({ line, stopOrder: stop.order });
        } else {
          // Create a new stop entry with distance if location available
          const distance = userLocation
            ? calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                stop.latitude,
                stop.longitude
              )
            : undefined;

          stopMap.set(stop.name, {
            stop,
            lines: [{ line, stopOrder: stop.order }],
            distance,
          });
        }
      });
    });

    const stops = Array.from(stopMap.values());

    // Sort by distance if location is available, otherwise alphabetically
    return stops.sort((a, b) => {
      if (userLocation && a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      return a.stop.name.localeCompare(b.stop.name);
    });
  }, [busLines, userLocation]);

  // Filter stops based on search query
  const filteredStops = useMemo(() => {
    if (!searchQuery.trim()) return allStops;
    const query = searchQuery.toLowerCase();
    return allStops.filter((stopWithLines) =>
      stopWithLines.stop.name.toLowerCase().includes(query)
    );
  }, [allStops, searchQuery]);

  const getPatternClass = (pattern: string) => {
    switch (pattern) {
      case 'dots':
        return 'bg-[radial-gradient(circle,_currentColor_1px,_transparent_1px)] bg-[length:8px_8px]';
      case 'stripes':
        return 'bg-[repeating-linear-gradient(45deg,_currentColor,_currentColor_2px,_transparent_2px,_transparent_8px)]';
      case 'grid':
        return 'bg-[linear-gradient(currentColor_1px,_transparent_1px),_linear-gradient(90deg,_currentColor_1px,_transparent_1px)] bg-[length:10px_10px]';
      case 'waves':
        return 'bg-[repeating-linear-gradient(0deg,_currentColor_0px,_currentColor_2px,_transparent_2px,_transparent_6px)]';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-gray-900 dark:text-gray-100">Find by Destination</h2>
            {userLocation && (
              <Badge variant="secondary" className="gap-1">
                <Navigation className="w-3 h-3" />
                Sorted by distance
              </Badge>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {userLocation
              ? 'Stops are sorted by distance from your location'
              : 'Search for your destination to see which bus lines serve that stop'}
          </p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for a stop (e.g., Silo, Memorial Union)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      {selectedStop ? (
        <div className="space-y-4">
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <MapPin className="w-6 h-6 text-blue-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-gray-900 dark:text-gray-100">{selectedStop.stop.name}</h3>
                      {selectedStop.distance !== undefined && (
                        <Badge variant="outline" className="gap-1">
                          <Navigation className="w-3 h-3" />
                          {formatDistance(selectedStop.distance)}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Served by {selectedStop.lines.length} line{selectedStop.lines.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStop(null)}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  ← Back to all stops
                </button>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <h3 className="text-gray-900 dark:text-gray-100 mb-3">Available Bus Lines</h3>
              <div className="space-y-3">
                {selectedStop.lines
                  .sort((a, b) => a.line.name.localeCompare(b.line.name))
                  .map(({ line, stopOrder }) => (
                    <div
                      key={line.id}
                      onClick={() => onSelectLine(line, selectedStop.stop)}
                      className="cursor-pointer transition-all hover:shadow-lg p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div
                            className={`w-12 h-12 rounded-lg border-2 border-gray-800 dark:border-gray-200 ${getPatternClass(
                              line.pattern
                            )}`}
                            style={{ color: line.color }}
                          />
                          <Bus className="absolute inset-0 m-auto w-6 h-6 text-gray-900 dark:text-gray-100" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-gray-900 dark:text-gray-100">{line.name}</h4>
                            <Badge variant="outline">
                              Stop {stopOrder} of {line.stops.length}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {line.stops.length} total stops
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredStops.length === 0 ? (
            <Card>
              <div className="p-8 text-center">
                <MapPin className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-gray-900 dark:text-gray-100 mb-2">No stops found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try a different search term
                </p>
              </div>
            </Card>
          ) : (
            filteredStops.map((stopWithLines, index) => (
              <Card
                key={stopWithLines.stop.name}
                onClick={() => setSelectedStop(stopWithLines)}
                className={`cursor-pointer transition-all hover:shadow-lg hover:ring-2 hover:ring-blue-500 ${
                  index === 0 && userLocation && !searchQuery ? 'ring-2 ring-green-500 dark:ring-green-400' : ''
                }`}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <MapPin className={`w-6 h-6 ${index === 0 && userLocation && !searchQuery ? 'text-green-500' : 'text-blue-500'}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-gray-900 dark:text-gray-100">{stopWithLines.stop.name}</h3>
                          {index === 0 && userLocation && !searchQuery && (
                            <Badge className="bg-green-500 dark:bg-green-600 text-white gap-1">
                              <Navigation className="w-3 h-3" />
                              Nearest
                            </Badge>
                          )}
                          {stopWithLines.distance !== undefined && (
                            <Badge variant="outline" className="gap-1">
                              <Navigation className="w-3 h-3" />
                              {formatDistance(stopWithLines.distance)}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {stopWithLines.lines.length} bus line{stopWithLines.lines.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {stopWithLines.lines.slice(0, 3).map(({ line }) => (
                        <div
                          key={line.id}
                          className={`w-8 h-8 rounded border-2 border-gray-800 dark:border-gray-200 ${getPatternClass(
                            line.pattern
                          )}`}
                          style={{ color: line.color }}
                          title={line.name}
                        />
                      ))}
                      {stopWithLines.lines.length > 3 && (
                        <Badge variant="secondary">+{stopWithLines.lines.length - 3}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
