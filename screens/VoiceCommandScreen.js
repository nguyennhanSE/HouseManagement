import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';

import BaseScreen from '../components/BaseScreen';
import { useCommands } from '../contexts/CommandContext';

const VALIDATION_STATES = {
  IDLE: 'idle',
  LISTENING: 'listening',
  PROCESSING: 'processing',
  VALID: 'valid',
  NOT_RECOGNIZED: 'not_recognized',
  INVALID_COMMAND: 'invalid_command',
  ERROR: 'error',
};

export default function VoiceCommandScreen() {
  const { history, pending, executeCommand } = useCommands();
  const [validationState, setValidationState] = useState(VALIDATION_STATES.IDLE);
  const [transcript, setTranscript] = useState('');
  const [lastResult, setLastResult] = useState(null);

  const handleSimulateVoiceCommand = () => {
    setValidationState(VALIDATION_STATES.LISTENING);
    setTranscript('');

    setTimeout(() => {
      setTranscript('Turn on living room lights');
      setValidationState(VALIDATION_STATES.PROCESSING);

      setTimeout(() => {
        const isValid = Math.random() > 0.3;
        if (!isValid) {
          const isNotRecognized = Math.random() > 0.5;
          setValidationState(
            isNotRecognized ? VALIDATION_STATES.NOT_RECOGNIZED : VALIDATION_STATES.INVALID_COMMAND
          );
          setLastResult({
            success: false,
            message: isNotRecognized ? 'Speech not recognized. Please try again.' : 'Invalid command. Please try again.',
          });
          return;
        }

        setValidationState(VALIDATION_STATES.VALID);
        setLastResult({ success: true, message: 'Light turned on' });

        executeCommand({
          type: 'VoiceControlCommand',
          deviceId: 'voice:simulated',
          payload: { transcript: 'Turn on living room lights' },
        });

        setTimeout(() => {
          setValidationState(VALIDATION_STATES.IDLE);
          setTranscript('');
          setLastResult(null);
        }, 2000);
      }, 800);
    }, 500);
  };

  return (
    <BaseScreen
      title="Voice Control"
      headerRight={
        pending.length ? <Text style={styles.pendingText}>{pending.length} processing</Text> : null
      }
      scrollable
      contentStyle={styles.scrollContent}
    >
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Hold to speak</Text>
        <Text style={styles.heroSub}>We'll transcribe, validate, and dispatch your intent.</Text>
        <Pressable
          style={[
            styles.micButton,
            validationState === VALIDATION_STATES.LISTENING && styles.micButtonListening,
            validationState === VALIDATION_STATES.PROCESSING && styles.micButtonProcessing,
          ]}
          onPress={handleSimulateVoiceCommand}
          disabled={validationState === VALIDATION_STATES.LISTENING || validationState === VALIDATION_STATES.PROCESSING}
        >
          <Text style={styles.micIcon}>🎙️</Text>
          <Text style={styles.micText}>
            {validationState === VALIDATION_STATES.LISTENING
              ? 'Listening...'
              : validationState === VALIDATION_STATES.PROCESSING
              ? 'Processing...'
              : 'Simulate Voice Command'}
          </Text>
        </Pressable>

        {transcript ? (
          <View style={styles.transcriptCard}>
            <Text style={styles.transcriptLabel}>Transcript:</Text>
            <Text style={styles.transcriptText}>{transcript}</Text>
          </View>
        ) : null}

        {validationState === VALIDATION_STATES.VALID && lastResult?.success ? (
          <View style={styles.resultCard}>
            <Text style={styles.resultTextSuccess}>{lastResult.message}</Text>
          </View>
        ) : null}

        {validationState === VALIDATION_STATES.NOT_RECOGNIZED ||
        validationState === VALIDATION_STATES.INVALID_COMMAND ? (
          <View style={styles.resultCard}>
            <Text style={styles.resultTextError}>{lastResult?.message || 'Error occurred'}</Text>
            <Pressable style={styles.retryButton} onPress={handleSimulateVoiceCommand}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      <Text style={styles.sectionTitle}>Recent voice intents</Text>
      <ScrollView style={styles.historyScroll} contentContainerStyle={styles.historyContent}>
        {history.length === 0 ? (
          <Text style={styles.emptyState}>No commands captured yet.</Text>
        ) : (
          history.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyType}>{item.type}</Text>
                <Text style={[styles.historyStatus, styles[`status_${item.status}`] || styles.status_default]}>
                  {item.status}
                </Text>
              </View>
              <Text style={styles.historyPayload}>{JSON.stringify(item.payload)}</Text>
              <Text style={styles.historyTimestamp}>{item.issuedAt}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 24,
  },
  heroCard: {
    backgroundColor: '#1B1D2A',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  heroTitle: {
    color: '#E9ECFF',
    fontSize: 18,
    fontWeight: '700',
  },
  heroSub: {
    color: '#AEB7FF',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
  },
  micButton: {
    marginTop: 18,
    backgroundColor: '#6B7BFF',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  micButtonListening: {
    backgroundColor: '#FFD166',
  },
  micButtonProcessing: {
    backgroundColor: '#9FB3FF',
  },
  transcriptCard: {
    marginTop: 16,
    backgroundColor: '#151723',
    padding: 12,
    borderRadius: 12,
    width: '100%',
  },
  transcriptLabel: {
    color: '#AEB7FF',
    fontSize: 12,
    marginBottom: 6,
  },
  transcriptText: {
    color: '#E9ECFF',
    fontSize: 14,
    fontWeight: '600',
  },
  resultCard: {
    marginTop: 12,
    backgroundColor: '#151723',
    padding: 12,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  resultTextSuccess: {
    color: '#6BD0A5',
    fontSize: 14,
    fontWeight: '600',
  },
  resultTextError: {
    color: '#FF7A7A',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: '#6B7BFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  micIcon: {
    fontSize: 20,
  },
  micText: {
    color: '#fff',
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#E9ECFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  historyScroll: {
    maxHeight: 280,
  },
  historyContent: {
    gap: 12,
  },
  historyCard: {
    backgroundColor: '#151723',
    borderRadius: 12,
    padding: 14,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  historyType: {
    color: '#E9ECFF',
    fontWeight: '600',
  },
  historyStatus: {
    color: '#AEB7FF',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  status_acknowledged: {
    color: '#6BD0A5',
  },
  status_pending: {
    color: '#FFD166',
  },
  status_default: {
    color: '#AEB7FF',
  },
  historyPayload: {
    color: '#C9CEFF',
    fontSize: 12,
    lineHeight: 16,
  },
  historyTimestamp: {
    color: '#6D728A',
    fontSize: 11,
    marginTop: 4,
  },
  emptyState: {
    color: '#AEB7FF',
    fontSize: 13,
  },
  pendingText: {
    color: '#FFD166',
    fontSize: 12,
    fontWeight: '600',
  },
});


