import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DashBoardRoomCard from './DashBoardRoomCard';

export default function RoomGrid() {
  const rooms = [
    { name: 'Phòng khách', devices: 4, temp: 23, alarm: 'On' },
    { name: 'Phòng ngủ', devices: 3, temp: 21, alarm: 'On' },
    { name: 'Nhà bếp', devices: 5, temp: 24, alarm: 'On' },
    { name: 'Phòng tắm', devices: 2, temp: 25, alarm: 'On' },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Kiểm soát phòng</Text>
      <View style={styles.grid}>
        {rooms.map((room, idx) => (
          <DashBoardRoomCard key={idx} {...room} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 16,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
