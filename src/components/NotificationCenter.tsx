import { Bell, Bus, AlertTriangle, MapPin, Calendar, X, BellOff } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert } from '../types/bus';
import { ScrollArea } from './ui/scroll-area';

interface NotificationCenterProps {
  alerts: Alert[];
  onClearAlert?: (alertId: string) => void;
  onClearAll?: () => void;
}

export function NotificationCenter({ alerts, onClearAlert, onClearAll }: NotificationCenterProps) {
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'proximity':
        return <Bell className="w-5 h-5 text-blue-500" />;
      case 'terminal':
        return <MapPin className="w-5 h-5 text-green-500" />;
      case 'delay':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'schedule':
        return <Calendar className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAlertBadgeColor = (type: Alert['type']) => {
    switch (type) {
      case 'proximity':
        return 'bg-blue-50 dark:bg-blue-950 border-blue-500 dark:border-blue-600 text-blue-700 dark:text-blue-400';
      case 'terminal':
        return 'bg-green-50 dark:bg-green-950 border-green-500 dark:border-green-600 text-green-700 dark:text-green-400';
      case 'delay':
        return 'bg-orange-50 dark:bg-orange-950 border-orange-500 dark:border-orange-600 text-orange-700 dark:text-orange-400';
      case 'schedule':
        return 'bg-purple-50 dark:bg-purple-950 border-purple-500 dark:border-purple-600 text-purple-700 dark:text-purple-400';
      default:
        return 'bg-gray-50 dark:bg-gray-950 border-gray-500 dark:border-gray-600 text-gray-700 dark:text-gray-400';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-blue-500" />
            <div>
              <h3 className="text-gray-900 dark:text-gray-100">Notification Center</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {alerts.length === 0
                  ? 'No notifications'
                  : `${alerts.length} notification${alerts.length > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
          {alerts.length > 0 && onClearAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              Clear All
            </Button>
          )}
        </div>

        {alerts.length === 0 ? (
          <div className="py-12 text-center">
            <BellOff className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              You'll see alerts here when buses are approaching
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={`${getAlertBadgeColor(alert.type)} text-xs`}
                        >
                          {alert.lineName}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                          {formatTime(alert.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-900 dark:text-gray-100 mb-1">
                        {alert.message}
                      </p>
                      {alert.stopsAway > 0 && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <Bus className="w-4 h-4" />
                          <span>{alert.stopsAway} stop{alert.stopsAway > 1 ? 's' : ''} away</span>
                        </div>
                      )}
                    </div>
                    {onClearAlert && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onClearAlert(alert.id)}
                        className="flex-shrink-0 h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                        <span className="sr-only">Clear notification</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
}
