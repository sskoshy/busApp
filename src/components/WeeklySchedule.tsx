import { useState } from 'react';
import { Calendar, Plus, Trash2, Edit2, Bell } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { BusLine, ScheduledRoute } from '../types/bus';
import { Badge } from './ui/badge';
import { StopAlertSetup } from './StopAlertSetup';

interface WeeklyScheduleProps {
  busLines: BusLine[];
  schedules: ScheduledRoute[];
  onAddSchedule: (schedule: ScheduledRoute) => void;
  onDeleteSchedule: (id: string) => void;
  onToggleSchedule: (id: string, enabled: boolean) => void;
  onUpdateSchedule?: (id: string, updates: Partial<ScheduledRoute>) => void;
}

const DAYS = [
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' },
  { value: 0, label: 'Sunday', short: 'Sun' },
];

export function WeeklySchedule({ busLines, schedules, onAddSchedule, onDeleteSchedule, onToggleSchedule, onUpdateSchedule }: WeeklyScheduleProps) {
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [selectedLineId, setSelectedLineId] = useState<string>('');
  const [selectedStopId, setSelectedStopId] = useState<string>('');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [time, setTime] = useState('08:00');
  const [notifyStopsBefore, setNotifyStopsBefore] = useState(2);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);

  const selectedLine = busLines.find(line => line.id === selectedLineId);
  const editingSchedule = schedules.find(s => s.id === editingScheduleId);

  const handleAddSchedule = () => {
    if (!selectedLineId || !selectedStopId || selectedDays.length === 0) return;

    const newSchedule: ScheduledRoute = {
      id: `schedule-${Date.now()}`,
      lineId: selectedLineId,
      stopId: selectedStopId,
      daysOfWeek: selectedDays,
      time,
      notifyStopsBefore,
      enabled: true,
    };

    onAddSchedule(newSchedule);
    setIsAddingSchedule(false);
    setSelectedLineId('');
    setSelectedStopId('');
    setSelectedDays([]);
    setTime('08:00');
    setNotifyStopsBefore(2);
  };

  const toggleDay = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

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
    <Card>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-blue-500" />
            <h3 className="text-gray-900 dark:text-gray-100">Weekly Schedule</h3>
          </div>
          <Dialog open={isAddingSchedule} onOpenChange={setIsAddingSchedule}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Route
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Scheduled Route</DialogTitle>
                <DialogDescription>
                  Set up a regular bus route for automatic notifications on specific days
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Bus Line</Label>
                  <Select value={selectedLineId} onValueChange={setSelectedLineId}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a line" />
                    </SelectTrigger>
                    <SelectContent>
                      {busLines.map(line => (
                        <SelectItem key={line.id} value={line.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded border ${getPatternClass(line.pattern)}`}
                              style={{ color: line.color }}
                            />
                            {line.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedLine && (
                  <div>
                    <Label>Your Stop</Label>
                    <Select value={selectedStopId} onValueChange={setSelectedStopId}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select your stop" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedLine.stops.map(stop => (
                          <SelectItem key={stop.id} value={stop.id}>
                            {stop.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label>Days of Week</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {DAYS.map(day => (
                      <Button
                        key={day.value}
                        variant={selectedDays.includes(day.value) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleDay(day.value)}
                        type="button"
                      >
                        {day.short}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Usual Time</Label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="mt-2 w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  />
                </div>

                <div>
                  <Label>Notify me this many stops before:</Label>
                  <Select
                    value={notifyStopsBefore.toString()}
                    onValueChange={(value) => setNotifyStopsBefore(parseInt(value))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 stop before</SelectItem>
                      <SelectItem value="2">2 stops before</SelectItem>
                      <SelectItem value="3">3 stops before</SelectItem>
                      <SelectItem value="4">4 stops before</SelectItem>
                      <SelectItem value="5">5 stops before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleAddSchedule} className="w-full">
                  Add Schedule
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {schedules.length === 0 ? (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
            <p>No scheduled routes yet</p>
            <p className="text-sm mt-1">Add your regular bus routes for automatic notifications</p>
          </div>
        ) : (
          <div className="space-y-3">
            {schedules.map(schedule => {
              const line = busLines.find(l => l.id === schedule.lineId);
              const stop = line?.stops.find(s => s.id === schedule.stopId);
              if (!line || !stop) return null;

              return (
                <div
                  key={schedule.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    schedule.enabled ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' : 'bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-lg border-2 border-gray-800 dark:border-gray-200 ${getPatternClass(line.pattern)}`}
                        style={{ color: line.color }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-900 dark:text-gray-100">{line.name}</span>
                        <Badge variant="outline">{schedule.time}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {stop.name} • Notify {schedule.notifyStopsBefore} stop{schedule.notifyStopsBefore > 1 ? 's' : ''} before
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {schedule.daysOfWeek.sort((a, b) => a - b).map(day => {
                          const dayInfo = DAYS.find(d => d.value === day);
                          return (
                            <Badge key={day} variant="secondary" className="text-xs">
                              {dayInfo?.short}
                            </Badge>
                          );
                        })}
                      </div>
                      {schedule.enabled && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => setEditingScheduleId(schedule.id)}
                        >
                          <Bell className="w-3 h-3 mr-1" />
                          Alert Setup
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Switch
                        checked={schedule.enabled}
                        onCheckedChange={(enabled) => onToggleSchedule(schedule.id, enabled)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteSchedule(schedule.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {editingSchedule && (
        <StopAlertSetup
          open={editingScheduleId !== null}
          onOpenChange={(open) => !open && setEditingScheduleId(null)}
          schedule={editingSchedule}
          onUpdate={(updates) => {
            if (onUpdateSchedule && editingScheduleId) {
              onUpdateSchedule(editingScheduleId, updates);
            }
          }}
          lineName={busLines.find(l => l.id === editingSchedule.lineId)?.name || ''}
          stopName={busLines.find(l => l.id === editingSchedule.lineId)?.stops.find(s => s.id === editingSchedule.stopId)?.name || ''}
        />
      )}
    </Card>
  );
}