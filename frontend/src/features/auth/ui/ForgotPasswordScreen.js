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

export default function ForgotPasswordScreen({ navigation }) {
    const { width } = useWindowDimensions();
    const isNarrow = width < 500;

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const handleSubmit = async () => {
        setError('');
        setInfo('');

        const normalizedEmail = email.trim();
        if (!normalizedEmail) {
            setError('Please enter your email.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
            setError('Please enter a valid email address.');
            return;
        }

        try {
            setIsSubmitting(true);
            await apiClient.post('/api/v1/auth/password/forgot', { email: normalizedEmail });
            setInfo('If the email exists, we sent a token. Copy the token from your email and paste it in the reset screen.');
        } catch (apiError) {
            const message = apiError?.response?.data?.message || 'We could not process your request. Please try again.';
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
                    <Text style={styles.title}>Recover password</Text>
                    <Text style={styles.subtitle}>Enter your email and we will send you a token to copy and paste.</Text>

                    <Text style={styles.label}>Email</Text>
                    <View style={[styles.inputWrapper, focusedField === 'email' && styles.inputFocused]}>
                        <Ionicons name="mail-outline" size={18} color="#1f2937" style={styles.inputIcon} />
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                            placeholder="you@example.com"
                            placeholderTextColor="#c0c5ce"
                            style={styles.input}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </View>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    {info ? <Text style={styles.infoText}>{info}</Text> : null}

                    <TouchableOpacity
                        style={[styles.primaryBtn, isSubmitting && { opacity: 0.6 }]}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.primaryBtnText}>{isSubmitting ? 'Sending...' : 'Send recovery email'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryBtn}
                        onPress={() => navigation.navigate('ResetPassword')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.secondaryBtnText}>I already have a token</Text>
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
        marginTop: 22,
    },
    primaryBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    secondaryBtn: {
        backgroundColor: '#f3f4f6',
        borderRadius: 14,
        paddingVertical: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginTop: 14,
    },
    secondaryBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
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
