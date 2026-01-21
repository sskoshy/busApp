import { BusLine, BusLocation } from '../types/bus';
import { Bus, MapPin, Clock, AlertTriangle, Users } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface BusTrackerProps {
  line: BusLine;
  busLocation?: BusLocation;
}

export function BusTracker({ line, busLocation }: BusTrackerProps) {
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

  const currentStopIndex = busLocation?.currentStopIndex ?? 0;
  const progressPercent = (currentStopIndex / (line.stops.length - 1)) * 100;

  return (
    <div className="space-y-4">
      <Card>
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div
                className={`w-16 h-16 rounded-lg border-2 border-gray-800 dark:border-gray-200 ${getPatternClass(line.pattern)}`}
                style={{ color: line.color }}
              />
              <Bus className="absolute inset-0 m-auto w-8 h-8 text-gray-900 dark:text-gray-100" />
            </div>
            <div>
              <h2 className="text-gray-900 dark:text-gray-100">{line.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">Active Route</p>
            </div>
          </div>

          {busLocation && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-gray-100">
                  Next stop in {busLocation.nextStopETA} minutes
                  {busLocation.isDelayed && (
                    <Badge className="ml-2 bg-orange-500">
                      +{busLocation.delayMinutes} min delay
                    </Badge>
                  )}
                </span>
              </div>
              {busLocation.isDelayed && (
                <div className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-950 rounded-lg border-2 border-orange-500 dark:border-orange-600">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    This bus is running {busLocation.delayMinutes} minute{busLocation.delayMinutes > 1 ? 's' : ''} behind schedule
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-700">
                <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-900 dark:text-gray-100">Bus Capacity</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {busLocation.capacityPercent}%
                    </span>
                  </div>
                  <Progress value={busLocation.capacityPercent} className="h-2" />
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {busLocation.capacityPercent < 50 ? 'Plenty of space' :
                     busLocation.capacityPercent < 75 ? 'Moderate crowd' :
                     busLocation.capacityPercent < 90 ? 'Getting full' : 'Very full'}
                  </span>
                </div>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <h3 className="text-gray-900 dark:text-gray-100 mb-4">Route Stops</h3>
          <div className="space-y-3">
            {line.stops.map((stop, index) => {
              const isCurrent = busLocation && index === currentStopIndex;
              const isPassed = busLocation && index < currentStopIndex;
              const isNext = busLocation && index === currentStopIndex + 1;

              return (
                <div
                  key={stop.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${
                    isCurrent
                      ? 'bg-blue-50 dark:bg-blue-950 border-blue-500 dark:border-blue-600'
                      : isNext
                      ? 'bg-yellow-50 dark:bg-yellow-950 border-yellow-500 dark:border-yellow-600'
                      : isPassed
                      ? 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 opacity-60'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="relative flex-shrink-0 mt-1">
                    {isCurrent ? (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                        <Bus className="w-4 h-4 text-white" />
                      </div>
                    ) : isPassed ? (
                      <div className="w-6 h-6 bg-gray-400 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-white dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-gray-900 dark:text-gray-100">{stop.name}</span>
                      {isCurrent && (
                        <Badge className="bg-blue-500">
                          Current Location
                        </Badge>
                      )}
                      {isNext && (
                        <Badge className="bg-yellow-500">
                          Next Stop - {busLocation.nextStopETA} min
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-3 h-3" />
                      <span className="text-sm">
                        Stop {index + 1} of {line.stops.length}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
