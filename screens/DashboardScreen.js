import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';

import BaseScreen from '../components/BaseScreen';
import GreetingHeader from '../components/GreetingHeader';
import StatusCard from '../components/StatusCard';
import LightingModeSelector from '../components/LightingModeSelector';
import DashboardRoomCard from '../components/DashBoardRoomCard';
import { useSensors } from '../contexts/SensorContext';
import { useDevices } from '../contexts/DeviceContext';

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '—';
  const date = new Date(timestamp);
  return `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

export default function DashboardScreen() {
  const { readings, lastUpdated, isRefreshing, error, refreshSensors } = useSensors();
  const { rooms } = useDevices();

  const temperature = readings.find((reading) => reading.metric === 'temperature');
  const humidity = readings.find((reading) => reading.metric === 'humidity');

  return (
    <BaseScreen title="Dashboard" scrollable contentStyle={styles.contentContainer}>
      <GreetingHeader />

      <View style={styles.environmentHeader}>
        <View>
          <Text style={styles.sectionTitle}>Environment</Text>
          <Text style={styles.updatedText}>Last updated {formatTimestamp(lastUpdated)}</Text>
        </View>
        <Pressable style={styles.refreshButton} onPress={refreshSensors} disabled={isRefreshing}>
          <Text style={styles.refreshText}>{isRefreshing ? 'Refreshing…' : 'Refresh'}</Text>
        </Pressable>
      </View>
      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.statusRow}>
        <StatusCard
          title="Temperature"
          iconName="thermometer"
          value={temperature ? temperature.value.toFixed(1) : '--'}
          unit={temperature?.unit}
          subValue={temperature ? `Recorded ${formatTimestamp(temperature.timestamp)}` : undefined}
        />
        <StatusCard
          title="Humidity"
          iconName="water"
          value={humidity ? humidity.value.toFixed(1) : '--'}
          unit={humidity?.unit}
          subValue={humidity ? `Recorded ${formatTimestamp(humidity.timestamp)}` : undefined}
        />
        <LightingModeSelector />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Rooms</Text>
        <Text style={styles.sectionSub}>{rooms.length} spaces connected</Text>
      </View>

      <View style={styles.roomList}>
        {rooms.map((room) => (
          <DashboardRoomCard key={room.id} room={room} />
        ))}
      </View>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 16,
  },
  environmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#E9ECFF',
    fontSize: 16,
    fontWeight: '700',
  },
  updatedText: {
    color: '#AEB7FF',
    fontSize: 12,
    marginTop: 4,
  },
  refreshButton: {
    backgroundColor: '#2A2D3E',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  refreshText: {
    color: '#9FB3FF',
    fontSize: 12,
    fontWeight: '600',
  },
  errorBanner: {
    backgroundColor: '#2A1F26',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FF6B6B55',
  },
  errorText: {
    color: '#FF7A7A',
    fontSize: 13,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  sectionSub: {
    color: '#AEB7FF',
    fontSize: 12,
  },
  roomList: {
    marginTop: 10,
  },
});


