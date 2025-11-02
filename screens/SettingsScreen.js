import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import BaseScreen from '../components/BaseScreen';
import { useConnection } from '../contexts/ConnectionContext';
import { useCommands } from '../contexts/CommandContext';
import { useSensors } from '../contexts/SensorContext';
import { useDevices } from '../contexts/DeviceContext';

export default function SettingsScreen() {
  const { status, retries, lastError } = useConnection();
  const { history, clearHistory } = useCommands();
  const { readings } = useSensors();
  const { rooms } = useDevices();

  return (
    <BaseScreen title="Settings">
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>System overview</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Connection</Text>
            <Text style={styles.infoValue}>{status}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Retries</Text>
            <Text style={styles.infoValue}>{retries}</Text>
          </View>
          {lastError ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last error</Text>
              <Text style={[styles.infoValue, styles.errorText]}>{lastError}</Text>
            </View>
          ) : null}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Rooms tracked</Text>
            <Text style={styles.infoValue}>{rooms.length}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Sensor metrics</Text>
            <Text style={styles.infoValue}>{readings.length}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Command history</Text>
            <Text style={styles.infoValue}>{history.length}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Developer tools</Text>
        <Pressable style={styles.actionButton} onPress={clearHistory}>
          <Text style={styles.actionText}>Clear command history</Text>
        </Pressable>
        <Text style={styles.hintText}>
          Back-end integrations can subscribe to the provided contexts to bridge MQTT state with the
          UI components.
        </Text>
      </View>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
    gap: 20,
  },
  sectionTitle: {
    color: '#E9ECFF',
    fontSize: 16,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: '#151723',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    color: '#9FA5BF',
    fontSize: 13,
  },
  infoValue: {
    color: '#E9ECFF',
    fontWeight: '600',
    fontSize: 13,
    textTransform: 'capitalize',
  },
  errorText: {
    color: '#FF7A7A',
    textTransform: 'none',
  },
  actionButton: {
    backgroundColor: '#2A2D3E',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionText: {
    color: '#9FB3FF',
    fontWeight: '600',
  },
  hintText: {
    color: '#6D728A',
    fontSize: 12,
    lineHeight: 18,
  },
});


