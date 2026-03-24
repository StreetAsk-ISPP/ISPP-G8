import { useState } from 'react';
import {
    Keyboard,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../../shared/services/http/apiClient';

export default function ResetPasswordScreen({ navigation }) {
    const { width } = useWindowDimensions();
    const isNarrow = width < 500;

    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const handleSubmit = async () => {
        setError('');
        setInfo('');

        if (!token.trim()) {
            setError('Token is required.');
            return;
        }
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await apiClient.post('/api/v1/auth/password/reset', {
                token: token.trim(),
                newPassword,
            });
            setInfo(response?.data?.message || 'Password updated successfully.');
            setTimeout(() => navigation.navigate('Login'), 1200);
        } catch (apiError) {
            const message = apiError?.response?.data?.message || 'Invalid or expired token.';
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const content = (
        <View style={styles.screen}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={[styles.card, isNarrow && { marginHorizontal: 16, borderRadius: 24 }]}>
                    <Text style={styles.title}>Set new password</Text>
                    <Text style={styles.subtitle}>Copy the token from your email, paste it here, and choose a new password.</Text>

                    <Text style={styles.label}>Token</Text>
                    <View style={[styles.inputWrapper, focusedField === 'token' && styles.inputFocused]}>
                        <Ionicons name="key-outline" size={18} color="#1f2937" style={styles.inputIcon} />
                        <TextInput
                            value={token}
                            onChangeText={setToken}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder="Paste token from email"
                            placeholderTextColor="#c0c5ce"
                            style={styles.input}
                            onFocus={() => setFocusedField('token')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </View>

                    <Text style={styles.label}>New password</Text>
                    <View style={[styles.inputWrapper, focusedField === 'new' && styles.inputFocused]}>
                        <Ionicons name="lock-closed-outline" size={18} color="#1f2937" style={styles.inputIcon} />
                        <TextInput
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry={!showNewPassword}
                            placeholder="********"
                            placeholderTextColor="#c0c5ce"
                            style={styles.input}
                            onFocus={() => setFocusedField('new')}
                            onBlur={() => setFocusedField(null)}
                        />
                        <TouchableOpacity onPress={() => setShowNewPassword((prev) => !prev)} activeOpacity={0.7}>
                            <Ionicons name={showNewPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Confirm password</Text>
                    <View style={[styles.inputWrapper, focusedField === 'confirm' && styles.inputFocused]}>
                        <Ionicons name="lock-closed-outline" size={18} color="#1f2937" style={styles.inputIcon} />
                        <TextInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                            placeholder="********"
                            placeholderTextColor="#c0c5ce"
                            style={styles.input}
                            onFocus={() => setFocusedField('confirm')}
                            onBlur={() => setFocusedField(null)}
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword((prev) => !prev)} activeOpacity={0.7}>
                            <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    {info ? <Text style={styles.infoText}>{info}</Text> : null}

                    <TouchableOpacity
                        style={[styles.primaryBtn, isSubmitting && { opacity: 0.6 }]}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.primaryBtnText}>{isSubmitting ? 'Updating...' : 'Update password'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.backLink} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.backText}>Back to login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );

    if (Platform.OS === 'web') return content;
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            {content}
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    card: {
        width: '100%',
        maxWidth: 420,
        backgroundColor: '#fff',
        borderRadius: 28,
        padding: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 24,
        elevation: 6,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1f2937',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#9ca3af',
        textAlign: 'center',
        marginTop: 6,
        marginBottom: 28,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
        marginTop: 16,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderWidth: 1.5,
        borderColor: '#e5e7eb',
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 50,
    },
    inputFocused: {
        borderColor: '#dc2626',
        backgroundColor: '#fff',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#1f2937',
        height: '100%',
        outlineStyle: 'none',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 14,
    },
    infoText: {
        color: '#16a34a',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 14,
    },
    primaryBtn: {
        backgroundColor: '#dc2626',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 24,
    },
    primaryBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    backLink: {
        marginTop: 16,
        alignItems: 'center',
    },
    backText: {
        fontSize: 13,
        color: '#b91c1c',
        fontWeight: '500',
    },
});
