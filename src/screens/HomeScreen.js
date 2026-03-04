import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCycles, fetchStats } from '../store/slices/cycleSlice';
import { logout } from '../store/slices/authSlice';
import { COLORS, SIZES } from '../constants/theme';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { cycles, stats, loading } = useSelector((s) => s.cycle);

  useEffect(() => {
    dispatch(fetchCycles());
    dispatch(fetchStats());
  }, []);

  const lastCycle = cycles[0];
  const today = new Date();

  const getDaysSinceLastCycle = () => {
    if (!lastCycle) return null;
    const diff = Math.floor((today - new Date(lastCycle.start_date)) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getPhaseLabel = () => {
    const days = getDaysSinceLastCycle();
    if (days === null) return 'Aucun cycle enregistré';
    if (days < 5) return '🔴 Phase menstruelle';
    if (days < 13) return '🌱 Phase folliculaire';
    if (days < 17) return '🥚 Ovulation';
    return '🌙 Phase lutéale';
  };

  const getNextPrediction = () => {
    if (!lastCycle || !stats) return null;
    const avg = stats.duree_cycle_moyenne || 28;
    const next = new Date(lastCycle.start_date);
    next.setDate(next.getDate() + Math.round(avg));
    return next.toLocaleDateString('fr-FR');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Salutation */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Bonjour, {user?.first_name} 🌸</Text>
        <Text style={styles.date}>{today.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
      </View>

      {loading && <ActivityIndicator color={COLORS.primary} style={{ margin: 20 }} />}

      {/* Phase actuelle */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Phase actuelle</Text>
        <Text style={styles.phaseText}>{getPhaseLabel()}</Text>
        {getDaysSinceLastCycle() !== null && (
          <Text style={styles.daysText}>Jour {getDaysSinceLastCycle() + 1} de ton cycle</Text>
        )}
      </View>

      {/* Prochain cycle */}
      {getNextPrediction() && (
        <View style={[styles.card, { backgroundColor: '#FFF3E0' }]}>
          <Text style={styles.cardTitle}>📅 Prochains règles prévues</Text>
          <Text style={styles.phaseText}>{getNextPrediction()}</Text>
          <Text style={styles.daysText}>Basé sur ta moyenne de {stats?.duree_cycle_moyenne || 28} jours</Text>
        </View>
      )}

      {/* Statistiques rapides */}
      {stats && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Tes statistiques</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.duree_cycle_moyenne || '-'}</Text>
              <Text style={styles.statLabel}>Jours de cycle</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.duree_regles_moyenne || '-'}</Text>
              <Text style={styles.statLabel}>Jours de règles</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.total_cycles_enregistres || 0}</Text>
              <Text style={styles.statLabel}>Cycles enregistrés</Text>
            </View>
          </View>
        </View>
      )}

      {/* Actions rapides */}
      <Text style={styles.sectionTitle}>Actions rapides</Text>
      <View style={styles.actionsGrid}>
        {[
          { emoji: '🩸', label: 'Ajouter cycle', screen: 'Mon Cycle' },
          { emoji: '📝', label: 'Journal du jour', screen: 'Journal' },
          { emoji: '🏥', label: 'Consultation', screen: 'Médical' },
          { emoji: '👤', label: 'Mon profil', screen: 'Profil' },
        ].map((action) => (
          <TouchableOpacity
            key={action.label}
            style={styles.actionBtn}
            onPress={() => navigation.navigate(action.screen)}
          >
            <Text style={styles.actionEmoji}>{action.emoji}</Text>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, padding: 24, paddingTop: 40 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: COLORS.white },
  date: { color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  card: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radius,
    margin: 16, marginBottom: 4, padding: 18, elevation: 3,
  },
  cardTitle: { fontSize: 13, color: COLORS.gray, marginBottom: 8, fontWeight: '600', textTransform: 'uppercase' },
  phaseText: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  daysText: { color: COLORS.gray, marginTop: 4, fontSize: 13 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: 12, color: COLORS.gray, textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, margin: 16, marginBottom: 8 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, paddingBottom: 20 },
  actionBtn: {
    width: '45%', backgroundColor: COLORS.white, borderRadius: SIZES.radius,
    margin: '2.5%', padding: 20, alignItems: 'center', elevation: 2,
  },
  actionEmoji: { fontSize: 32, marginBottom: 8 },
  actionLabel: { fontSize: 13, color: COLORS.text, fontWeight: '600', textAlign: 'center' },
});