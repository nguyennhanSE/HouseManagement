import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import Header from '../components/Header';
import RoomCard from '../components/RoomCard';
import BottomNav from '../components/BottomNav';
import { mockRooms } from '../data/rooms';

export default function RoomsScreen() {
  const [rooms, setRooms] = useState(mockRooms);

  const handleToggleDevice = (roomId, deviceKey, isOn) => {
    setRooms((prev) =>
      prev.map((room) => {
        if (room.id !== roomId) return room;
        const device = room.devices[deviceKey] || {};
        return {
          ...room,
          devices: {
            ...room.devices,
            [deviceKey]: { ...device, isOn },
          },
        };
      })
    );
  };

  const handleAdjust = (roomId, key, newLevel) => {
    setRooms((prev) =>
      prev.map((room) => {
        if (room.id !== roomId) return room;
        if (key === 'light') {
          const current = room.devices.light || { isOn: false, level: 0 };
          return {
            ...room,
            devices: {
              ...room.devices,
              light: { ...current, level: Math.max(0, Math.min(100, newLevel)) },
            },
          };
        }
        return room;
      })
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Header />
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
      <BottomNav onPrimaryAction={() => Alert.alert('Thêm thiết bị', 'Tạo mới...')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1220', paddingTop: 24 },
  cardsRow: { paddingHorizontal: 12, paddingVertical: 12 },
});


