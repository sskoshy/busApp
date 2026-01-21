import { useState, useEffect } from 'react';
import { Bus, MapPin, ArrowUpDown, Calendar, Clock, Users, AlertTriangle, ChevronRight } from 'lucide-react';
import { BusLine, BusLocation, BusStop } from '../types/bus';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface HomePageProps {
  busLines: BusLine[];
  busLocations: BusLocation[];
  onSelectLine: (line: BusLine) => void;
  onNavigateToStops: () => void;
}

export function HomePage({ busLines, busLocations, onSelectLine, onNavigateToStops }: HomePageProps) {
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName') || 'Aggie';
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [fromStop, setFromStop] = useState<string>('');
  const [toStop, setToStop] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<'today' | 'tomorrow' | 'other'>('today');

  // Get all unique stops from all lines
  const allStops = busLines.reduce<BusStop[]>((acc, line) => {
    line.stops.forEach(stop => {
      if (!acc.find(s => s.id === stop.id)) {
        acc.push(stop);
      }
    });
    return acc;
  }, []).sort((a, b) => a.name.localeCompare(b.name));

  // Get active buses with their current info
  const activeBuses = busLocations.map(location => {
    const line = busLines.find(l => l.id === location.lineId);
    if (!line) return null;
    const currentStop = line.stops[location.currentStopIndex];
    const nextStopIndex = (location.currentStopIndex + 1) % line.stops.length;
    const nextStop = line.stops[nextStopIndex];
    return {
      location,
      line,
      currentStop,
      nextStop,
    };
  }).filter(Boolean);

  const handleSaveName = () => {
    const trimmedName = tempName.trim() || 'Aggie';
    setUserName(trimmedName);
    localStorage.setItem('userName', trimmedName);
    setIsEditingName(false);
  };

  const handleSwapStops = () => {
    const temp = fromStop;
    setFromStop(toStop);
    setToStop(temp);
  };

  const handleFindBuses = () => {
    if (fromStop && toStop) {
      // Find lines that have both stops
      const matchingLines = busLines.filter(line => {
        const hasFrom = line.stops.some(s => s.id === fromStop);
        const hasTo = line.stops.some(s => s.id === toStop);
        return hasFrom && hasTo;
      });

      if (matchingLines.length > 0) {
        // For now, select the first matching line
        onSelectLine(matchingLines[0]);
      } else {
        // Navigate to stops tab to explore
        onNavigateToStops();
      }
    } else {
      onNavigateToStops();
    }
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  return (
    <div className="space-y-6">
      {/* Greeting Header */}
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 border-0 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />
        
        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <Dialog open={isEditingName} onOpenChange={setIsEditingName}>
              <DialogTrigger asChild>
                <button className="text-left">
                  <h2 className="text-white text-2xl">Hey {userName}!</h2>
                  <p className="text-blue-100">Ready to ride this {getTimeOfDay()}?</p>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Your Name</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="Enter your name"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveName();
                      }}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsEditingName(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveName}>
                      Save
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Bus className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Illustrated bus icon */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
              <Bus className="w-12 h-12 text-blue-600" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Route Finder Card */}
      <Card className="bg-gradient-to-br from-amber-400 to-amber-500 dark:from-amber-500 dark:to-amber-600 border-0 p-6">
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-3">
            {/* From Stop */}
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">
                Boarding From
              </label>
              <Select value={fromStop} onValueChange={setFromStop}>
                <SelectTrigger className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Select your starting stop" />
                </SelectTrigger>
                <SelectContent>
                  {allStops.map(stop => (
                    <SelectItem key={stop.id} value={stop.id}>
                      {stop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center -my-2">
              <button
                onClick={handleSwapStops}
                className="w-10 h-10 rounded-full bg-amber-500 dark:bg-amber-600 hover:bg-amber-600 dark:hover:bg-amber-700 flex items-center justify-center shadow-lg transition-all hover:scale-110 z-10"
                aria-label="Swap stops"
              >
                <ArrowUpDown className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* To Stop */}
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">
                Where are you going?
              </label>
              <Select value={toStop} onValueChange={setToStop}>
                <SelectTrigger className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Select your destination" />
                </SelectTrigger>
                <SelectContent>
                  {allStops.map(stop => (
                    <SelectItem key={stop.id} value={stop.id}>
                      {stop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Selection */}
          <div className="flex gap-2">
            <Button
              variant={selectedDate === 'today' ? 'default' : 'outline'}
              className={selectedDate === 'today' 
                ? 'flex-1 bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-500 hover:bg-gray-50 dark:hover:bg-gray-700' 
                : 'flex-1 bg-white/50 dark:bg-gray-800/50 border-white dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
              }
              onClick={() => setSelectedDate('today')}
            >
              <Clock className="w-4 h-4 mr-1" />
              Today
            </Button>
            <Button
              variant={selectedDate === 'tomorrow' ? 'default' : 'outline'}
              className={selectedDate === 'tomorrow' 
                ? 'flex-1 bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-500 hover:bg-gray-50 dark:hover:bg-gray-700' 
                : 'flex-1 bg-white/50 dark:bg-gray-800/50 border-white dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
              }
              onClick={() => setSelectedDate('tomorrow')}
            >
              Tomorrow
            </Button>
            <Button
              variant={selectedDate === 'other' ? 'default' : 'outline'}
              className={selectedDate === 'other' 
                ? 'flex-1 bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-500 hover:bg-gray-50 dark:hover:bg-gray-700' 
                : 'flex-1 bg-white/50 dark:bg-gray-800/50 border-white dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
              }
              onClick={() => setSelectedDate('other')}
            >
              <Calendar className="w-4 h-4 mr-1" />
              Other
            </Button>
          </div>

          {/* Find Buses Button */}
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 shadow-lg h-14 text-lg"
            onClick={handleFindBuses}
          >
            Find Buses
          </Button>
        </div>
      </Card>

      {/* Upcoming Buses */}
      <div>
        <h3 className="text-gray-900 dark:text-gray-100 mb-3 px-1">Buses Running Now</h3>
        
        {activeBuses.length === 0 ? (
          <Card className="p-8 text-center">
            <Bus className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No active buses at the moment</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {activeBuses.map((bus) => {
              if (!bus) return null;
              const { location, line, currentStop, nextStop } = bus;
              
              return (
                <Card
                  key={location.busId}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-2"
                  onClick={() => onSelectLine(line)}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Line indicator with pattern */}
                      <div className="flex-shrink-0">
                        <div
                          className="w-16 h-16 rounded-lg flex items-center justify-center border-2 relative overflow-hidden"
                          style={{ borderColor: line.color }}
                        >
                          {/* Pattern Background */}
                          <div
                            className="absolute inset-0 opacity-20"
                            style={{
                              backgroundColor: line.color,
                              backgroundImage:
                                line.pattern === 'dots'
                                  ? 'radial-gradient(circle, white 2px, transparent 2px)'
                                  : line.pattern === 'stripes'
                                  ? 'repeating-linear-gradient(45deg, white, white 2px, transparent 2px, transparent 6px)'
                                  : line.pattern === 'grid'
                                  ? 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)'
                                  : line.pattern === 'waves'
                                  ? 'repeating-radial-gradient(circle at 0 0, transparent 0, white 2px, transparent 4px)'
                                  : 'none',
                              backgroundSize:
                                line.pattern === 'dots'
                                  ? '8px 8px'
                                  : line.pattern === 'grid'
                                  ? '8px 8px'
                                  : '16px 16px',
                            }}
                          />
                          <Bus className="w-8 h-8 relative z-10" style={{ color: line.color }} />
                        </div>
                      </div>

                      {/* Bus Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-gray-900 dark:text-gray-100">{line.name}</span>
                              {location.isDelayed && (
                                <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950 border-orange-500 dark:border-orange-600 text-orange-700 dark:text-orange-400">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  +{location.delayMinutes}min
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <MapPin className="w-3 h-3" />
                              <span>At {currentStop.name}</span>
                            </div>
                          </div>
                          
                          <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                        </div>

                        {/* Next stop and capacity */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-gray-600 dark:text-gray-400">
                            Next: {nextStop.name}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-gray-900 dark:text-gray-100">
                              <Clock className="w-4 h-4" />
                              <span>{location.nextStopETA} min</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span
                                className={
                                  location.capacityPercent > 80
                                    ? 'text-red-600 dark:text-red-500'
                                    : location.capacityPercent > 60
                                    ? 'text-orange-600 dark:text-orange-500'
                                    : 'text-green-600 dark:text-green-500'
                                }
                              >
                                {location.capacityPercent}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Access Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Card
          className="p-4 cursor-pointer hover:shadow-lg transition-shadow border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950"
          onClick={onNavigateToStops}
        >
          <div className="text-center">
            <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-gray-900 dark:text-gray-100">Find Stops</p>
          </div>
        </Card>
        
        <Card
          className="p-4 cursor-pointer hover:shadow-lg transition-shadow border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950"
          onClick={() => {
            // Navigate to schedule tab
            const scheduleTab = document.querySelector('[value="schedule"]') as HTMLElement;
            scheduleTab?.click();
          }}
        >
          <div className="text-center">
            <Calendar className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <p className="text-sm text-gray-900 dark:text-gray-100">My Schedule</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
