export interface BusStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  order: number;
}

export interface BusLine {
  id: string;
  name: string;
  color: string;
  pattern: 'solid' | 'dots' | 'stripes' | 'grid' | 'waves';
  stops: BusStop[];
}

export interface BusLocation {
  busId: string;
  lineId: string;
  currentStopIndex: number;
  latitude: number;
  longitude: number;
  nextStopETA: number; // minutes
  timestamp: Date;
  isDelayed: boolean;
  delayMinutes: number;
  capacityPercent: number; // 0-100
}

export interface Alert {
  id: string;
  busId: string;
  lineName: string;
  message: string;
  stopsAway: number;
  timestamp: Date;
  type: 'proximity' | 'terminal' | 'delay' | 'schedule';
}

export interface ScheduledRoute {
  id: string;
  lineId: string;
  stopId: string;
  daysOfWeek: number[]; // 0 = Sunday, 6 = Saturday
  time: string; // HH:mm format
  notifyStopsBefore: number;
  enabled: boolean;
  alertsEnabled?: boolean;
  soundEnabled?: boolean;
  vibrationEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
}

export interface NotificationSettings {
  alertsEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  terminalDepartureAlert: boolean;
  delayAlerts: boolean;
  stopsAway: number;
  reducedMotion: boolean;
  theme: 'light' | 'dark' | 'system';
  autoNotifications: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
}