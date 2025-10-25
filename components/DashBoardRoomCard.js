import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Switch,
} from 'react-native';
import Slider from '@react-native-community/slider';

export default function DashboardRoomCard({ room }) {
  if (!room) return null;

  const [expanded, setExpanded] = useState(false);
  const [light, setLight] = useState(70);
  const [temp, setTemp] = useState(24);
  const [security, setSecurity] = useState(true);

  const anim = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    const toValue = expanded ? 0 : 1;
    setExpanded(!expanded);
    Animated.timing(anim, {
      toValue,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const height = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [120, 420],
  });

  const opacity = anim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <Animated.View style={[styles.card, { height }]}>
      <TouchableOpacity onPress={toggleExpand} activeOpacity={0.8}>
        <Text style={styles.roomName}>{room.name || 'Phòng chưa đặt tên'}</Text>
        {!expanded && (
          <Text style={styles.summary}>
            💡 {light}% • 🌡️ {temp}°C • {security ? '🔒 Bảo vệ' : '🔓 Mở'}
          </Text>
        )}
      </TouchableOpacity>

      {expanded && (
        <Animated.View style={[styles.detailContainer, { opacity }]}>
          <View style={styles.section}>
            <Text style={styles.label}>💡 Độ sáng: {light}%</Text>
            <Slider
              value={light}
              onValueChange={setLight}
              minimumValue={0}
              maximumValue={100}
              step={1}
              minimumTrackTintColor="#6B7BFF"
              thumbTintColor="#6B7BFF"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>🌡️ Nhiệt độ: {temp}°C</Text>
            <Slider
              value={temp}
              onValueChange={setTemp}
              minimumValue={16}
              maximumValue={32}
              step={1}
              minimumTrackTintColor="#6B7BFF"
              thumbTintColor="#6B7BFF"
            />
          </View>

          <View style={styles.sectionRow}>
            <Text style={styles.label}>🔐 Bảo vệ:</Text>
            <Switch
              value={security}
              onValueChange={setSecurity}
              thumbColor={security ? '#6B7BFF' : '#aaa'}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Thiết bị:</Text>
            {room.type === 'bedroom' && <Text style={styles.device}>🌀 Điều hòa</Text>}
            {room.type === 'kitchen' && <Text style={styles.device}>🥶 Tủ lạnh</Text>}
            {room.type === 'living' && <Text style={styles.device}>📺 TV</Text>}
            {room.type === 'bathroom' && <Text style={styles.device}>🚿 Máy nước nóng</Text>}
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionText}>📷 Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.alertBtn]}>
              <Text style={styles.actionText}>🚨 Báo động</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={toggleExpand}>
            <Text style={styles.closeText}>Đóng</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1C1C2A',
    borderRadius: 16,
    marginVertical: 10,
    padding: 16,
    overflow: 'hidden',
  },
  roomName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  summary: {
    color: '#AAB2FF',
    fontSize: 13,
    marginTop: 4,
  },
  detailContainer: {
    marginTop: 10,
  },
  section: {
    marginVertical: 10,
  },
  sectionRow: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: '#E9ECFF',
    marginBottom: 6,
    fontSize: 15,
  },
  device: {
    color: '#AEB7FF',
    marginLeft: 8,
    fontSize: 14,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  actionBtn: {
    backgroundColor: '#2A2A3C',
    paddingVertical: 10,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  alertBtn: {
    backgroundColor: '#6B7BFF',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
  closeText: {
    color: '#9FB3FF',
    textAlign: 'center',
    marginTop: 8,
  },
});
