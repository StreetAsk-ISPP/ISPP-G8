import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';
import { theme } from '../constants/theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    setError('');

    if (!identifier.trim() || !password.trim()) {
      setError('Please enter username/email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiClient.post('/api/v1/auth/signin', {
        email: identifier,
        password,
      });
      await login(response.data.token);
    } catch {
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />

        <Text style={styles.title}>Login</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="email or username"
            placeholderTextColor={theme.colors.textSecondary}
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="type your password"
            placeholderTextColor={theme.colors.textSecondary}
            style={styles.input}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.loginButton, isSubmitting && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isSubmitting}
            activeOpacity={0.85}
          >
            <Text style={styles.loginButtonText}>{isSubmitting ? 'LOGGING IN...' : 'LOGIN'}</Text>
          </TouchableOpacity>

        </View>
        <View style={styles.footer}>
          <Text style={styles.signUpPrompt}>Don’t have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')} activeOpacity={0.8}>
            <Text style={styles.signUpLink}>Sign Up Here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: theme.spacing.md,
  },
  title: {
    textAlign: 'center',
    fontSize: theme.typography.h1,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  form: {
    width: '100%',
    paddingHorizontal: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.caption,
    fontWeight: '500',
    color: theme.colors.textPrimary,
    marginBottom: 4,
    marginTop: theme.spacing.sm,
  },
  input: {
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 10,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    height: 42,
    fontSize: theme.typography.caption,
    color: theme.colors.textPrimary,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: theme.typography.caption,
    marginBottom: theme.spacing.sm,
  },
  loginButton: {
    backgroundColor: theme.colors.textSecondary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: theme.colors.surface,
    fontSize: theme.typography.caption,
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  signUpPrompt: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: theme.typography.caption,
  },
  signUpLink: {
    textAlign: 'center',
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body,
    fontWeight: '600',
    marginTop: theme.spacing.xs,
  },
});

