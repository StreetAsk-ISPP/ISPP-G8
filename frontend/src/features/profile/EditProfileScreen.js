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
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../app/providers/AuthProvider';
import apiClient from '../../shared/services/http/apiClient';

// --- CONFIGURACIÓN DE AVATARES PREDETERMINADOS ---
const PRESET_AVATARS = [
    { id: '1', url: 'https://cdn-icons-png.flaticon.com/512/616/616408.png' },
    { id: '2', url: 'https://cdn-icons-png.flaticon.com/512/616/616430.png' },
    { id: '3', url: 'https://cdn-icons-png.flaticon.com/512/616/616408.png' },
    { id: '4', url: 'https://cdn-icons-png.flaticon.com/512/1998/1998627.png' },
    { id: '5', url: 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png' },
    { id: '6', url: 'https://cdn-icons-png.flaticon.com/512/616/616554.png' },
];

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
        bio: '',
        profilePictureUrl: '',
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
        type: 'success',
        goBackOnClose: false,
    });

    const userId = useMemo(() => user?.id, [user]);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            showFeedback('Permisos', 'Necesitamos acceso a tus fotos para cambiar el perfil.', 'error');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled) {
            const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
            updateField('profilePictureUrl', base64Image);
        }
    };

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
        setFeedback(prev => ({ ...prev, visible: false, goBackOnClose: false }));
        if (shouldGoBack) { navigation.goBack(); }
    };

    useEffect(() => {
        if (!userId) { setLoading(false); return; }
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
                    bio: currentUser?.bio || '',
                    profilePictureUrl: currentUser?.profilePictureUrl || '',
                });
            } catch (error) {
                showFeedback('Error', 'No se pudieron cargar tus datos.', 'error');
            } finally { setLoading(false); }
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
        if (!form.email.trim()) { showFeedback('Validación', 'El email es obligatorio.', 'error'); return false; }
        if (!/\S+@\S+\.\S+/.test(form.email.trim())) { showFeedback('Validación', 'Introduce un email válido.', 'error'); return false; }
        if (!form.userName.trim()) { showFeedback('Validación', 'El nombre de usuario es obligatorio.', 'error'); return false; }
        if (form.bio.length > 255) { showFeedback('Validación', 'La biografía no puede superar los 255 caracteres.', 'error'); return false; }
        
        if (passwords.newPassword || passwords.confirmPassword) {
            if (passwords.newPassword.length < 6) {
                showFeedback('Validación', 'La contraseña debe tener al menos 6 caracteres.', 'error');
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
                bio: form.bio.trim(),
                profilePictureUrl: form.profilePictureUrl,
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
                    bio: updatedUser?.bio || '',
                    profilePictureUrl: updatedUser?.profilePictureUrl || '',
                }));
            }

            showFeedback('Perfil actualizado', 'Tus datos se han guardado correctamente.', 'success', true);
        } catch (error) {
            const message = error?.response?.data?.message || 'Error al guardar.';
            showFeedback('Error', message, 'error');
        } finally { setSaving(false); }
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
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>EDIT PROFILE</Text>
                <Text style={styles.headerSubtitle}>Personaliza tu presencia en la plataforma.</Text>
            </View>

            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
                
                {/* CARD 1: APARIENCIA */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Apariencia</Text>
                    
                    <View style={styles.avatarPickerSection}>
                        <TouchableOpacity onPress={pickImage} style={styles.avatarTouchable}>
                            <View style={styles.avatarCircle}>
                                {form.profilePictureUrl ? (
                                    <Image source={{ uri: form.profilePictureUrl }} style={styles.avatarImg} />
                                ) : (
                                    <Ionicons name="person" size={50} color="#9ca3af" />
                                )}
                            </View>
                            <View style={styles.cameraBadge}>
                                <Ionicons name="camera" size={18} color="#fff" />
                            </View>
                        </TouchableOpacity>
                        <View style={styles.avatarTextInfo}>
                            <Text style={styles.avatarTitle}>Foto de perfil</Text>
                            <Text style={styles.avatarSub}>Sube una foto o elige un avatar</Text>
                        </View>
                    </View>

                    {/* --- NUEVA FILA DE AVATARES PREDETERMINADOS --- */}
                    <Text style={styles.labelSmall}>Avatares rápidos</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetRow}>
                        {PRESET_AVATARS.map((avatar) => (
                            <TouchableOpacity 
                                key={avatar.id} 
                                onPress={() => updateField('profilePictureUrl', avatar.url)}
                                style={[
                                    styles.presetCircle,
                                    form.profilePictureUrl === avatar.url && styles.presetSelected
                                ]}
                            >
                                <Image source={{ uri: avatar.url }} style={styles.presetImg} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <Text style={styles.label}>Biografía</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={form.bio}
                        onChangeText={text => updateField('bio', text)}
                        placeholder="Cuenta algo sobre ti..."
                        placeholderTextColor="#9ca3af"
                        multiline
                        maxLength={255}
                    />
                    <Text style={styles.charCount}>{form.bio.length}/255</Text>
                </View>

                {/* CARD 2: DATOS PERSONALES */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Datos personales</Text>
                    <Text style={styles.label}>Nombre</Text>
                    <TextInput style={styles.input} value={form.firstName} onChangeText={text => updateField('firstName', text)} placeholder="Tu nombre" placeholderTextColor="#9ca3af" />
                    
                    <Text style={styles.label}>Apellidos</Text>
                    <TextInput style={styles.input} value={form.lastName} onChangeText={text => updateField('lastName', text)} placeholder="Tus apellidos" placeholderTextColor="#9ca3af" />

                    <Text style={styles.label}>Nombre de usuario</Text>
                    <TextInput style={styles.input} value={form.userName} onChangeText={text => updateField('userName', text)} placeholder="Tu nombre de usuario" autoCapitalize="none" placeholderTextColor="#9ca3af" />

                    <Text style={styles.label}>Email</Text>
                    <TextInput style={styles.input} value={form.email} onChangeText={text => updateField('email', text)} placeholder="tu@email.com" autoCapitalize="none" keyboardType="email-address" placeholderTextColor="#9ca3af" />
                </View>

                {/* CARD 3: SEGURIDAD */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Seguridad</Text>
                    <Text style={styles.label}>Nueva contraseña</Text>
                    <View style={styles.passwordWrapper}>
                        <TextInput style={styles.passwordInput} value={passwords.newPassword} onChangeText={text => updatePasswordField('newPassword', text)} placeholder="Nueva contraseña" secureTextEntry={!showPassword} autoCapitalize="none" placeholderTextColor="#9ca3af" />
                        <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
                            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Confirmar nueva contraseña</Text>
                    <View style={styles.passwordWrapper}>
                        <TextInput style={styles.passwordInput} value={passwords.confirmPassword} onChangeText={text => updatePasswordField('confirmPassword', text)} placeholder="Repite la nueva contraseña" secureTextEntry={!showConfirmPassword} autoCapitalize="none" placeholderTextColor="#9ca3af" />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(prev => !prev)}>
                            <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#6b7280" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={[styles.saveBtn, saving && styles.saveBtnDisabled]} onPress={handleSave} disabled={saving}>
                    {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>SAVE CHANGES</Text>}
                </TouchableOpacity>
            </ScrollView>

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
    labelSmall: { fontSize: 12, fontWeight: 'bold', color: '#9ca3af', marginBottom: 10, textTransform: 'uppercase' },
    input: { backgroundColor: '#f3f4f6', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: '#111827', borderWidth: 1, borderColor: '#e5e7eb' },
    textArea: { height: 100, textAlignVertical: 'top' },
    charCount: { textAlign: 'right', fontSize: 12, color: '#9ca3af', marginTop: 4 },
    
    avatarPickerSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    avatarTouchable: { position: 'relative' },
    avatarCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb' },
    avatarImg: { width: '100%', height: '100%' },
    cameraBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#d90429', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
    avatarTextInfo: { marginLeft: 20 },
    avatarTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
    avatarSub: { fontSize: 13, color: '#6b7280', marginTop: 2 },

    presetRow: { flexDirection: 'row', marginBottom: 20 },
    presetCircle: { width: 54, height: 54, borderRadius: 27, marginRight: 12, borderWidth: 2, borderColor: 'transparent', overflow: 'hidden', backgroundColor: '#f3f4f6' },
    presetSelected: { borderColor: '#d90429' },
    presetImg: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },

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