 import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../store/slices/authSlice';
import { COLORS, SIZES } from '../../constants/theme';

export default function RegisterScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  useEffect(() => {
    if (error) {
      const msg = Object.values(error).flat().join('\n');
      Alert.alert('Erreur', msg);
      dispatch(clearError());
    }
  }, [error]);

  const handleRegister = () => {
    if (!firstName || !email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    if (password !== passwordConfirm) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }
    dispatch(register({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      password_confirm: passwordConfirm,
    }));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.header}>
          <Text style={styles.emoji}>🌸</Text>
          <Text style={styles.title}>Créer un compte</Text>
        </View>

        <View style={styles.form}>

          <Text style={styles.label}>Prénom</Text>
          <TextInput
            style={styles.input}
            placeholder="Ton prénom"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
            autoCorrect={false}
            secureTextEntry={false}
          />

          <Text style={styles.label}>Nom</Text>
          <TextInput
            style={styles.input}
            placeholder="Ton nom"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
            autoCorrect={false}
            secureTextEntry={false}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="email@exemple.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={false}
          />

          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="Minimum 8 caractères"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Confirmer le mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="Répète ton mot de passe"
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={loading === true}
          >
            <Text style={styles.btnText}>
              {loading ? 'Création...' : 'Créer mon compte'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>
              Déjà un compte ?{' '}
              <Text style={styles.link}>Se connecter</Text>
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
    paddingVertical: 30,
  },
  emoji: { fontSize: 50, marginBottom: 10 },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
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
    marginTop: 12,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: 14,
    fontSize: 15,
    backgroundColor: COLORS.lightGray,
    color: COLORS.text,
  },
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
    marginTop: 16,
    color: COLORS.gray,
  },
  link: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});