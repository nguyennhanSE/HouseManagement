import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import GreetingHeader from '../components/GreetingHeader';
import StatusCard from '../components/StatusCard';
import LightingModeSelector from '../components/LightingModeSelector';
import DashboardRoomCard from '../components/DashBoardRoomCard';
import BottomNav from '../components/BottomNav';

export default function RoomDashboardScreen() {
  const rooms = [
    { name: 'Phòng khách', type: 'living' },
    { name: 'Phòng ngủ', type: 'bedroom' },
    { name: 'Phòng bếp', type: 'kitchen' },
    { name: 'Phòng tắm', type: 'bathroom' },
  ];

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <GreetingHeader />

        <View style={styles.statusRow}>
          <StatusCard type="temperature" value="24" unit="°C" min={16} max={32} />
          <StatusCard type="electricity" value="68" unit="%" subValue="4.2 kWh" />
          <LightingModeSelector />
        </View>
        <View style={styles.roomList}>
          {rooms.map((room, index) => (
            <DashboardRoomCard key={index} room={room} />
          ))}
        </View>
      </ScrollView>
      <BottomNav onPrimaryAction={() => console.log('Primary action triggered!')} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#0d0f1a',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  roomList: {
    marginTop: 10,
  },
});
