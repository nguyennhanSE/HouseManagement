import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomNav from '../components/BottomNav';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.title}>🏠 Smart Home</Text>
        <Text style={styles.subtitle}>Welcome back!</Text>
        <Text style={styles.note}>
          Manage and monitor your smart house effortlessly.
        </Text>
      </View>

      <BottomNav onPrimaryAction={() => console.log('FAB pressed')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#10121A', justifyContent: 'space-between' },
  center: { alignItems: 'center', marginTop: 100 },
  title: { color: '#9FB3FF', fontSize: 32, fontWeight: 'bold' },
  subtitle: { color: '#DDE2FF', fontSize: 20, marginTop: 8 },
  note: { color: '#8187A1', fontSize: 14, marginTop: 8, textAlign: 'center', width: '80%' },
});
