import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../app/providers/AuthProvider';
import apiClient from '../../shared/services/http/apiClient';
import { Platform } from 'react-native';

const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
        window.alert(`${title}\n\n${message}`);
        return;
    }

    Alert.alert(title, message);
};

export default function EditProfileScreen({ navigation }) {
    const { user, setUser } = useAuth();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [originalUser, setOriginalUser] = useState(null);


    const [form, setForm] = useState({
        email: '',
        userName: '',
        firstName: '',
        lastName: '',
    });

    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const userId = useMemo(() => user?.id, [user]);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const loadProfile = async () => {
            try {
                const res = await apiClient.get(`/api/v1/users/${userId}`);
                const currentUser = res.data;
                setOriginalUser(currentUser);
                setForm({
                    email: currentUser?.email || '',
                    userName: currentUser?.userName || '',
                    firstName: currentUser?.firstName || '',
                    lastName: currentUser?.lastName || '',
                });
            } catch (error) {
                if (error?.response?.status === 401) {
                    showAlert(
                        'Sesión no válida',
                        'No se pudo cargar el perfil porque la petición no está autorizada.'
                    );
                } else {
                    showAlert('Error', 'No se pudieron cargar tus datos.');
                }
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [userId]);

    const updateField = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const updatePasswordField = (field, value) => {
        setPasswords(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        if (!form.email.trim()) {
            showAlert('Validación', 'El email es obligatorio.');
            return false;
        }

        if (!/\S+@\S+\.\S+/.test(form.email.trim())) {
            showAlert('Validación', 'Introduce un email válido.');
            return false;
        }

        if (!form.userName.trim()) {
            showAlert('Validación', 'El nombre de usuario es obligatorio.');
            return false;
        }

        if (!form.firstName.trim()) {
            showAlert('Validación', 'El nombre es obligatorio.');
            return false;
        }

        if (!form.lastName.trim()) {
            showAlert('Validación', 'Los apellidos son obligatorios.');
            return false;
        }

        if (passwords.newPassword || passwords.confirmPassword) {
            if (passwords.newPassword.length < 6) {
                showAlert(
                    'Validación',
                    'La nueva contraseña debe tener al menos 6 caracteres.'
                );
                return false;
            }

            if (passwords.newPassword !== passwords.confirmPassword) {
                showAlert('Validación', 'Las contraseñas no coinciden.');
                return false;
            }
        }

        return true;
    };

    const handleSave = async () => {
        if (!originalUser || !userId) return;
        if (!validateForm()) return;

        setSaving(true);

        try {
            const payload = {
                ...originalUser,
                email: form.email.trim(),
                userName: form.userName.trim(),
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
            };

            if (passwords.newPassword.trim()) {
                payload.password = passwords.newPassword.trim();
            } else {
                delete payload.password;
            }

            const res = await apiClient.put(`/api/v1/users/${userId}`, payload);
            const updatedUser = res.data;

            setOriginalUser(updatedUser);
            setForm({
                email: updatedUser?.email || '',
                userName: updatedUser?.userName || '',
                firstName: updatedUser?.firstName || '',
                lastName: updatedUser?.lastName || '',
            });

            setPasswords({
                newPassword: '',
                confirmPassword: '',
            });

            if (setUser) {
                setUser(prev => ({
                    ...prev,
                    id: updatedUser?.id || prev?.id,
                    username: updatedUser?.email || prev?.username,
                    email: updatedUser?.email || '',
                    userName: updatedUser?.userName || '',
                    firstName: updatedUser?.firstName || '',
                    lastName: updatedUser?.lastName || '',
                    authority: updatedUser?.authority || prev?.authority,
                    roles:
                        updatedUser?.authority?.authority
                            ? [updatedUser.authority.authority]
                            : prev?.roles || [],
                }));
            }

            showAlert('Perfil actualizado', 'Tus datos se han guardado correctamente.');
            navigation.goBack();
        } catch (error) {
            if (error?.response?.status === 401) {
                showAlert(
                    'Sesión no válida',
                    'No se pudo guardar porque la petición no está autorizada.'
                );
            } else {
                const message =
                    error?.response?.data?.message ||
                    'No se pudo actualizar el perfil.';
                showAlert('Error', message);
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.screen}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#d90429" />
                    <Text style={styles.loadingText}>Cargando perfil...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.headerRed}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>EDIT PROFILE</Text>
                <Text style={styles.headerSubtitle}>
                    Revisa tus datos actuales y actualiza solo lo que necesites.
                </Text>
            </View>

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Datos personales</Text>

                    <Text style={styles.label}>Nombre</Text>
                    <TextInput
                        style={styles.input}
                        value={form.firstName}
                        onChangeText={text => updateField('firstName', text)}
                        placeholder="Tu nombre"
                        placeholderTextColor="#9ca3af"
                    />

                    <Text style={styles.label}>Apellidos</Text>
                    <TextInput
                        style={styles.input}
                        value={form.lastName}
                        onChangeText={text => updateField('lastName', text)}
                        placeholder="Tus apellidos"
                        placeholderTextColor="#9ca3af"
                    />

                    <Text style={styles.label}>Nombre de usuario</Text>
                    <TextInput
                        style={styles.input}
                        value={form.userName}
                        onChangeText={text => updateField('userName', text)}
                        placeholder="Tu nombre de usuario"
                        autoCapitalize="none"
                        placeholderTextColor="#9ca3af"
                    />

                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={form.email}
                        onChangeText={text => updateField('email', text)}
                        placeholder="tu@email.com"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        placeholderTextColor="#9ca3af"
                    />
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Seguridad</Text>
                    <Text style={styles.helperText}>
                        La contraseña actual no se muestra nunca. Solo se actualizará si escribes una nueva.
                    </Text>

                    <Text style={styles.label}>Nueva contraseña</Text>
                    <View style={styles.passwordWrapper}>
                        <TextInput
                            style={styles.passwordInput}
                            value={passwords.newPassword}
                            onChangeText={text => updatePasswordField('newPassword', text)}
                            placeholder="Nueva contraseña"
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            placeholderTextColor="#9ca3af"
                            textContentType="newPassword"
                            autoComplete="new-password"
                        />
                        <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
                            <Ionicons
                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={22}
                                color="#6b7280"
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Confirmar nueva contraseña</Text>
                    <View style={styles.passwordWrapper}>
                        <TextInput
                            style={styles.passwordInput}
                            value={passwords.confirmPassword}
                            onChangeText={text => updatePasswordField('confirmPassword', text)}
                            placeholder="Repite la nueva contraseña"
                            secureTextEntry={!showConfirmPassword}
                            autoCapitalize="none"
                            placeholderTextColor="#9ca3af"
                            textContentType="newPassword"
                            autoComplete="new-password"
                        />
                        <TouchableOpacity
                            onPress={() => setShowConfirmPassword(prev => !prev)}
                        >
                            <Ionicons
                                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={22}
                                color="#6b7280"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                    onPress={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveBtnText}>SAVE CHANGES</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    headerRed: {
        backgroundColor: '#d90429',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 24,
    },
    backBtn: {
        marginBottom: 14,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: '#ffe5e9',
        fontSize: 14,
        marginTop: 6,
        lineHeight: 20,
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 28,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 5,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 14,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
        marginTop: 10,
    },
    input: {
        backgroundColor: '#f3f4f6',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 13,
        fontSize: 15,
        color: '#111827',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    passwordWrapper: {
        backgroundColor: '#f3f4f6',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        flexDirection: 'row',
        alignItems: 'center',
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 15,
        color: '#111827',
    },
    helperText: {
        fontSize: 13,
        color: '#6b7280',
        lineHeight: 18,
        marginBottom: 6,
    },
    saveBtn: {
        backgroundColor: '#d90429',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 4,
    },
    saveBtnDisabled: {
        opacity: 0.7,
    },
    saveBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 15,
        color: '#4b5563',
    },
});