import { Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '../constants/theme';

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
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  label: {
    color: theme.colors.surface,
    fontSize: theme.typography.body,
    fontWeight: '600',
  },
  labelSecondary: {
    color: theme.colors.textPrimary,
  },
  labelDisabled: {
    opacity: 0.7,
  },
});
