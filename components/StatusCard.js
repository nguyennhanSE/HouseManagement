import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DEFAULT_ICON = 'information-circle-outline';

export default function StatusCard({ title, iconName = DEFAULT_ICON, value, unit, subValue }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Ionicons name={iconName} size={18} color="#6dd3ff" />
      </View>
      <Text style={styles.value}>
        {value}
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </Text>
      {subValue ? <Text style={styles.sub}>{subValue}</Text> : null}
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
    alignItems: 'center',
  },
  title: {
    color: '#C9CEFF',
    fontSize: 14,
    fontWeight: '600',
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
    marginLeft: 4,
  },
  sub: {
    color: '#6dd3ff',
    marginTop: 4,
    fontSize: 13,
  },
});
