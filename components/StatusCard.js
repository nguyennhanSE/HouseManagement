import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function StatusCard({ type, value, unit, subValue, min, max }) {
  const icon = type === 'temperature' ? 'thermometer' : 'flash';
  const title = type === 'temperature' ? 'Nhiệt độ' : 'Tiêu thụ điện';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Ionicons name={icon} size={18} color="#6dd3ff" />
      </View>
      <Text style={styles.value}>{value}<Text style={styles.unit}>{unit}</Text></Text>
      {subValue && <Text style={styles.sub}>{subValue}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1c27',
    borderRadius: 16,
    padding: 16,
    width: '31%',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: '#aaa',
    fontSize: 14,
  },
  value: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginTop: 4,
  },
  unit: {
    color: '#aaa',
    fontSize: 14,
  },
  sub: {
    color: '#6dd3ff',
    marginTop: 4,
    fontSize: 13,
  },
});
