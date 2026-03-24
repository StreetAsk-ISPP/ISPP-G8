import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../../../shared/services/http/apiClient';

export default function AdminUsersScreen() {
    const navigation = useNavigation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const [modalVisible, setModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form, setForm] = useState({
        email: '',
        userName: '',
        firstName: '',
        lastName: '',
        authority: 'USER',
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/api/v1/users');
            if (response.data) {
                setUsers(response.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            Alert.alert("Error", "No se pudieron cargar los usuarios");
        } finally {
            setLoading(false);
        }
    };

    // Sólo permitimos edición, no creación desde el panel admin
    // const openCreateModal = () => {
    //     Alert.alert(
    //         'Acción no disponible',
    //         'La creación de usuarios no está permitida desde el panel de administración.',
    //     );
    // };

    const openEditModal = (user) => {
        setEditingUser(user);
        setForm({
            email: user.email || '',
            userName: user.username || user.userName || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            authority: user.authorities?.[0]?.authority || 'USER',
        });
        setModalVisible(true);
    };

    const handleSaveUser = async () => {
        try {
            if (!form.email || !form.userName) {
                Alert.alert('Datos incompletos', 'Email y usuario son obligatorios');
                return;
            }

            let response;

            if (editingUser) {
                const payload = {
                    ...editingUser,
                    email: form.email,
                    username: form.userName,
                    userName: form.userName,
                    firstName: form.firstName,
                    lastName: form.lastName,
                };

                response = await apiClient.put(`/api/v1/users/${editingUser.id}`, payload);
                const updated = response.data;

                setUsers(prev => prev.map(u => (u.id === editingUser.id ? updated : u)));
            } else {
                // Creación deshabilitada desde el panel admin
                Alert.alert(
                    'Acción no disponible',
                    'La creación de usuarios se debe realizar desde el flujo de registro de la aplicación.',
                );
                return;
            }

            setModalVisible(false);
            setEditingUser(null);
        } catch (error) {
            console.error('Error saving user', error?.response || error);
            const msg =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                'No se ha podido guardar el usuario';
            Alert.alert('Error', msg);
        }
    };

    const handleDeleteUser = async (user) => {
        try {
            console.log('Deleting user directly:', user.id);
            const res = await apiClient.delete(`/api/v1/users/${user.id}`);
            console.log('Delete response status:', res.status, 'data:', res.data);

            setUsers(prev => prev.filter(u => u.id !== user.id));
        } catch (error) {
            console.error(
                'Error deleting user:',
                error?.response?.status,
                error?.response?.data || error,
            );
            const msg =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                (error?.response?.status === 403
                    ? 'No puedes eliminar este usuario'
                    : 'No se pudo eliminar el usuario');
            Alert.alert('Error', msg);
        }
    };

    const filteredUsers = users.filter(user =>
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderUserItem = ({ item }) => {
        const displayName = item.username || item.userName || '';
        return (
            <View style={styles.userCard}>
                <View style={styles.userInfo}>
                    <View style={[styles.avatar, { backgroundColor: item.role === 'ADMIN' ? '#e3f2fd' : '#f5f5f5' }]}>
                        <Text style={[styles.avatarText, { color: item.role === 'ADMIN' ? '#007bff' : '#666' }]}>
                            {displayName ? displayName.charAt(0).toUpperCase() : '?'}
                        </Text>
                    </View>
                    <View style={styles.userDetails}>
                        <Text style={styles.userName}>{displayName}</Text>
                        <Text style={styles.userEmail}>{item.email}</Text>
                        <View style={styles.badgesContainer}>
                            <View style={[styles.badge, item.active ? styles.activeBadge : styles.inactiveBadge]}>
                                <Text style={[styles.badgeText, item.active ? styles.activeText : styles.inactiveText]}>
                                    {item.active ? 'Activo' : 'Inactivo'}
                                </Text>
                            </View>
                            {item.role === 'ADMIN' && (
                                <View style={[styles.badge, styles.adminBadge]}>
                                    <Text style={[styles.badgeText, styles.adminText]}>ADMIN</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#e3f2fd' }]}
                        onPress={() => openEditModal(item)}
                    >
                        <Ionicons name="pencil-outline" size={20} color="#007bff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => handleDeleteUser(item)}
                    >
                        <Ionicons name="trash-outline" size={20} color="#d90429" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Gestionar Usuarios</Text>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={fetchUsers} style={styles.refreshButton}>
                        <Ionicons name="refresh" size={22} color="#007bff" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar por nombre o email..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
            ) : (
                <FlatList
                    data={filteredUsers}
                    renderItem={renderUserItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No se encontraron usuarios</Text>
                    }
                />
            )}

            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {editingUser ? 'Editar usuario' : 'Usuario'}
                        </Text>

                        {['email', 'userName', 'firstName', 'lastName'].map((field) => (
                            <View key={field} style={styles.modalField}>
                                <Text style={styles.inputLabel}>
                                    {field === 'userName'
                                        ? 'Usuario'
                                        : field === 'firstName'
                                            ? 'Nombre'
                                            : field === 'lastName'
                                                ? 'Apellidos'
                                                : 'Email'}
                                </Text>
                                <TextInput
                                    style={styles.modalInput}
                                    autoCapitalize={field === 'email' || field === 'userName' ? 'none' : 'sentences'}
                                    keyboardType={field === 'email' ? 'email-address' : 'default'}
                                    value={form[field]}
                                    onChangeText={(text) => setForm(prev => ({ ...prev, [field]: text }))}
                                />
                            </View>
                        ))}

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleSaveUser}
                            >
                                <Text style={styles.saveButtonText}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    backButton: { padding: 5 },
    refreshButton: { padding: 5 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        margin: 15,
        paddingHorizontal: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eee',
        height: 45
    },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 16 },
    listContent: { padding: 15 },
    loader: { marginTop: 50 },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 },
    userCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2
    },
    userInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    avatarText: { fontSize: 20, fontWeight: 'bold' },
    userDetails: { flex: 1 },
    userName: { fontSize: 16, fontWeight: '600', color: '#333' },
    userEmail: { fontSize: 12, color: '#666', marginTop: 2 },
    badgesContainer: { flexDirection: 'row', marginTop: 5, gap: 5 },
    badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    badgeText: { fontSize: 10, fontWeight: '600' },
    activeBadge: { backgroundColor: '#e8f5e9' },
    activeText: { color: '#2e7d32' },
    inactiveBadge: { backgroundColor: '#ffebee' },
    inactiveText: { color: '#c62828' },
    adminBadge: { backgroundColor: '#e3f2fd' },
    adminText: { color: '#1565c0' },
    actions: { flexDirection: 'row' },
    actionButton: { padding: 8, marginLeft: 5, borderRadius: 8, backgroundColor: '#f5f5f5' },
    deleteButton: { backgroundColor: '#ffebee' },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxWidth: 420,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#111827' },
    modalField: { marginBottom: 12 },
    inputLabel: { marginBottom: 4, color: '#4b5563', fontSize: 14 },
    modalInput: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 16,
    },
    modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
    modalButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
    cancelButton: { marginRight: 8, backgroundColor: 'transparent' },
    cancelButtonText: { color: '#6b7280', fontWeight: '600' },
    saveButton: { backgroundColor: '#2563eb' },
    saveButtonText: { color: 'white', fontWeight: '600' },
});