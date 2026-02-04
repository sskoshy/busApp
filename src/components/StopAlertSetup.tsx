import React from 'react';
import {
  Modal,
  View,
  Text,
  Switch,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {
  Ionicons,
} from '@expo/vector-icons'; // or react-native-vector-icons

import { ScheduledRoute } from '../types/bus';

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
    <Modal visible={open} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Stop Alert Setup</Text>
            <Text style={styles.subtitle}>
              Configure notifications for {lineName} to {stopName}
            </Text>
          </View>

          {/* Master toggle */}
          <View style={styles.cardPrimary}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Enable Stop Alerts</Text>
              <Text style={styles.helper}>
                Get notified when bus is approaching
              </Text>
            </View>
            <Switch
              value={alertsEnabled}
              onValueChange={(value) =>
                updateSetting('alertsEnabled', value)
              }
            />
          </View>

          {alertsEnabled && (
            <>
              {/* Stops before */}
              <View style={styles.card}>
                <Text style={styles.label}>Notify me when bus is:</Text>
                <Picker
                  selectedValue={schedule.notifyStopsBefore}
                  onValueChange={(value) =>
                    updateSetting('notifyStopsBefore', value)
                  }
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Picker.Item
                      key={n}
                      label={`${n} stop${n > 1 ? 's' : ''} before`}
                      value={n}
                    />
                  ))}
                </Picker>
              </View>

              {/* Notification Types */}
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Notification Types</Text>

                <SettingRow
                  icon="notifications-outline"
                  label="Push Notification"
                  value={pushEnabled}
                  onChange={(v) => updateSetting('pushEnabled', v)}
                />

                <SettingRow
                  icon="apps-outline"
                  label="In-App Notification"
                  value={inAppEnabled}
                  onChange={(v) => updateSetting('inAppEnabled', v)}
                />

                <SettingRow
                  icon={soundEnabled ? 'volume-high-outline' : 'volume-mute-outline'}
                  label="Sound"
                  value={soundEnabled}
                  onChange={(v) => updateSetting('soundEnabled', v)}
                />

                <SettingRow
                  icon="phone-portrait-outline"
                  label="Vibration"
                  value={vibrationEnabled}
                  onChange={(v) =>
                    updateSetting('vibrationEnabled', v)
                  }
                />
              </View>

              {/* Preview */}
              <View style={styles.cardSuccess}>
                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color="#16a34a"
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Alert Preview</Text>
                  <Text style={styles.helper}>
                    You will be notified{' '}
                    <Text style={{ fontWeight: '600' }}>
                      {schedule.notifyStopsBefore} stop
                      {schedule.notifyStopsBefore > 1 ? 's' : ''} before
                    </Text>{' '}
                    via{' '}
                    {[
                      pushEnabled && 'push notification',
                      inAppEnabled && 'in-app alert',
                      soundEnabled && 'sound',
                      vibrationEnabled && 'vibration',
                    ]
                      .filter(Boolean)
                      .join(', ') || 'no methods selected'}.
                  </Text>
                </View>
              </View>
            </>
          )}

          {/* Close */}
          <Pressable
            style={styles.closeButton}
            onPress={() => onOpenChange(false)}
          >
            <Text style={styles.closeText}>Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function SettingRow({
  icon,
  label,
  value,
  onChange,
}: {
  icon: string;
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon as any} size={18} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}
