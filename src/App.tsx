import { useState, useEffect, useCallback } from 'react';
import { Bus, Bell, Settings, Home, Calendar as CalendarIcon, AlertTriangle, Users, MapPin, Navigation } from 'lucide-react';
import { HomePage } from './components/HomePage';
import { BusLineCard } from './components/BusLineCard';
import { BusTracker } from './components/BusTracker';
import { NotificationSettings } from './components/NotificationSettings';
import { NotificationCenter } from './components/NotificationCenter';
import { WelcomeDialog } from './components/WelcomeDialog';
import { WeeklySchedule } from './components/WeeklySchedule';
import { StopFinder } from './components/StopFinder';
import { LocationPicker, UserLocation } from './components/LocationPicker';
import { ColorSchemeSettings } from './components/ColorSchemeSettings';
import { ColorSchemeProvider } from './contexts/ColorSchemeContext';
import { useBusLineColors } from './hooks/useBusLineColors';
import { busLines, mockBusLocations } from './data/mockData';
import { BusLine, BusLocation, Alert, NotificationSettings as NotificationSettingsType, ScheduledRoute, BusStop } from './types/bus';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Toaster, toast } from 'sonner@2.0.3';
import { Card } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './components/ui/sheet';

function AppContent() {
  const coloredBusLines = useBusLineColors(busLines);
  const [selectedLine, setSelectedLine] = useState<BusLine | null>(null);
  const [busLocations, setBusLocations] = useState<BusLocation[]>(mockBusLocations);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeTab, setActiveTab] = useState('home');
  const [schedules, setSchedules] = useState<ScheduledRoute[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(() => {
    const saved = localStorage.getItem('userLocation');
    return saved ? JSON.parse(saved) : null;
  });
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettingsType>({
    alertsEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    terminalDepartureAlert: true,
    delayAlerts: true,
    stopsAway: 2,
    reducedMotion: false,
    theme: 'system',
    autoNotifications: false,
    pushEnabled: true,
    inAppEnabled: true,
  });
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    return !hasSeenWelcome;
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    const applyTheme = () => {
      if (notificationSettings.theme === 'dark') {
        root.classList.add('dark');
      } else if (notificationSettings.theme === 'light') {
        root.classList.remove('dark');
      } else {
        // System preference
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme();

    // Listen for system theme changes when in 'system' mode
    if (notificationSettings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [notificationSettings.theme]);

  // Vibration helper
  const vibrate = useCallback(() => {
    if (notificationSettings.vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  }, [notificationSettings.vibrationEnabled]);

  // Simulate real-time bus movement
  useEffect(() => {
    const interval = setInterval(() => {
      setBusLocations((prev) =>
        prev.map((location) => {
          const line = busLines.find((l) => l.id === location.lineId);
          if (!line) return location;

          // Move to next stop if ETA is 0
          if (location.nextStopETA <= 0) {
            const nextIndex = (location.currentStopIndex + 1) % line.stops.length;
            const nextStop = line.stops[nextIndex];
            
            // Randomly simulate delays and capacity changes
            const randomDelay = Math.random() > 0.8;
            const capacityChange = Math.floor(Math.random() * 20) - 10;
            
            return {
              ...location,
              currentStopIndex: nextIndex,
              latitude: nextStop.latitude,
              longitude: nextStop.longitude,
              nextStopETA: Math.floor(Math.random() * 5) + 3,
              timestamp: new Date(),
              isDelayed: randomDelay ? true : location.isDelayed,
              delayMinutes: randomDelay ? Math.floor(Math.random() * 5) + 1 : location.delayMinutes,
              capacityPercent: Math.max(0, Math.min(100, location.capacityPercent + capacityChange)),
            };
          }

          return {
            ...location,
            nextStopETA: location.nextStopETA - 1,
            timestamp: new Date(),
          };
        })
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Check for terminal departure alerts
  useEffect(() => {
    if (!notificationSettings.alertsEnabled || !notificationSettings.terminalDepartureAlert) return;

    busLocations.forEach((location) => {
      const line = coloredBusLines.find((l) => l.id === location.lineId);
      if (!line) return;

      // Check if bus just left terminal (first stop with low ETA)
      if (location.currentStopIndex === 0 && location.nextStopETA === 1) {
        const alertId = `terminal-${location.busId}-${Date.now()}`;
        const existingAlert = alerts.find((a) => a.id.startsWith(`terminal-${location.busId}`));
        
        if (!existingAlert) {
          const newAlert: Alert = {
            id: alertId,
            busId: location.busId,
            lineName: line.name,
            message: `${line.name} just left the terminal`,
            stopsAway: 0,
            timestamp: new Date(),
            type: 'terminal',
          };
          
          setAlerts((prev) => [...prev, newAlert]);
          toast.info(newAlert.message, {
            icon: <Bus className="w-5 h-5" />,
            duration: 5000,
          });
          vibrate();
        }
      }
    });
  }, [busLocations, coloredBusLines, notificationSettings.alertsEnabled, notificationSettings.terminalDepartureAlert, alerts]);

  // Check for delay alerts
  useEffect(() => {
    if (!notificationSettings.alertsEnabled || !notificationSettings.delayAlerts) return;

    busLocations.forEach((location) => {
      const line = coloredBusLines.find((l) => l.id === location.lineId);
      if (!line) return;

      if (location.isDelayed) {
        const alertId = `delay-${location.busId}`;
        const existingAlert = alerts.find((a) => a.id === alertId);
        
        if (!existingAlert) {
          const newAlert: Alert = {
            id: alertId,
            busId: location.busId,
            lineName: line.name,
            message: `${line.name} is delayed by ${location.delayMinutes} minute${location.delayMinutes > 1 ? 's' : ''}`,
            stopsAway: 0,
            timestamp: new Date(),
            type: 'delay',
          };
          
          setAlerts((prev) => [...prev, newAlert]);
          toast.warning(newAlert.message, {
            icon: <AlertTriangle className="w-5 h-5" />,
            duration: 5000,
          });
          vibrate();
        }
      }
    });
  }, [busLocations, coloredBusLines, notificationSettings.alertsEnabled, notificationSettings.delayAlerts, alerts]);

  // Check for proximity alerts (manual tracking)
  useEffect(() => {
    if (!notificationSettings.alertsEnabled || !selectedLine) return;

    const selectedBus = busLocations.find((loc) => loc.lineId === selectedLine.id);
    if (!selectedBus) return;

    const stopsUntilEnd = selectedLine.stops.length - 1 - selectedBus.currentStopIndex;
    
    if (stopsUntilEnd <= notificationSettings.stopsAway && stopsUntilEnd > 0) {
      const nextStop = selectedLine.stops[selectedBus.currentStopIndex + 1];
      const alertId = `proximity-${selectedBus.busId}-${selectedBus.currentStopIndex}`;
      
      const existingAlert = alerts.find((a) => a.id === alertId);
      if (!existingAlert) {
        const newAlert: Alert = {
          id: alertId,
          busId: selectedBus.busId,
          lineName: selectedLine.name,
          message: `${selectedLine.name} is ${stopsUntilEnd} stop${stopsUntilEnd > 1 ? 's' : ''} away from ${nextStop.name}!`,
          stopsAway: stopsUntilEnd,
          timestamp: new Date(),
          type: 'proximity',
        };
        
        setAlerts((prev) => [...prev, newAlert]);
        toast.success(newAlert.message, {
          icon: <Bell className="w-5 h-5" />,
          duration: 5000,
        });
        vibrate();
      }
    }
  }, [busLocations, selectedLine, notificationSettings.alertsEnabled, notificationSettings.stopsAway, alerts]);

  // Check for scheduled route alerts
  useEffect(() => {
    if (!notificationSettings.alertsEnabled) return;

    const now = new Date();
    const currentDay = now.getDay();
    
    schedules.forEach((schedule) => {
      // Auto notifications: alert even if schedule is disabled when autoNotifications is on
      const shouldAlert = notificationSettings.autoNotifications ? true : schedule.enabled;
      
      if (!shouldAlert || !schedule.daysOfWeek.includes(currentDay)) return;

      const line = coloredBusLines.find((l) => l.id === schedule.lineId);
      const bus = busLocations.find((loc) => loc.lineId === schedule.lineId);
      if (!line || !bus) return;

      const stop = line.stops.find((s) => s.id === schedule.stopId);
      if (!stop) return;

      const stopIndex = line.stops.findIndex((s) => s.id === schedule.stopId);
      const stopsUntilTarget = stopIndex - bus.currentStopIndex;

      if (stopsUntilTarget === schedule.notifyStopsBefore && stopsUntilTarget > 0) {
        const alertId = `schedule-${schedule.id}-${bus.currentStopIndex}`;
        const existingAlert = alerts.find((a) => a.id === alertId);
        
        if (!existingAlert) {
          const newAlert: Alert = {
            id: alertId,
            busId: bus.busId,
            lineName: line.name,
            message: `Your ${line.name} to ${stop.name} is ${stopsUntilTarget} stop${stopsUntilTarget > 1 ? 's' : ''} away!`,
            stopsAway: stopsUntilTarget,
            timestamp: new Date(),
            type: 'schedule',
          };
          
          setAlerts((prev) => [...prev, newAlert]);
          toast.success(newAlert.message, {
            icon: <CalendarIcon className="w-5 h-5" />,
            duration: 7000,
          });
          vibrate();
        }
      }
    });
  }, [busLocations, coloredBusLines, schedules, notificationSettings.alertsEnabled, notificationSettings.autoNotifications, alerts]);

  const selectedBusLocation = selectedLine
    ? busLocations.find((loc) => loc.lineId === selectedLine.id)
    : undefined;

  const handleAddSchedule = (schedule: ScheduledRoute) => {
    setSchedules((prev) => [...prev, schedule]);
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  const handleToggleSchedule = (id: string, enabled: boolean) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled } : s))
    );
  };

  const handleUpdateSchedule = (id: string, updates: Partial<ScheduledRoute>) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const handleEnableNotifications = () => {
    setNotificationSettings((prev) => ({ ...prev, alertsEnabled: true }));
    localStorage.setItem('hasSeenWelcome', 'true');
    setShowWelcomeDialog(false);
    toast.success('Notifications enabled!', {
      description: 'You can customize notification settings anytime',
    });
  };

  const handleSkipWelcome = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setShowWelcomeDialog(false);
  };

  const handleOpenSettings = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setShowWelcomeDialog(false);
    setActiveTab('settings');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-center" richColors />
      <WelcomeDialog
        open={showWelcomeDialog}
        onEnableNotifications={handleEnableNotifications}
        onSkip={handleSkipWelcome}
        onOpenSettings={handleOpenSettings}
      />
      
      <header className="bg-white dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Bus className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-gray-900 dark:text-gray-100">UC Davis Unitrans</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Real-Time Bus Tracker</p>
            </div>
            {userLocation && (
              <Badge variant="secondary" className="gap-1 hidden sm:flex">
                <MapPin className="w-3 h-3" />
                Location Set
              </Badge>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {alerts.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {alerts.length}
                    </span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Notifications</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <NotificationCenter
                    alerts={alerts}
                    onClearAlert={(id) => setAlerts((prev) => prev.filter((a) => a.id !== id))}
                    onClearAll={() => setAlerts([])}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-auto">
            <TabsTrigger value="home" className="flex items-center gap-1 py-3 px-2">
              <Home className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Home</span>
            </TabsTrigger>
            <TabsTrigger value="stops" className="flex items-center gap-1 py-3 px-2">
              <MapPin className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Stops</span>
            </TabsTrigger>
            <TabsTrigger value="tracker" className="flex items-center gap-1 py-3 px-2" disabled={!selectedLine}>
              <Bus className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Track</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-1 py-3 px-2">
              <CalendarIcon className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Sched</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1 py-3 px-2">
              <Settings className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Set</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-4">
            <HomePage
              busLines={coloredBusLines}
              busLocations={busLocations}
              onSelectLine={(line) => {
                setSelectedLine(line);
                setActiveTab('tracker');
              }}
              onNavigateToStops={() => setActiveTab('stops')}
            />
          </TabsContent>

          <TabsContent value="lines" className="space-y-4">
            <Card>
              <div className="p-4">
                <h2 className="text-gray-900 dark:text-gray-100 mb-2">Select a Bus Line</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Choose a line to track in real-time. Patterns help distinguish lines for all users.
                </p>
              </div>
            </Card>

            <div className="grid gap-3">
              {coloredBusLines.map((line) => (
                <BusLineCard
                  key={line.id}
                  line={line}
                  isActive={selectedLine?.id === line.id}
                  onClick={() => {
                    setSelectedLine(line);
                    setActiveTab('tracker');
                  }}
                />
              ))}
            </div>

            {busLocations.length > 0 && (
              <Card>
                <div className="p-4">
                  <h3 className="text-gray-900 dark:text-gray-100 mb-3">Active Buses</h3>
                  <div className="space-y-2">
                    {busLocations.map((location) => {
                      const line = coloredBusLines.find((l) => l.id === location.lineId);
                      if (!line) return null;
                      const currentStop = line.stops[location.currentStopIndex];
                      return (
                        <div
                          key={location.busId}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex items-center gap-3">
                            <Bus className="w-5 h-5" style={{ color: line.color }} />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-900 dark:text-gray-100">{line.name}</span>
                                {location.isDelayed && (
                                  <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950 border-orange-500 dark:border-orange-600 text-orange-700 dark:text-orange-400">
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    +{location.delayMinutes}min
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">at {currentStop.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              {location.nextStopETA} min
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                              <Users className="w-3 h-3" />
                              {location.capacityPercent}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="stops" className="space-y-4">
            <LocationPicker
              currentLocation={userLocation}
              onLocationChange={(location) => {
                setUserLocation(location);
                if (location) {
                  toast.success('Location set!', {
                    description: location.name || 'Finding nearby stops...',
                  });
                } else {
                  toast.info('Location cleared', {
                    description: 'Stops will be sorted alphabetically',
                  });
                }
              }}
              busLines={coloredBusLines}
            />
            <StopFinder
              busLines={coloredBusLines}
              userLocation={userLocation}
              onSelectLine={(line: BusLine, stop: BusStop) => {
                setSelectedLine(line);
                setActiveTab('tracker');
                toast.success(`Selected ${line.name} to ${stop.name}`, {
                  description: 'Now tracking this bus line',
                });
              }}
            />
          </TabsContent>

          <TabsContent value="tracker" className="space-y-4">
            {selectedLine ? (
              <BusTracker line={selectedLine} busLocation={selectedBusLocation} />
            ) : (
              <Card>
                <div className="p-8 text-center">
                  <Bus className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-gray-900 dark:text-gray-100 mb-2">No Line Selected</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Please select a bus line from the Lines tab to track it
                  </p>
                  <Button onClick={() => setActiveTab('lines')}>
                    View Bus Lines
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <div className="p-4">
                <h2 className="text-gray-900 dark:text-gray-100 mb-2">Your Weekly Bus Schedule</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Set up your regular bus routes and get automatic notifications. Perfect for maintaining routines.
                </p>
              </div>
            </Card>
            <NotificationCenter
              alerts={alerts}
              onClearAlert={(id) => setAlerts((prev) => prev.filter((a) => a.id !== id))}
              onClearAll={() => setAlerts([])}
            />
            <WeeklySchedule
              busLines={coloredBusLines}
              schedules={schedules}
              onAddSchedule={handleAddSchedule}
              onDeleteSchedule={handleDeleteSchedule}
              onToggleSchedule={handleToggleSchedule}
              onUpdateSchedule={handleUpdateSchedule}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <NotificationCenter
              alerts={alerts}
              onClearAlert={(id) => setAlerts((prev) => prev.filter((a) => a.id !== id))}
              onClearAll={() => setAlerts([])}
            />
            <NotificationSettings
              settings={notificationSettings}
              onUpdate={setNotificationSettings}
            />
            <ColorSchemeSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ColorSchemeProvider>
      <AppContent />
    </ColorSchemeProvider>
  );
}