 import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { COLORS, SIZES } from '../constants/theme';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Es-tu sûre de vouloir te déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Déconnecter', style: 'destructive', onPress: () => dispatch(logout()) },
    ]);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={{ fontSize: 40 }}>👤</Text>
        </View>
        <Text style={styles.name}>{user?.first_name} {user?.last_name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        {[
          { emoji: '🌸', label: 'Mon profil santé' },
          { emoji: '🔔', label: 'Notifications' },
          { emoji: '🔒', label: 'Confidentialité & Données' },
          { emoji: '❓', label: 'Aide & FAQ' },
          { emoji: '📧', label: 'Nous contacter' },
        ].map((item) => (
          <TouchableOpacity key={item.label} style={styles.menuItem}>
            <Text style={styles.menuEmoji}>{item.emoji}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={{ color: COLORS.gray }}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: COLORS.primary, padding: 30, alignItems: 'center' },
  avatar: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  name: { fontSize: 22, fontWeight: 'bold', color: 'white' },
  email: { color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  section: { backgroundColor: COLORS.white, margin: 16, borderRadius: SIZES.radius, elevation: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.lightGray },
  menuEmoji: { fontSize: 22, marginRight: 14 },
  menuLabel: { flex: 1, fontSize: 15, color: COLORS.text },
  logoutBtn: {
    backgroundColor: '#FFEBEE', margin: 16, borderRadius: SIZES.radius,
    padding: 16, alignItems: 'center',
  },
  logoutText: { color: COLORS.error, fontWeight: 'bold', fontSize: 15 },
});