import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../store/slices/authSlice';
import { COLORS, SIZES } from '../../constants/theme';

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (error) {
      Alert.alert('Erreur', error.error || 'Identifiants incorrects.');
      dispatch(clearError());
    }
  }, [error]);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    dispatch(login({ email, password }));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.header}>
          <Text style={styles.emoji}>🌸</Text>
          <Text style={styles.title}>Femme Santé</Text>
          <Text style={styles.subtitle}>Ton application de bien-être</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Adresse email</Text>
          <TextInput
            style={styles.input}
            placeholder="exemple@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={false}
          />

          <Text style={styles.label}>Mot de passe</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Ton mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={showPassword === false}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeBtn}
            >
              <Text style={{ fontSize: 20 }}>
                {showPassword ? '🙈' : '👁️'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading === true}
          >
            <Text style={styles.btnText}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>
              Pas encore de compte ?{' '}
              <Text style={styles.link}>S'inscrire</Text>
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emoji: { fontSize: 60, marginBottom: 12 },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 6,
  },
  subtitle: { fontSize: 16, color: COLORS.gray },
  form: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLarge,
    padding: 24,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: 14,
    fontSize: 15,
    backgroundColor: COLORS.lightGray,
    marginBottom: 4,
    color: COLORS.text,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  eyeBtn: { padding: 10 },
  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    textAlign: 'center',
    marginTop: 18,
    color: COLORS.gray,
  },
  link: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});