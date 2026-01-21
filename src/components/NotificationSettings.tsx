import { Bell, BellOff, Volume2, VolumeX, Vibrate, AlertTriangle, MapPin, Eye, EyeOff, Sun, Moon, Monitor, Sparkles, Smartphone, AppWindow } from 'lucide-react';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { NotificationSettings as NotificationSettingsType } from '../types/bus';

interface NotificationSettingsProps {
  settings: NotificationSettingsType;
  onUpdate: (settings: NotificationSettingsType) => void;
}

export function NotificationSettings({ settings, onUpdate }: NotificationSettingsProps) {
  const updateSetting = <K extends keyof NotificationSettingsType>(
    key: K,
    value: NotificationSettingsType[K]
  ) => {
    onUpdate({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            {settings.alertsEnabled ? (
              <Bell className="w-6 h-6 text-blue-500" />
            ) : (
              <BellOff className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            )}
            <h3 className="text-gray-900 dark:text-gray-100">Notification Settings</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <Label htmlFor="alerts-toggle" className="text-gray-900 dark:text-gray-100">
                  Enable Notifications
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Get notified when your bus is approaching
                </p>
              </div>
              <Switch
                id="alerts-toggle"
                checked={settings.alertsEnabled}
                onCheckedChange={(value) => updateSetting('alertsEnabled', value)}
              />
            </div>

            {settings.alertsEnabled && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Label htmlFor="stops-away" className="text-gray-900 dark:text-gray-100">
                  Alert when bus is this many stops away:
                </Label>
                <Select
                  value={settings.stopsAway.toString()}
                  onValueChange={(value) => updateSetting('stopsAway', parseInt(value))}
                >
                  <SelectTrigger id="stops-away" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 stop away</SelectItem>
                    <SelectItem value="2">2 stops away</SelectItem>
                    <SelectItem value="3">3 stops away</SelectItem>
                    <SelectItem value="4">4 stops away</SelectItem>
                    <SelectItem value="5">5 stops away</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-blue-500" />
            <h3 className="text-gray-900 dark:text-gray-100">Notification Preferences</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Choose how you want to be notified
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-500" />
                  <Label htmlFor="push-notifications" className="text-gray-900 dark:text-gray-100">
                    Push Notification
                  </Label>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Receive phone alerts even when app is closed
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={settings.pushEnabled}
                onCheckedChange={(value) => updateSetting('pushEnabled', value)}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <AppWindow className="w-4 h-4 text-purple-500" />
                  <Label htmlFor="inapp-notifications" className="text-gray-900 dark:text-gray-100">
                    In-App Notification
                  </Label>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Show alerts within the app
                </p>
              </div>
              <Switch
                id="inapp-notifications"
                checked={settings.inAppEnabled}
                onCheckedChange={(value) => updateSetting('inAppEnabled', value)}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {settings.soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-gray-400" />
                  )}
                  <Label htmlFor="sound-toggle" className="text-gray-900 dark:text-gray-100">
                    Sound
                  </Label>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Play a sound with notifications
                </p>
              </div>
              <Switch
                id="sound-toggle"
                checked={settings.soundEnabled}
                onCheckedChange={(value) => updateSetting('soundEnabled', value)}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Vibrate className="w-4 h-4 text-orange-500" />
                  <Label htmlFor="vibration-toggle" className="text-gray-900 dark:text-gray-100">
                    Vibration
                  </Label>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Vibrate your device for notifications
                </p>
              </div>
              <Switch
                id="vibration-toggle"
                checked={settings.vibrationEnabled}
                onCheckedChange={(value) => updateSetting('vibrationEnabled', value)}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            <h3 className="text-gray-900 dark:text-gray-100">Special Alerts</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border-2 border-blue-500 dark:border-blue-600">
              <div className="flex-1">
                <Label htmlFor="auto-notifications" className="text-gray-900 dark:text-gray-100">
                  Automatic Notifications
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Auto-notify based on your trips and stop preferences without manual setup
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <Switch
                  id="auto-notifications"
                  checked={settings.autoNotifications}
                  onCheckedChange={(value) => updateSetting('autoNotifications', value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <Label htmlFor="terminal-alert" className="text-gray-900 dark:text-gray-100">
                  Terminal Departure Alert
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Get notified when bus leaves from terminal
                </p>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                <Switch
                  id="terminal-alert"
                  checked={settings.terminalDepartureAlert}
                  onCheckedChange={(value) => updateSetting('terminalDepartureAlert', value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <Label htmlFor="delay-alert" className="text-gray-900 dark:text-gray-100">
                  Delay Alerts
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Get notified about bus delays
                </p>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <Switch
                  id="delay-alert"
                  checked={settings.delayAlerts}
                  onCheckedChange={(value) => updateSetting('delayAlerts', value)}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <Eye className="w-6 h-6 text-purple-500" />
            <h3 className="text-gray-900 dark:text-gray-100">Accessibility & Appearance</h3>
          </div>

          <div className="space-y-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Label htmlFor="theme-select" className="text-gray-900 dark:text-gray-100">
                Theme
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 mt-1">
                Choose your preferred color scheme
              </p>
              <Select
                value={settings.theme}
                onValueChange={(value) => updateSetting('theme', value as 'light' | 'dark' | 'system')}
              >
                <SelectTrigger id="theme-select" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <Label htmlFor="reduced-motion" className="text-gray-900 dark:text-gray-100">
                  Reduce Motion
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Minimize animations and movement
                </p>
              </div>
              <div className="flex items-center gap-2">
                {settings.reducedMotion ? (
                  <EyeOff className="w-5 h-5 text-purple-500" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
                <Switch
                  id="reduced-motion"
                  checked={settings.reducedMotion}
                  onCheckedChange={(value) => updateSetting('reducedMotion', value)}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <h3 className="text-gray-900 dark:text-gray-100 mb-3">Neurodivergent-Friendly Design</h3>
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg border-2 border-green-500 dark:border-green-600">
              <div className="w-6 h-6 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white">✓</span>
              </div>
              <div>
                <p className="text-gray-900 dark:text-gray-100">Pattern-based identification</p>
                <p className="text-sm">Each line has a unique pattern (dots, stripes, etc.)</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg border-2 border-green-500 dark:border-green-600">
              <div className="w-6 h-6 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white">✓</span>
              </div>
              <div>
                <p className="text-gray-900 dark:text-gray-100">Predictable routine support</p>
                <p className="text-sm">Weekly schedule helps maintain consistent routines</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg border-2 border-green-500 dark:border-green-600">
              <div className="w-6 h-6 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white">✓</span>
              </div>
              <div>
                <p className="text-gray-900 dark:text-gray-100">Clear, simple language</p>
                <p className="text-sm">No jargon, direct instructions</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg border-2 border-green-500 dark:border-green-600">
              <div className="w-6 h-6 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white">✓</span>
              </div>
              <div>
                <p className="text-gray-900 dark:text-gray-100">Reduced cognitive load</p>
                <p className="text-sm">One task per screen, clear visual hierarchy</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg border-2 border-green-500 dark:border-green-600">
              <div className="w-6 h-6 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white">✓</span>
              </div>
              <div>
                <p className="text-gray-900 dark:text-gray-100">Multiple feedback modes</p>
                <p className="text-sm">Visual, audio, and haptic notifications</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg border-2 border-green-500 dark:border-green-600">
              <div className="w-6 h-6 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white">✓</span>
              </div>
              <div>
                <p className="text-gray-900 dark:text-gray-100">Consistent layout</p>
                <p className="text-sm">Same structure across all screens</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}