import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ActivityIndicator,
    Modal,
    Image, // Añadido para la vista previa
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../app/providers/AuthProvider';
import apiClient from '../../shared/services/http/apiClient';

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
        bio: '',               // Nuevo campo
        profilePictureUrl: '', // Nuevo campo
    });

    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [feedback, setFeedback] = useState({
        visible: false,
        title: '',
        message: '',
        type: 'success', // success | error
        goBackOnClose: false,
    });

    const userId = useMemo(() => user?.id, [user]);

    const showFeedback = (title, message, type = 'success', goBackOnClose = false) => {
        setFeedback({
            visible: true,
            title,
            message,
            type,
            goBackOnClose,
        });
    };

    const closeFeedback = () => {
        const shouldGoBack = feedback.goBackOnClose;

        setFeedback(prev => ({
            ...prev,
            visible: false,
            goBackOnClose: false,
        }));

        if (shouldGoBack) {
            navigation.goBack();
        }
    };

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
                    bio: currentUser?.bio || '',                             // Cargar bio
                    profilePictureUrl: currentUser?.profilePictureUrl || '', // Cargar foto
                });
            } catch (error) {
                if (error?.response?.status === 401) {
                    showFeedback(
                        'Sesión no válida',
                        'No se pudo cargar el perfil porque la petición no está autorizada.',
                        'error'
                    );
                } else {
                    showFeedback('Error', 'No se pudieron cargar tus datos.', 'error');
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
            showFeedback('Validación', 'El email es obligatorio.', 'error');
            return false;
        }

        if (!/\S+@\S+\.\S+/.test(form.email.trim())) {
            showFeedback('Validación', 'Introduce un email válido.', 'error');
            return false;
        }

        if (!form.userName.trim()) {
            showFeedback('Validación', 'El nombre de usuario es obligatorio.', 'error');
            return false;
        }

        // Validación de longitud de bio opcional
        if (form.bio.length > 255) {
            showFeedback('Validación', 'La biografía no puede superar los 255 caracteres.', 'error');
            return false;
        }

        if (passwords.newPassword || passwords.confirmPassword) {
            if (passwords.newPassword.length < 6) {
                showFeedback(
                    'Validación',
                    'La nueva contraseña debe tener al menos 6 caracteres.',
                    'error'
                );
                return false;
            }

            if (passwords.newPassword !== passwords.confirmPassword) {
                showFeedback('Validación', 'Las contraseñas no coinciden.', 'error');
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
                bio: form.bio.trim(),                       // Nuevo
                profilePictureUrl: form.profilePictureUrl.trim(), // Nuevo
            };

            if (passwords.newPassword.trim()) {
                payload.password = passwords.newPassword.trim();
            } else {
                delete payload.password;
            }

            const res = await apiClient.put(`/api/v1/users/${userId}`, payload);
            const updatedUser = res.data;

            setOriginalUser(updatedUser);
            
            if (setUser) {
                setUser(prev => ({
                    ...prev,
                    id: updatedUser?.id || prev?.id,
                    username: updatedUser?.email || prev?.username,
                    email: updatedUser?.email || '',
                    userName: updatedUser?.userName || '',
                    firstName: updatedUser?.firstName || '',
                    lastName: updatedUser?.lastName || '',
                    bio: updatedUser?.bio || '',                         // Actualizar en contexto
                    profilePictureUrl: updatedUser?.profilePictureUrl || '', // Actualizar en contexto
                    authority: updatedUser?.authority || prev?.authority,
                    roles:
                        updatedUser?.authority?.authority
                            ? [updatedUser.authority.authority]
                            : prev?.roles || [],
                }));
            }

            showFeedback(
                'Perfil actualizado',
                'Tus datos se han guardado correctamente.',
                'success',
                true
            );
        } catch (error) {
            const message = error?.response?.data?.message || 'No se pudo actualizar el perfil.';
            showFeedback('Error', message, 'error');
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
                    Personaliza tu presencia en la plataforma.
                </Text>
            </View>

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                keyboardShouldPersistTaps="handled"
            >
                {/* CARD 1: APARIENCIA */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Apariencia</Text>
                    
                    <View style={styles.avatarPreviewContainer}>
                        <View style={styles.avatarCircle}>
                            {form.profilePictureUrl ? (
                                <Image source={{ uri: form.profilePictureUrl }} style={styles.avatarImg} />
                            ) : (
                                <Ionicons name="person" size={50} color="#9ca3af" />
                            )}
                        </View>
                        <View style={{ flex: 1, marginLeft: 15 }}>
                            <Text style={styles.label}>URL de la imagen</Text>
                            <TextInput
                                style={styles.input}
                                value={form.profilePictureUrl}
                                onChangeText={text => updateField('profilePictureUrl', text)}
                                placeholder="https://ejemplo.com/foto.jpg"
                                autoCapitalize="none"
                                placeholderTextColor="#9ca3af"
                            />
                        </View>
                    </View>

                    <Text style={styles.label}>Biografía</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={form.bio}
                        onChangeText={text => updateField('bio', text)}
                        placeholder="Cuenta algo sobre ti..."
                        placeholderTextColor="#9ca3af"
                        multiline
                        numberOfLines={4}
                        maxLength={255}
                    />
                    <Text style={styles.charCount}>{form.bio.length}/255</Text>
                </View>

                {/* CARD 2: DATOS PERSONALES */}
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

                {/* CARD 3: SEGURIDAD */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Seguridad</Text>
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
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(prev => !prev)}>
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

            {/* MODAL FEEDBACK (Igual al tuyo) */}
            <Modal transparent visible={feedback.visible} animationType="fade" onRequestClose={closeFeedback}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={[styles.modalIconWrap, feedback.type === 'success' ? styles.modalSuccess : styles.modalError]}>
                            <Ionicons name={feedback.type === 'success' ? 'checkmark-outline' : 'close-outline'} size={28} color="#fff" />
                        </View>
                        <Text style={styles.modalTitle}>{feedback.title}</Text>
                        <Text style={styles.modalMessage}>{feedback.message}</Text>
                        <TouchableOpacity style={[styles.modalButton, feedback.type === 'success' ? styles.modalButtonSuccess : styles.modalButtonError]} onPress={closeFeedback}>
                            <Text style={styles.modalButtonText}>Aceptar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#f9fafb' },
    headerRed: { backgroundColor: '#d90429', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 24 },
    backBtn: { marginBottom: 14 },
    headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    headerSubtitle: { color: '#ffe5e9', fontSize: 14, marginTop: 6, lineHeight: 20 },
    container: { flex: 1 },
    contentContainer: { padding: 16, paddingBottom: 28 },
    card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 14 },
    label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8, marginTop: 10 },
    input: { backgroundColor: '#f3f4f6', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: '#111827', borderWidth: 1, borderColor: '#e5e7eb' },
    textArea: { height: 100, textAlignVertical: 'top' },
    charCount: { textAlign: 'right', fontSize: 12, color: '#9ca3af', marginTop: 4 },
    avatarPreviewContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb' },
    avatarImg: { width: '100%', height: '100%' },
    passwordWrapper: { backgroundColor: '#f3f4f6', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 4, borderWidth: 1, borderColor: '#e5e7eb', flexDirection: 'row', alignItems: 'center' },
    passwordInput: { flex: 1, paddingVertical: 10, fontSize: 15, color: '#111827' },
    saveBtn: { backgroundColor: '#d90429', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 4 },
    saveBtnDisabled: { opacity: 0.7 },
    saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, fontSize: 15, color: '#4b5563' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
    modalCard: { width: '100%', maxWidth: 380, backgroundColor: '#fff', borderRadius: 22, padding: 24, alignItems: 'center' },
    modalIconWrap: { width: 62, height: 62, borderRadius: 31, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    modalSuccess: { backgroundColor: '#16a34a' },
    modalError: { backgroundColor: '#dc2626' },
    modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 10 },
    modalMessage: { fontSize: 15, color: '#4b5563', textAlign: 'center', marginBottom: 22 },
    modalButton: { minWidth: 140, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
    modalButtonSuccess: { backgroundColor: '#16a34a' },
    modalButtonError: { backgroundColor: '#dc2626' },
    modalButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});