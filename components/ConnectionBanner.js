import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const STATUS_COPY = {
  connecting: 'Connecting to MQTT server…',
  disconnected: 'Connection lost. Attempting to reconnect…',
};

export default function ConnectionBanner({ status, lastError, onRetry, nextRetryIn }) {
  if (!status || status === 'connected') {
    return null;
  }

  const message = STATUS_COPY[status] || 'Connection status updating…';

  return (
    <View style={[styles.container, status === 'disconnected' ? styles.disconnected : styles.connecting]}>
      <View style={styles.textContainer}>
        <Text style={styles.message}>{message}</Text>
        {lastError ? <Text style={styles.subtext}>{lastError}</Text> : null}
        {nextRetryIn != null ? (
          <Text style={styles.subtext}>Retrying in {Math.max(nextRetryIn, 0)}s</Text>
        ) : null}
      </View>
      {onRetry ? (
        <Pressable onPress={onRetry} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2133',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    color: '#E9ECFF',
    fontWeight: '600',
    fontSize: 14,
  },
  subtext: {
    color: '#AEB7FF',
    fontSize: 12,
    marginTop: 4,
  },
  retryButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#6B7BFF',
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  connecting: {
    borderWidth: 1,
    borderColor: '#6B7BFF55',
  },
  disconnected: {
    borderWidth: 1,
    borderColor: '#FF6B6B55',
    backgroundColor: '#2A1F26',
  },
});


