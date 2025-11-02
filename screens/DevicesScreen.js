import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, ScrollView, Text } from 'react-native';

import BaseScreen from '../components/BaseScreen';
import Header from '../components/Header';
import RoomCard from '../components/RoomCard';
import { useDevices } from '../contexts/DeviceContext';
import { useCommands } from '../contexts/CommandContext';

export default function DevicesScreen() {
  const { rooms, toggleDevice, setLightLevel, updateDevice } = useDevices();
  const { executeCommand, pending, history } = useCommands();
  const previousHistoryLengthRef = useRef(history.length);

  useEffect(() => {
    if (history.length > previousHistoryLengthRef.current) {
      const lastCommand = history[0];
      if (lastCommand && lastCommand.status === 'error') {
        const [roomId, deviceKey] = lastCommand.deviceId.split(':');
        if (lastCommand.type === 'ToggleDeviceCommand') {
          const room = rooms.find((r) => r.id === roomId);
          const device = room?.devices[deviceKey];
          if (device) {
            updateDevice(roomId, deviceKey, { isOn: !device.isOn });
          }
        }
      }
    }
    previousHistoryLengthRef.current = history.length;
  }, [history, rooms, updateDevice]);

  const handleToggleDevice = (roomId, deviceKey, isOn) => {
    toggleDevice(roomId, deviceKey, isOn);
    executeCommand({
      type: 'ToggleDeviceCommand',
      deviceId: `${roomId}:${deviceKey}`,
      payload: { state: isOn ? 'on' : 'off' },
    });
  };

  const handleAdjust = (roomId, key, newLevel) => {
    if (key === 'light') {
      setLightLevel(roomId, newLevel);
      executeCommand({
        type: 'AdjustLightLevelCommand',
        deviceId: `${roomId}:light`,
        payload: { level: newLevel },
      });
    }
  };

  return (
    <BaseScreen
      title="Devices"
      headerRight={
        pending.length ? <Text style={styles.pendingText}>{pending.length} sending…</Text> : null
      }
    >
      <StatusBar style="light" />
      <Header />
      <View style={styles.content}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsRow}
        >
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onToggleDevice={handleToggleDevice}
              onAdjust={handleAdjust}
            />
          ))}
        </ScrollView>
      </View>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  cardsRow: {
    paddingVertical: 12,
  },
  pendingText: {
    color: '#FFD166',
    fontSize: 12,
    fontWeight: '600',
  },
});


