import React from 'react';
import { View, Text, StyleSheet, Switch, Pressable } from 'react-native';

export default function RoomCard({ room, onToggleDevice, onAdjust }) {
  const { name, icon, devices } = room;
  const light = devices.light;
  const hasAC = Boolean(devices.ac);
  const hasFan = Boolean(devices.fan);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.icon}>{icon}</Text>

      {light && (
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Light</Text>
            <Text style={styles.value}>{light.level}%</Text>
          </View>
          <View style={styles.rowBetween}>
            <View style={styles.dimmerCircle}>
              <Text style={styles.dimmerText}>{light.level}%</Text>
            </View>
            <Switch
              value={light.isOn}
              onValueChange={(v) => onToggleDevice(room.id, 'light', v)}
            />
          </View>
          <View style={styles.rowBetween}>
            <Pressable
              style={styles.adjustBtn}
              onPress={() => onAdjust(room.id, 'light', Math.max(0, light.level - 5))}
            >
              <Text style={styles.adjustText}>-</Text>
            </Pressable>
            <Pressable
              style={styles.adjustBtn}
              onPress={() => onAdjust(room.id, 'light', Math.min(100, light.level + 5))}
            >
              <Text style={styles.adjustText}>+</Text>
            </Pressable>
          </View>
        </View>
      )}

      {hasAC && (
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <Text style={styles.emoji}>❄️</Text>
              <Text style={styles.label}>AC</Text>
            </View>
            <Switch
              value={devices.ac.isOn}
              onValueChange={(v) => onToggleDevice(room.id, 'ac', v)}
            />
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.subtle}>Temperature</Text>
            <Text style={styles.value}>{devices.ac.temperature}°C</Text>
          </View>
        </View>
      )}

      {hasFan && (
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <Text style={styles.emoji}>➕</Text>
              <Text style={styles.label}>Fan</Text>
            </View>
            <Switch
              value={devices.fan.isOn}
              onValueChange={(v) => onToggleDevice(room.id, 'fan', v)}
            />
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.subtle}>Speed</Text>
            <Text style={styles.value}>{devices.fan.speed}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 260,
    backgroundColor: '#4A5CFF22',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 10,
  },
  title: { fontSize: 20, color: 'white', fontWeight: '600', marginBottom: 8 },
  icon: { fontSize: 36, alignSelf: 'center', marginBottom: 8 },
  section: {
    backgroundColor: '#FFFFFF22',
    borderRadius: 16,
    padding: 12,
    marginTop: 10,
  },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { color: '#E9ECFF', fontSize: 14 },
  subtle: { color: '#C9CEFF', fontSize: 12 },
  value: { color: '#7FD6FF', fontSize: 12 },
  dimmerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dimmerText: { color: '#fff', fontWeight: '600' },
  adjustBtn: {
    backgroundColor: '#FFFFFF33',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  adjustText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  emoji: { marginRight: 6 },
});


