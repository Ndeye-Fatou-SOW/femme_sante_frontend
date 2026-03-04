import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCycles, addCycle, fetchStats } from '../store/slices/cycleSlice';
import { COLORS, SIZES } from '../constants/theme';

export default function CycleScreen() {
  const dispatch = useDispatch();
  const { cycles, stats, loading } = useSelector((s) => s.cycle);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    flow_intensity: 'medium',
    notes: '',
  });

  useEffect(() => {
    dispatch(fetchCycles());
    dispatch(fetchStats());
  }, []);

  const handleAdd = () => {
    if (!form.start_date) {
      Alert.alert('Erreur', 'La date de début est obligatoire.');
      return;
    }
    dispatch(addCycle(form)).then(() => {
      setModalVisible(false);
      dispatch(fetchStats());
      Alert.alert('✅ Succès', 'Cycle enregistré !');
    });
  };

  const FLOW_LABELS = {
    light: '🩸 Léger', medium: '🩸🩸 Moyen',
    heavy: '🩸🩸🩸 Abondant', very_heavy: '🩸🩸🩸🩸 Très abondant',
  };

  const PHASE_COLORS = {
    menstruelle: '#EF9A9A', folliculaire: '#A5D6A7',
    ovulation: '#FFF59D', 'lutéale': '#CE93D8',
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>

        {/* Statistiques */}
        {stats && (
          <View style={styles.statsCard}>
            <Text style={styles.cardTitle}>📊 Mes statistiques</Text>
            <View style={styles.row}>
              <View style={styles.statBox}>
                <Text style={styles.statNum}>{stats.duree_cycle_moyenne || 28}j</Text>
                <Text style={styles.statLbl}>Cycle moyen</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNum}>{stats.duree_regles_moyenne || 5}j</Text>
                <Text style={styles.statLbl}>Règles moyenne</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNum}>{stats.total_cycles_enregistres || 0}</Text>
                <Text style={styles.statLbl}>Cycles</Text>
              </View>
            </View>
          </View>
        )}

        {/* Légende des phases */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📅 Phases du cycle</Text>
          {[
            { phase: 'menstruelle', label: 'Menstruelle (J1-5)' },
            { phase: 'folliculaire', label: 'Folliculaire (J6-13)' },
            { phase: 'ovulation', label: 'Ovulation (J14-16)' },
            { phase: 'lutéale', label: 'Lutéale (J17-28)' },
          ].map((p) => (
            <View key={p.phase} style={styles.phaseRow}>
              <View style={[styles.phaseDot, { backgroundColor: PHASE_COLORS[p.phase] }]} />
              <Text style={styles.phaseLabel}>{p.label}</Text>
            </View>
          ))}
        </View>

        {/* Liste des cycles */}
        <Text style={styles.sectionTitle}>Mes cycles</Text>
        {loading && <ActivityIndicator color={COLORS.primary} />}
        {cycles.length === 0 && !loading && (
          <View style={styles.emptyBox}>
            <Text style={{ fontSize: 40, textAlign: 'center' }}>🩸</Text>
            <Text style={{ textAlign: 'center', color: COLORS.gray, marginTop: 8 }}>
              Aucun cycle enregistré.{'\n'}Appuie sur le bouton + pour commencer.
            </Text>
          </View>
        )}
        {cycles.map((cycle) => (
          <View key={cycle.id} style={styles.cycleCard}>
            <View style={styles.row}>
              <Text style={styles.cycleDate}>
                {new Date(cycle.start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </Text>
              {cycle.current_phase && (
                <View style={[styles.phaseBadge, { backgroundColor: PHASE_COLORS[cycle.current_phase] || '#EEE' }]}>
                  <Text style={{ fontSize: 11, fontWeight: '600' }}>{cycle.current_phase}</Text>
                </View>
              )}
            </View>
            <Text style={{ color: COLORS.gray, marginTop: 4 }}>
              {FLOW_LABELS[cycle.flow_intensity]} {cycle.duration_days ? `· ${cycle.duration_days} jours` : ''}
            </Text>
            {cycle.cycle_length && <Text style={{ color: COLORS.gray, fontSize: 13 }}>Cycle de {cycle.cycle_length} jours</Text>}
          </View>
        ))}
      </ScrollView>

      {/* Bouton Ajouter */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={{ color: 'white', fontSize: 28 }}>+</Text>
      </TouchableOpacity>

      {/* Modal Ajout Cycle */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>🩸 Nouveau cycle</Text>

            <Text style={styles.label}>Date de début *</Text>
            <TextInput
              style={styles.input}
              value={form.start_date}
              onChangeText={(v) => setForm({ ...form, start_date: v })}
              placeholder="AAAA-MM-JJ"
            />

            <Text style={styles.label}>Date de fin</Text>
            <TextInput
              style={styles.input}
              value={form.end_date}
              onChangeText={(v) => setForm({ ...form, end_date: v })}
              placeholder="AAAA-MM-JJ (optionnel)"
            />

            <Text style={styles.label}>Intensité du flux</Text>
            <View style={styles.row}>
              {['light', 'medium', 'heavy', 'very_heavy'].map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[styles.flowBtn, form.flow_intensity === f && styles.flowBtnActive]}
                  onPress={() => setForm({ ...form, flow_intensity: f })}
                >
                  <Text style={{ fontSize: 11, fontWeight: form.flow_intensity === f ? 'bold' : 'normal' }}>
                    {f === 'light' ? 'Léger' : f === 'medium' ? 'Moyen' : f === 'heavy' ? 'Abondant' : 'Très'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              value={form.notes}
              onChangeText={(v) => setForm({ ...form, notes: v })}
              placeholder="Comment tu te sens ?"
              multiline
            />

            <View style={styles.row}>
              <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={() => setModalVisible(false)}>
                <Text style={{ color: COLORS.gray }}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnSave]} onPress={handleAdd} disabled={loading}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  statsCard: { backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16, marginBottom: 12, elevation: 3 },
  card: { backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16, marginBottom: 12, elevation: 2 },
  cardTitle: { fontSize: 13, fontWeight: '700', color: COLORS.gray, textTransform: 'uppercase', marginBottom: 12 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statBox: { flex: 1, alignItems: 'center', padding: 8 },
  statNum: { fontSize: 26, fontWeight: 'bold', color: COLORS.primary },
  statLbl: { fontSize: 12, color: COLORS.gray, textAlign: 'center' },
  phaseRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  phaseDot: { width: 16, height: 16, borderRadius: 8, marginRight: 10 },
  phaseLabel: { fontSize: 14, color: COLORS.text },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 10, marginTop: 4 },
  emptyBox: { backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 30, elevation: 2 },
  cycleCard: { backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16, marginBottom: 10, elevation: 2 },
  cycleDate: { fontSize: 15, fontWeight: 'bold', color: COLORS.text, flex: 1 },
  phaseBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  fab: {
    position: 'absolute', right: 20, bottom: 20, backgroundColor: COLORS.primary,
    width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', elevation: 6,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary, marginBottom: 16, textAlign: 'center' },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6, marginTop: 10 },
  input: {
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: SIZES.radius,
    padding: 12, fontSize: 14, backgroundColor: COLORS.lightGray,
  },
  flowBtn: {
    flex: 1, padding: 8, borderRadius: 8, borderWidth: 1.5,
    borderColor: COLORS.border, alignItems: 'center',
  },
  flowBtnActive: { borderColor: COLORS.primary, backgroundColor: '#FCE4EC' },
  btn: { flex: 1, padding: 14, borderRadius: SIZES.radius, alignItems: 'center', marginTop: 16 },
  btnCancel: { backgroundColor: COLORS.lightGray },
  btnSave: { backgroundColor: COLORS.primary, marginLeft: 8 },
});