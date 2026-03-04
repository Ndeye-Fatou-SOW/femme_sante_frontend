import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput
} from 'react-native';
import api from '../services/api';
import { ENDPOINTS } from '../constants/api';
import { COLORS, SIZES } from '../constants/theme';

export default function LogScreen() {
  const [log, setLog] = useState(null);
  const [saving, setSaving] = useState(false);

  const defaultLog = {
    mood: null, energy_level: 5, stress_level: 5, sleep_hours: 7,
    water_intake: 1.5, physical_activity: 0, basal_temperature: null, notes: '',
  };
  const [form, setForm] = useState(defaultLog);

  useEffect(() => { loadTodayLog(); }, []);

  const loadTodayLog = async () => {
    try {
      const res = await api.get(ENDPOINTS.LOG_TODAY);
      setLog(res.data);
      setForm({ ...defaultLog, ...res.data });
    } catch {}
  };

  const save = async () => {
    setSaving(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      if (log?.id) {
        await api.patch(`${ENDPOINTS.LOGS}${log.id}/`, form);
      } else {
        await api.post(ENDPOINTS.LOGS, { ...form, date: today });
      }
      Alert.alert('✅', 'Journal enregistré !');
      loadTodayLog();
    } catch {
      Alert.alert('Erreur', 'Impossible d\'enregistrer.');
    }
    setSaving(false);
  };

  const MOODS = [
    { key: 'great', emoji: '😄', label: 'Super' },
    { key: 'good', emoji: '😊', label: 'Bien' },
    { key: 'neutral', emoji: '😐', label: 'Neutre' },
    { key: 'bad', emoji: '😔', label: 'Pas bien' },
    { key: 'terrible', emoji: '😢', label: 'Mal' },
  ];

  const Slider = ({ label, value, field, min, max, step = 1, unit = '' }) => (
    <View style={{ marginBottom: 16 }}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}{unit}</Text>
      </View>
      <View style={styles.sliderRow}>
        <TouchableOpacity onPress={() => setForm({ ...form, [field]: Math.max(min, value - step) })} style={styles.arrowBtn}>
          <Text style={styles.arrow}>−</Text>
        </TouchableOpacity>
        <View style={styles.sliderBar}>
          <View style={[styles.sliderFill, { width: `${((value - min) / (max - min)) * 100}%` }]} />
        </View>
        <TouchableOpacity onPress={() => setForm({ ...form, [field]: Math.min(max, value + step) })} style={styles.arrowBtn}>
          <Text style={styles.arrow}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Text style={styles.headerDate}>
        {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
      </Text>

      {/* Humeur */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Comment tu te sens ?</Text>
        <View style={[styles.row, { justifyContent: 'space-between' }]}>
          {MOODS.map((m) => (
            <TouchableOpacity
              key={m.key}
              style={[styles.moodBtn, form.mood === m.key && styles.moodBtnActive]}
              onPress={() => setForm({ ...form, mood: m.key })}
            >
              <Text style={{ fontSize: 28 }}>{m.emoji}</Text>
              <Text style={{ fontSize: 10, color: COLORS.gray, textAlign: 'center' }}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sliders */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Ton état du jour</Text>
        <Slider label="⚡ Énergie" value={form.energy_level} field="energy_level" min={1} max={10} />
        <Slider label="😤 Stress" value={form.stress_level} field="stress_level" min={1} max={10} />
        <Slider label="😴 Sommeil" value={form.sleep_hours} field="sleep_hours" min={0} max={12} step={0.5} unit="h" />
        <Slider label="💧 Eau" value={form.water_intake} field="water_intake" min={0} max={4} step={0.25} unit="L" />
        <Slider label="🏃 Activité" value={form.physical_activity} field="physical_activity" min={0} max={120} step={5} unit="min" />
      </View>

      {/* Notes */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📝 Notes personnelles</Text>
        <TextInput
          style={styles.textarea}
          value={form.notes}
          onChangeText={(v) => setForm({ ...form, notes: v })}
          placeholder="Comment s'est passée ta journée ? Symptômes particuliers ?"
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={saving}>
        <Text style={styles.saveBtnText}>{saving ? 'Enregistrement...' : '💾 Enregistrer le journal'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerDate: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, marginBottom: 16, textTransform: 'capitalize' },
  card: { backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16, marginBottom: 12, elevation: 2 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 14 },
  row: { flexDirection: 'row', alignItems: 'center' },
  label: { flex: 1, fontSize: 14, color: COLORS.text },
  value: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  sliderRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 10 },
  arrowBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  arrow: { fontSize: 20, color: COLORS.white, fontWeight: 'bold' },
  sliderBar: {
    flex: 1, height: 10, backgroundColor: COLORS.lightGray,
    borderRadius: 5, overflow: 'hidden',
  },
  sliderFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 5 },
  moodBtn: { alignItems: 'center', padding: 8, borderRadius: 12, flex: 1 },
  moodBtnActive: { backgroundColor: '#FCE4EC' },
  textarea: {
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: SIZES.radius,
    padding: 12, fontSize: 14, backgroundColor: COLORS.lightGray,
    minHeight: 100, textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radius,
    padding: 16, alignItems: 'center', marginTop: 8,
  },
  saveBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});