import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView } from 'react-native';

import ConnectionBanner from './ConnectionBanner';
import { useConnection } from '../contexts/ConnectionContext';

export default function BaseScreen({
  title,
  children,
  headerRight,
  scrollable = false,
  contentStyle,
  testID,
}) {
  const { status, lastError, retry, nextRetryIn } = useConnection();

  const Container = scrollable ? ScrollView : View;
  const containerProps = scrollable
    ? { contentContainerStyle: [styles.scrollContent, contentStyle] }
    : { style: [styles.content, contentStyle] };

  return (
    <SafeAreaView style={styles.safe} testID={testID}>
      <ConnectionBanner
        status={status}
        lastError={lastError}
        onRetry={retry}
        nextRetryIn={nextRetryIn}
      />

      {(title || headerRight) && (
        <View style={styles.header}>
          {title ? <Text style={styles.title}>{title}</Text> : <View />}
          {headerRight ? <View style={styles.headerRight}>{headerRight}</View> : <View style={styles.headerSpacer} />}
        </View>
      )}

      <Container {...containerProps}>{children}</Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0D0F1A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  title: {
    color: '#E9ECFF',
    fontSize: 20,
    fontWeight: '700',
  },
  headerRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
});


