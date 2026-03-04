import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import api from '../services/api';
import { ENDPOINTS } from '../constants/api';
import { COLORS, SIZES } from '../constants/theme';

export default function MedicalScreen() {
  const [consultations, setConsultations] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ date: '', doctor_name: '', specialty: '', reason: '', notes: '' });

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await api.get(ENDPOINTS.CONSULTATIONS);
      setConsultations(res.data.results || res.data);
    } catch {}
  };

  const save = async () => {
    if (!form.date || !form.doctor_name || !form.reason) {
      Alert.alert('Erreur', 'Date, médecin et motif sont obligatoires.');
      return;
    }
    try {
      await api.post(ENDPOINTS.CONSULTATIONS, form);
      Alert.alert('✅', 'Consultation enregistrée !');
      setModalVisible(false);
      setForm({ date: '', doctor_name: '', specialty: '', reason: '', notes: '' });
      load();
    } catch { Alert.alert('Erreur', 'Impossible d\'enregistrer.'); }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <Text style={styles.title}>🏥 Mes consultations</Text>
        {consultations.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={{ fontSize: 40, textAlign: 'center' }}>🩺</Text>
            <Text style={{ textAlign: 'center', color: COLORS.gray, marginTop: 8 }}>
              Aucune consultation enregistrée.
            </Text>
          </View>
        )}
        {consultations.map((c) => (
          <View key={c.id} style={styles.card}>
            <Text style={styles.cardDate}>{new Date(c.date).toLocaleDateString('fr-FR')}</Text>
            <Text style={styles.cardDoctor}>Dr. {c.doctor_name} — {c.specialty}</Text>
            <Text style={{ color: COLORS.gray, marginTop: 4 }}>{c.reason}</Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={{ color: 'white', fontSize: 28 }}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Nouvelle consultation</Text>
            {[
              { label: 'Date *', key: 'date', placeholder: 'AAAA-MM-JJ' },
              { label: 'Médecin *', key: 'doctor_name', placeholder: 'Dr. Nom' },
              { label: 'Spécialité', key: 'specialty', placeholder: 'Gynécologue, généraliste...' },
              { label: 'Motif *', key: 'reason', placeholder: 'Raison de la consultation' },
              { label: 'Notes', key: 'notes', placeholder: 'Observations, prescriptions...' },
            ].map((f) => (
              <View key={f.key}>
                <Text style={styles.label}>{f.label}</Text>
                <TextInput
                  style={styles.input}
                  value={form[f.key]}
                  onChangeText={(v) => setForm({ ...form, [f.key]: v })}
                  placeholder={f.placeholder}
                />
              </View>
            ))}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <TouchableOpacity style={[styles.btn, { backgroundColor: COLORS.lightGray }]} onPress={() => setModalVisible(false)}>
                <Text style={{ color: COLORS.gray }}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { backgroundColor: COLORS.primary }]} onPress={save}>
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
  title: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary, marginBottom: 16 },
  emptyCard: { backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 30, elevation: 2 },
  card: { backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16, marginBottom: 10, elevation: 2 },
  cardDate: { fontSize: 13, color: COLORS.gray },
  cardDoctor: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginTop: 2 },
  fab: {
    position: 'absolute', right: 20, bottom: 20, backgroundColor: COLORS.primary,
    width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', elevation: 6,
  },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary, marginBottom: 12, textAlign: 'center' },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginTop: 10, marginBottom: 4 },
  input: {
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: SIZES.radius,
    padding: 12, fontSize: 14, backgroundColor: COLORS.lightGray,
  },
  btn: { flex: 1, padding: 14, borderRadius: SIZES.radius, alignItems: 'center' },
});