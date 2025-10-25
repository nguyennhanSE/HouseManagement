import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';

export default function LightingModeSelector() {
  const [expanded, setExpanded] = useState(false);
  const [selectedMode, setSelectedMode] = useState('thoaiMai');

  const animation = useRef(new Animated.Value(0)).current;

  const modes = [
    { key: 'thoaiMai', label: 'Thoải mái' },
    { key: 'congViec', label: 'Công việc' },
    { key: 'denDem', label: 'Đèn đêm' },
  ];

  const toggleExpand = () => {
    setExpanded(!expanded);
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 180],
  });

  return (
    <Animated.View style={[styles.container, { height: heightInterpolate }]}>
      <TouchableOpacity onPress={toggleExpand} activeOpacity={0.8}>
        <Text style={styles.title}>Loại đèn</Text>
        <View style={styles.selectedBox}>
          <Text style={styles.selectedText}>
            {
              modes.find((mode) => mode.key === selectedMode)?.label ||
              'Chọn chế độ'
            }
          </Text>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expandedArea}>
          {modes.map((mode) => (
            <TouchableOpacity
              key={mode.key}
              style={[
                styles.optionButton,
                selectedMode === mode.key && styles.activeOption,
              ]}
              onPress={() => {
                setSelectedMode(mode.key);
                toggleExpand(); 
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedMode === mode.key && styles.activeOptionText,
                ]}
              >
                {mode.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 6,
    overflow: 'hidden',
  },
  title: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 6,
    fontWeight: '600',
  },
  selectedBox: {
    backgroundColor: '#2A2A3C',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  selectedText: {
    color: '#fff',
    fontSize: 14,
  },
  expandedArea: {
    marginTop: 12,
  },
  optionButton: {
    backgroundColor: '#2A2A3C',
    borderRadius: 10,
    paddingVertical: 8,
    marginTop: 6,
    alignItems: 'center',
  },
  optionText: {
    color: '#bbb',
  },
  activeOption: {
    backgroundColor: '#7C3AED',
  },
  activeOptionText: {
    color: '#fff',
  },
});
