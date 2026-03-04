import { Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '../ui/theme/theme';

export default function CustomButton({ label, onPress, variant = 'primary', disabled = false, style, textStyle }) {
  return (
    <Pressable
      style={[
        styles.button,
        variant === 'secondary' && styles.buttonSecondary,
        disabled && styles.buttonDisabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[
        styles.label,
        variant === 'secondary' && styles.labelSecondary,
        disabled && styles.labelDisabled,
        textStyle
      ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonSecondary: {
    backgroundColor: '#f3f4f6',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOpacity: 0.08,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  label: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  labelSecondary: {
    color: theme.colors.textPrimary,
  },
  labelDisabled: {
    opacity: 0.7,
  },
});
