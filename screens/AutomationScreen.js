import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch, Alert } from 'react-native';

const suggestionsMock = [
  { id: 's1', text: '"Dim lights at 9PM"' },
  { id: 's2', text: '"Set temperature to 22°C"' },
];

const logsMock = [
  { id: 'l1', time: '9:15 AM', text: 'Blinds opened' },
  { id: 'l2', time: '9:00 AM', text: 'Lights turned on' },
  { id: 'l3', time: '8:45 AM', text: 'Coffee started' },
  { id: 'l4', time: '8:30 AM', text: 'Thermostat set to 72°F' },
];

const scenesMock = [
  { id: 'c1', name: 'Relax Mode', icon: '🌙' },
  { id: 'c2', name: 'Clean Air', icon: '🌀' },
];

export default function AutomationScreen() {
  const [routineEnabled, setRoutineEnabled] = useState(true);
  const [movieMode, setMovieMode] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.powered}>Powered by</Text>

      {/* Central glowing hub */}
      <View style={styles.hubWrapper}>
        <View style={styles.hubGlow} />
        <View style={styles.hubCore}>
          <Text style={styles.hubIcon}>⚙️</Text>
        </View>
        <View style={[styles.beam, styles.beamLeft]} />
        <View style={[styles.beam, styles.beamTop]} />
        <View style={[styles.beam, styles.beamRight]} />
      </View>

      {/* Left card: Voice Suggestions */}
      <View style={[styles.card, styles.cardLeft]}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardIcon}>❓</Text>
          <Text style={styles.cardTitle}>Voice Suggestions</Text>
        </View>
        {suggestionsMock.map((s) => (
          <Pressable key={s.id} style={styles.itemRow} onPress={() => Alert.alert('Gợi ý', s.text)}>
            <Text style={styles.itemText}>{s.text}</Text>
          </Pressable>
        ))}
      </View>

      {/* Top card: Automation Logs */}
      <View style={[styles.card, styles.cardTop]}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardIcon}>🕘</Text>
          <Text style={styles.cardTitle}>Automation Logs</Text>
        </View>
        {logsMock.map((l) => (
          <View key={l.id} style={styles.logRow}>
            <Text style={styles.logTime}>{l.time}</Text>
            <Text style={styles.logText}>{l.text}</Text>
          </View>
        ))}
      </View>

      {/* Right card: Scene Recommendations */}
      <View style={[styles.card, styles.cardRight]}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardIcon}>🧠</Text>
          <Text style={styles.cardTitle}>Scene Recommendations</Text>
        </View>
        <View style={styles.sceneRow}>
          {scenesMock.map((c) => (
            <Pressable key={c.id} style={styles.sceneBtn} onPress={() => Alert.alert('Kích hoạt cảnh', c.name)}>
              <Text style={styles.sceneIcon}>{c.icon}</Text>
              <Text style={styles.sceneText}>{c.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Bottom area */}
      <View style={styles.bottomRow}>
        <View style={[styles.bottomCard, styles.bottomCardLeft]}>
          <Text style={styles.bottomTitle}>Good Morning Routine</Text>
          <Text style={styles.bottomSub}>Start your day with perfect ambiance</Text>
          <View style={styles.bulletRow}><Text style={styles.bullet}>•</Text><Text style={styles.bulletText}>Blinds Open</Text></View>
          <View style={styles.bulletRow}><Text style={styles.bullet}>•</Text><Text style={styles.bulletText}>Lights Warm</Text></View>
          <View style={styles.bulletRow}><Text style={styles.bullet}>•</Text><Text style={styles.bulletText}>AC Temp Adjust</Text></View>
          <View style={styles.bottomFooter}>
            <Text style={styles.bottomFooterText}>Auto Activate at 7:00 AM</Text>
            <Switch value={routineEnabled} onValueChange={(v) => setRoutineEnabled(v)} />
          </View>
        </View>

        <View style={[styles.bottomCard, styles.bottomCardRight]}>
          <View style={styles.rowBetween}>
            <Text style={styles.bottomTitle}>Movie Mode</Text>
            <Switch value={movieMode} onValueChange={(v) => setMovieMode(v)} />
          </View>
          <Text style={styles.bottomSub}>TV, lights dim, surround sound</Text>

          <View style={styles.secureCard}>
            <Text style={styles.secureTitle}>Secure House at Night</Text>
            <Text style={styles.secureSub}>Enable security protocols, lock all doors, dim external lights</Text>
            <Pressable style={styles.primaryBtn} onPress={() => Alert.alert('Bật chế độ bảo vệ', 'Đã kích hoạt mô phỏng') }>
              <Text style={styles.primaryBtnText}>Activate Now</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const bg = '#0F1220';
const glass = '#FFFFFF1A';
const textMain = '#E9ECFF';
const textMuted = '#AEB7FF';
const accent = '#6B7BFF';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' },
  powered: { position: 'absolute', top: 110, color: textMuted, fontSize: 12 },

  hubWrapper: { width: 220, height: 220, borderRadius: 110, alignItems: 'center', justifyContent: 'center' },
  hubGlow: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    backgroundColor: accent, opacity: 0.25, shadowColor: accent, shadowOpacity: 0.9,
    shadowRadius: 40,
  },
  hubCore: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#7F5CFF', alignItems: 'center', justifyContent: 'center' },
  hubIcon: { fontSize: 36, color: 'white' },
  beam: { position: 'absolute', width: 140, height: 2, backgroundColor: '#7F5CFF', opacity: 0.6 },
  beamLeft: { left: -140, top: 110 },
  beamTop: { top: -20, transform: [{ rotate: '90deg' }], left: 40 },
  beamRight: { right: -140, top: 110 },

  card: { position: 'absolute', backgroundColor: glass, borderRadius: 14, padding: 12, width: 220 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardIcon: { marginRight: 8, color: textMuted },
  cardTitle: { color: textMain, fontWeight: '600' },
  itemRow: { backgroundColor: '#FFFFFF22', padding: 10, borderRadius: 8, marginTop: 8 },
  itemText: { color: textMain, fontSize: 12 },
  logRow: { flexDirection: 'row', marginTop: 6 },
  logTime: { width: 64, color: textMuted, fontSize: 11 },
  logText: { color: textMain, fontSize: 12 },
  sceneRow: { flexDirection: 'row', marginTop: 8 },
  sceneBtn: { flex: 1, backgroundColor: '#FFFFFF22', borderRadius: 10, padding: 12, alignItems: 'center', marginRight: 8 },
  sceneIcon: { fontSize: 18, marginBottom: 6 },
  sceneText: { color: textMain, fontSize: 12 },

  cardLeft: { left: 24, top: 220 },
  cardTop: { top: 80, right: 90 },
  cardRight: { right: 24, top: 240 },

  bottomRow: { position: 'absolute', bottom: 24, left: 16, right: 16, flexDirection: 'row' },
  bottomCard: { flex: 1, backgroundColor: glass, borderRadius: 16, padding: 14 },
  bottomCardLeft: { marginRight: 10 },
  bottomCardRight: { marginLeft: 10 },
  bottomTitle: { color: textMain, fontWeight: '700' },
  bottomSub: { color: textMuted, fontSize: 12, marginTop: 4, marginBottom: 8 },
  bulletRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  bullet: { color: '#FFD166', marginRight: 6 },
  bulletText: { color: textMain, fontSize: 12 },
  bottomFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  bottomFooterText: { color: textMuted, fontSize: 12 },

  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  secureCard: { backgroundColor: '#FFFFFF1F', borderRadius: 14, padding: 12, marginTop: 14 },
  secureTitle: { color: textMain, fontWeight: '700' },
  secureSub: { color: textMuted, fontSize: 12, marginVertical: 6 },
  primaryBtn: { backgroundColor: accent, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  primaryBtnText: { color: 'white', fontWeight: '700' },
});


