import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function GreetingHeader() {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentDate = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric'
  });

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Xin chào, [Tên]</Text>
        <Text style={styles.subtitle}>Chào mừng đến nhà thông minh của bạn</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.time}>{currentTime}</Text>
        <Text style={styles.date}>{currentDate}</Text>
        <Image source={require('../assets/avatar.png')} style={styles.avatar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    color: '#999',
    fontSize: 13,
    marginTop: 4,
  },
  right: {
    alignItems: 'flex-end',
  },
  time: {
    color: '#fff',
    fontSize: 16,
  },
  date: {
    color: '#888',
    fontSize: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginTop: 6,
  },
});
