import { Bell, Volume2, VolumeX, Vibrate, Smartphone, AppWindow } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScheduledRoute } from '../types/bus';
import { Card } from './ui/card';

interface StopAlertSetupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: ScheduledRoute;
  onUpdate: (updates: Partial<ScheduledRoute>) => void;
  lineName: string;
  stopName: string;
}

export function StopAlertSetup({
  open,
  onOpenChange,
  schedule,
  onUpdate,
  lineName,
  stopName,
}: StopAlertSetupProps) {
  const updateSetting = <K extends keyof ScheduledRoute>(
    key: K,
    value: ScheduledRoute[K]
  ) => {
    onUpdate({ [key]: value });
  };

  const alertsEnabled = schedule.alertsEnabled ?? true;
  const soundEnabled = schedule.soundEnabled ?? true;
  const vibrationEnabled = schedule.vibrationEnabled ?? true;
  const pushEnabled = schedule.pushEnabled ?? true;
  const inAppEnabled = schedule.inAppEnabled ?? true;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            Stop Alert Setup
          </DialogTitle>
          <DialogDescription>
            Configure notifications for {lineName} to {stopName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Master toggle */}
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border-2 border-blue-500 dark:border-blue-600">
            <div className="flex-1">
              <Label htmlFor="alerts-enabled" className="text-gray-900 dark:text-gray-100">
                Enable Stop Alerts
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Get notified when bus is approaching
              </p>
            </div>
            <Switch
              id="alerts-enabled"
              checked={alertsEnabled}
              onCheckedChange={(value) => updateSetting('alertsEnabled', value)}
            />
          </div>

          {alertsEnabled && (
            <>
              {/* Stops away selector */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Label htmlFor="stops-before" className="text-gray-900 dark:text-gray-100">
                  Notify me when bus is:
                </Label>
                <Select
                  value={schedule.notifyStopsBefore.toString()}
                  onValueChange={(value) => updateSetting('notifyStopsBefore', parseInt(value))}
                >
                  <SelectTrigger id="stops-before" className="mt-2">
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

              {/* Notification type toggles */}
              <Card>
                <div className="p-3 space-y-3">
                  <h4 className="text-gray-900 dark:text-gray-100">Notification Types</h4>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-blue-500" />
                      <Label htmlFor="push-enabled" className="text-gray-900 dark:text-gray-100">
                        Push Notification
                      </Label>
                    </div>
                    <Switch
                      id="push-enabled"
                      checked={pushEnabled}
                      onCheckedChange={(value) => updateSetting('pushEnabled', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AppWindow className="w-4 h-4 text-purple-500" />
                      <Label htmlFor="inapp-enabled" className="text-gray-900 dark:text-gray-100">
                        In-App Notification
                      </Label>
                    </div>
                    <Switch
                      id="inapp-enabled"
                      checked={inAppEnabled}
                      onCheckedChange={(value) => updateSetting('inAppEnabled', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {soundEnabled ? (
                        <Volume2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <VolumeX className="w-4 h-4 text-gray-400" />
                      )}
                      <Label htmlFor="sound-enabled" className="text-gray-900 dark:text-gray-100">
                        Sound
                      </Label>
                    </div>
                    <Switch
                      id="sound-enabled"
                      checked={soundEnabled}
                      onCheckedChange={(value) => updateSetting('soundEnabled', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Vibrate className="w-4 h-4 text-orange-500" />
                      <Label htmlFor="vibration-enabled" className="text-gray-900 dark:text-gray-100">
                        Vibration
                      </Label>
                    </div>
                    <Switch
                      id="vibration-enabled"
                      checked={vibrationEnabled}
                      onCheckedChange={(value) => updateSetting('vibrationEnabled', value)}
                    />
                  </div>
                </div>
              </Card>

              {/* Preview */}
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border-2 border-green-500 dark:border-green-600">
                <div className="flex items-start gap-2">
                  <Bell className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-900 dark:text-gray-100 mb-1">
                      Alert Preview
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You will be notified <strong>{schedule.notifyStopsBefore} stop{schedule.notifyStopsBefore > 1 ? 's' : ''} before</strong> your stop via{' '}
                      {[
                        pushEnabled && 'push notification',
                        inAppEnabled && 'in-app alert',
                        soundEnabled && 'sound',
                        vibrationEnabled && 'vibration',
                      ]
                        .filter(Boolean)
                        .join(', ') || 'no methods selected'}.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
