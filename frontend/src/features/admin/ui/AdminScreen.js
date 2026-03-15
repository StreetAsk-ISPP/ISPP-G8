import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../app/providers/AuthProvider';
import apiClient from '../../../shared/services/http/apiClient';

export default function AdminScreen() {
    const navigation = useNavigation();
    const { logout } = useAuth();
    const [stats, setStats] = useState({ users: 0, questions: 0, answers: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = () => {
        setLoading(true);

        Promise.all([
            apiClient.get('/api/v1/users'),
            apiClient.get('/api/v1/questions'),
            apiClient.get('/api/v1/answers'),
        ])
            .then(([usersRes, questionsRes, answersRes]) => {
                setStats({
                    users: usersRes.data?.length || 0,
                    questions: questionsRes.data?.length || 0,
                    answers: answersRes.data?.length || 0,
                });
            })
            .catch((error) => {
                console.error('Error fetching admin data:', error);
                Alert.alert('Error', 'No se pudieron cargar los datos del panel');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error(error);
        }
    };

    const menuItems = [
        { id: 'users', title: 'Gestionar Usuarios', icon: 'people', route: 'AdminUsers' },
        { id: 'feedback', title: 'Feedback Recibido', icon: 'chatbox-ellipses', route: 'AdminFeedback' },
        { id: 'app', title: 'Ir a la App', icon: 'phone-portrait', route: 'Home' },
    ];

    const renderMenuItem = ({ item }) => (
        <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.route)}
        >
            <View style={[styles.iconContainer, { backgroundColor: '#e3f2fd' }]}>
                <Ionicons name={item.icon} size={24} color="#007bff" />
            </View>
            <Text style={styles.menuItemText}>{item.title}</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Panel de Administración</Text>
                    <Text style={styles.headerSubtitle}>Bienvenido, Administrador</Text>
                </View>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={24} color="#d90429" />
                </TouchableOpacity>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{stats.users}</Text>
                    <Text style={styles.statLabel}>Usuarios</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{stats.questions}</Text>
                    <Text style={styles.statLabel}>Preguntas</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{stats.answers}</Text>
                    <Text style={styles.statLabel}>Respuestas</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Acciones Rápidas</Text>

            <FlatList
                data={menuItems}
                renderItem={renderMenuItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.menuList}
                scrollEnabled={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
        marginTop: 10
    },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    headerSubtitle: { fontSize: 14, color: '#666' },
    logoutButton: { padding: 10, backgroundColor: '#fff0f3', borderRadius: 10 },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30
    },
    statCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 15,
        width: '31%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2
    },
    statValue: { fontSize: 22, fontWeight: 'bold', color: '#007bff', marginBottom: 5 },
    statLabel: { fontSize: 12, color: '#666' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
    menuList: { gap: 15 },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
        marginBottom: 15
    },
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    menuItemText: { flex: 1, fontSize: 16, fontWeight: '500', color: '#333' }
});