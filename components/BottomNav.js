import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BottomNav({ onPrimaryAction }) {
  const navigation = useNavigation(); 

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Pressable style={styles.navBtn} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.icon}>🏠</Text>
        </Pressable>

        <Pressable style={styles.navBtn} onPress={() => navigation.navigate('Automation')}>
          <Text style={styles.icon}>⚙️</Text>
        </Pressable>

        <View style={styles.spacer} />

        <Pressable style={styles.navBtn} onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.icon}>📊</Text>
        </Pressable>

        <Pressable style={styles.navBtn} onPress={() => navigation.navigate('Rooms')}>
          <Text style={styles.icon}>👤</Text>
        </Pressable>
      </View>

      <Pressable style={styles.fab} onPress={onPrimaryAction}>
        <Text style={styles.fabText}>＋</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 8 },
  container: {
    backgroundColor: '#1B1D2A',
    borderRadius: 16,
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { color: '#DDE2FF', fontSize: 18 },
  spacer: { width: 44 },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 64,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B7BFF',
    borderWidth: 1,
    borderColor: '#9FB3FF',
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 28 },
});
