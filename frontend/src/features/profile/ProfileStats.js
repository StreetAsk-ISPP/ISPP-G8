import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../app/providers/AuthProvider';
import apiClient from '../../shared/services/http/apiClient';

export default function ProfileStats() {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('preguntas');

    // Estados para datos del servidor
    const [serverStats, setServerStats] = useState({
        preguntas: 0,
        respuestas: 0,
        username: '',
        role: '',
        likes: 0
    });
    const [userQuestions, setUserQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                // Ejecutamos las 3 peticiones en paralelo para mayor velocidad
                const [resStats, resQuestions, resAnswers] = await Promise.all([
                    apiClient.get(`/api/v1/users/${user.id}/stats`),
                    apiClient.get(`/api/v1/users/${user.id}/questions`),
                    apiClient.get(`/api/v1/users/${user.id}/answers`)
                ]);

                if (resStats.data) {
                    const data = resStats.data;
                    setServerStats({
                        preguntas: data.questionsCount,
                        respuestas: data.answersCount,
                        username: data.username,
                        role: data.role === 'ADMIN' ? 'Moderador' : 'Sabio Local',
                        likes: data.likesCount || 0
                    });
                }

                if (resQuestions.data) setUserQuestions(resQuestions.data);
                if (resAnswers.data) setUserAnswers(resAnswers.data);

            } catch (error) {
                console.error("Error cargando datos de perfil:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [user]);

    const renderHistoryItem = (item, type) => (
        <View key={item.id} style={styles.historyItem}>
            <View style={styles.iconCircle}>
                <Ionicons
                    name={type === 'preguntas' ? "help-circle-outline" : "chatbubble-ellipses-outline"}
                    size={24}
                    color="#d90429"
                />
            </View>
            <View style={styles.historyText}>
                <Text style={styles.itemTitle} numberOfLines={2}>
                    {type === 'preguntas' ? 'Q: ' : 'A: '}
                    {item.text || item.title || "Sin contenido"}
                </Text>
                <Text style={styles.itemDate}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Fecha desconocida'}
                </Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={[styles.safeArea, styles.center]}>
                <ActivityIndicator size="large" color="white" />
                <Text style={styles.loadingText}>Sincronizando con Streetask...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header / NavBar */}
            <View style={styles.navBar}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <View style={styles.logoContainer}>
                    <Ionicons name="location" size={24} color="white" />
                    <Text style={styles.logoText}>{serverStats.username || 'Mi Perfil'}</Text>
                </View>
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Card de Rango y Coins */}
                <View style={styles.headerCard}>
                    <Text style={styles.rangoText}>{serverStats.role}</Text>
                    <Text style={styles.userEmailText}>{user?.username}</Text>
                    <View style={styles.coinsRow}>
                        <Ionicons name="star" size={20} color="#FFD700" />
                        <Text style={styles.coinsText}>{serverStats.likes * 10} StreetCoins</Text>
                    </View>
                </View>

                {/* Grid de Estadísticas */}
                <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{serverStats.preguntas}</Text>
                        <Text style={styles.statLabel}>Preguntas Creadas</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{serverStats.respuestas}</Text>
                        <Text style={styles.statLabel}>Respuestas Dadas</Text>
                    </View>
                    <View style={[styles.statBox, styles.borderGreen]}>
                        <Text style={styles.statValue}>{serverStats.likes} 👍</Text>
                        <Text style={styles.statLabel}>Likes Recibidos</Text>
                    </View>
                    <View style={[styles.statBox, styles.borderRed]}>
                        <Text style={styles.statValue}>0 👎</Text>
                        <Text style={styles.statLabel}>Dislikes Recibidos</Text>
                    </View>
                </View>

                {/* Tabs de Historial */}
                <Text style={styles.sectionTitle}>Historial de Actividad</Text>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'preguntas' && styles.activeTab]}
                        onPress={() => setActiveTab('preguntas')}
                    >
                        <Text style={activeTab === 'preguntas' ? styles.activeTabText : styles.tabText}>Mis Preguntas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'respuestas' && styles.activeTab]}
                        onPress={() => setActiveTab('respuestas')}
                    >
                        <Text style={activeTab === 'respuestas' ? styles.activeTabText : styles.tabText}>Mis Respuestas</Text>
                    </TouchableOpacity>
                </View>

                {/* Lista de Historial */}
                <View style={styles.historyList}>
                    {activeTab === 'preguntas' ? (
                        userQuestions.length > 0
                            ? userQuestions.map(q => renderHistoryItem(q, 'preguntas'))
                            : <Text style={styles.emptyText}>Aún no has hecho preguntas.</Text>
                    ) : (
                        userAnswers.length > 0
                            ? userAnswers.map(a => renderHistoryItem(a, 'respuestas'))
                            : <Text style={styles.emptyText}>Aún no has respondido ninguna duda.</Text>
                    )}
                </View>
                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#d90429' },
    center: { justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: 'white', marginTop: 10, fontWeight: '500' },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        paddingTop: 40,
        justifyContent: 'center',
    },
    backButton: { position: 'absolute', left: 15, top: 40 },
    logoContainer: { flexDirection: 'row', alignItems: 'center' },
    logoText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 5 },
    container: { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20 },
    headerCard: {
        backgroundColor: '#b90421',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        marginBottom: 25,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    rangoText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
    userEmailText: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4 },
    coinsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    coinsText: { color: '#fff', marginLeft: 8, fontSize: 18, fontWeight: '500' },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
    statBox: {
        backgroundColor: '#fff',
        width: '48%',
        padding: 18,
        borderRadius: 15,
        marginBottom: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee',
        elevation: 2,
    },
    borderGreen: { borderBottomColor: '#4CAF50', borderBottomWidth: 4 },
    borderRed: { borderBottomColor: '#F44336', borderBottomWidth: 4 },
    statValue: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    statLabel: { fontSize: 12, color: '#666', marginTop: 5, textAlign: 'center' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333', textAlign: 'center' },
    tabContainer: { flexDirection: 'row', backgroundColor: '#f0f0f0', borderRadius: 12, padding: 5, marginBottom: 20 },
    tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
    activeTab: { backgroundColor: '#fff', elevation: 2 },
    tabText: { color: '#666', fontWeight: '500' },
    activeTabText: { color: '#d90429', fontWeight: 'bold' },
    historyItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 15,
        marginBottom: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f0f0f0'
    },
    iconCircle: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#fff1f1', justifyContent: 'center', alignItems: 'center' },
    historyText: { marginLeft: 15, flex: 1 },
    itemTitle: { fontSize: 14, fontWeight: '600', color: '#333' },
    itemDate: { fontSize: 12, color: '#999', marginTop: 4 },
    emptyText: { textAlign: 'center', color: '#999', marginTop: 20, fontStyle: 'italic' }
});