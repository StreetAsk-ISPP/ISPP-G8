import { useState } from 'react';
import {
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import apiClient from '../../../shared/services/http/apiClient';
import { useAuth } from '../../../app/providers/AuthProvider';
import { theme } from '../../../shared/ui/theme/theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isLoginPressed, setIsLoginPressed] = useState(false);

  const isWeb = Platform.OS === 'web';
  const screenPadding = width * (isWeb ? 0.06 : 0.05);
  const isWideLayout = isWeb && width > height * 1.1;
  const logoSize = width * (isWideLayout ? 0.075 : 0.14);
  const titleSize = theme.typography.h1;
  const inputHeight = 46;
  const contentTopPadding = insets.top + theme.spacing.lg;
  const contentBottomPadding = insets.bottom + theme.spacing.lg;

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
      // Pasar tanto el token como los datos del usuario
      await login(response.data.token, {
        id: response.data.id,
        username: response.data.username,
        roles: response.data.roles,
      });
    } catch {
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = (
    <View
      style={[
        styles.screen,
        {
          paddingHorizontal: screenPadding,
          paddingTop: contentTopPadding,
          paddingBottom: contentBottomPadding,
        },
      ]}
    >
      <View style={[styles.container, !isWideLayout && styles.containerMobile, isWideLayout && styles.containerWide]}>
        <View style={[styles.brandSection, isWideLayout && styles.brandSectionWide]}>
          <Image
            source={require('../../../../assets/logo.png')}
            style={[styles.logo, { width: logoSize, height: logoSize }]}
            resizeMode="contain"
          />

          <Text style={[styles.title, { fontSize: titleSize }]}>Login</Text>
        </View>

        <View
          style={[
            styles.formSection,
            isWideLayout && styles.formSectionWide,
          ]}
        >
          <View style={styles.form}>
            <Text style={styles.label}>Username</Text>
            <View style={[styles.inputWrapper, focusedField === 'identifier' && styles.inputWrapperFocused]}>
              <Ionicons name="person-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="email or username"
                placeholderTextColor={theme.colors.textSecondary}
                style={[styles.input, { height: inputHeight }]}
                onFocus={() => setFocusedField('identifier')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWrapper, focusedField === 'password' && styles.inputWrapperFocused]}>
              <Ionicons name="key-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="type your password"
                placeholderTextColor={theme.colors.textSecondary}
                style={[styles.input, { height: inputHeight }]}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={[
                styles.loginButton,
                isLoginPressed && styles.loginButtonPressed,
                isSubmitting && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              onPressIn={() => setIsLoginPressed(true)}
              onPressOut={() => setIsLoginPressed(false)}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              <Text style={[styles.loginButtonText, isLoginPressed && styles.loginButtonTextPressed]}>
                {isSubmitting ? 'LOGGING IN...' : 'LOGIN'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.footer, isWideLayout && styles.footerWide]}>
            <Text style={styles.signUpPrompt}>Don’t have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')} activeOpacity={0.8}>
              <Text style={styles.signUpLink}>Sign Up Here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  if (isWeb) {
    return content;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {content}
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: theme.spacing.lg,
  },
  containerMobile: {
    justifyContent: 'space-between',
  },
  containerWide: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  brandSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandSectionWide: {
    minWidth: 0,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  logo: {
    width: 88,
    height: 88,
    marginBottom: theme.spacing.sm,
  },
  title: {
    textAlign: 'center',
    fontSize: theme.typography.h1,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  formSection: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },
  formSectionWide: {
    minWidth: 0,
    alignItems: 'stretch',
    flex: 1,
    width: '72%',
  },
  form: {
    width: '100%',
    minWidth: 0,
    paddingHorizontal: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  label: {
    fontSize: theme.typography.caption,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.md,
  },
  input: {
    flex: 1,
    paddingHorizontal: theme.spacing.xs,
    fontSize: theme.typography.body,
    color: theme.colors.textPrimary,
    outlineWidth: 0,
    outlineColor: 'transparent',
    outlineStyle: 'none',
    boxShadow: 'none',
    borderWidth: 0,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.sm,
  },
  inputWrapperFocused: {
    borderColor: theme.colors.border,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: theme.typography.caption,
    marginTop: theme.spacing.sm,
  },
  loginButton: {
    backgroundColor: theme.colors.textSecondary,
    borderRadius: theme.radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonPressed: {
    backgroundColor: theme.colors.border,
  },
  loginButtonText: {
    color: theme.colors.surface,
    fontSize: theme.typography.body,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  loginButtonTextPressed: {
    color: theme.colors.textPrimary,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    alignItems: 'center',
  },
  footerWide: {
    marginTop: 'auto',
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
