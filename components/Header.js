import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function Header() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Phòng của tôi</Text>
        <Text style={styles.subtitle}>Quản lý các phòng riêng</Text>
      </View>
      <View style={styles.actions}>
        <Pressable style={styles.iconBtn}><Text style={styles.iconText}>⚙️</Text></Pressable>
        <Pressable style={styles.iconBtn}><Text style={styles.iconText}>🔔</Text></Pressable>
        <View style={styles.avatar}><Text style={styles.avatarText}>AB</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
  },
  title: { color: '#E9ECFF', fontSize: 20, fontWeight: '700' },
  subtitle: { color: '#C9CEFF', fontSize: 12, marginTop: 4 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: {
    backgroundColor: '#FFFFFF22',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  iconText: { color: '#fff' },
  avatar: {
    marginLeft: 8,
    backgroundColor: '#6B7BFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#9FB3FF',
  },
  avatarText: { color: '#E9ECFF', fontWeight: '700' },
});


