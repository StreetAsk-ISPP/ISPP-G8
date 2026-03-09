import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../app/providers/AuthProvider'; // <-- Importamos el Auth

export default function ProfileStats() {
    const navigation = useNavigation();
    const { user } = useAuth(); // <-- Extraemos el usuario real
    const [activeTab, setActiveTab] = useState('preguntas');

    // Datos de estadísticas (Mantenemos mock hasta que el backend los proporcione)
    const stats = {
        preguntas: 8,
        respuestas: 24,
        likes: 156,
        dislikes: 12,
        coins: user?.coins || 0, // <-- Intentamos sacar las coins del usuario real si existen
        rango: user?.role === 'ADMIN' ? 'Moderador' : 'Sabio Local' // <-- Rango basado en el rol real
    };

    const myQuestions = [
        { id: 'q1', text: '¿Dónde está la mejor tortilla?', date: '08 Mar 2026' },
        { id: 'q2', text: '¿Horario de la biblioteca municipal?', date: '06 Mar 2026' },
    ];

    const myAnswers = [
        { id: 'a1', text: 'En el bar de la esquina abren a las 8:00.', date: '07 Mar 2026' },
        { id: 'a2', text: 'Hay un parking gratis a dos calles.', date: '04 Mar 2026' },
    ];

    const renderHistoryItem = (item) => (
        <View key={item.id} style={styles.historyItem}>
            <View style={styles.iconCircle}>
                <Ionicons
                    name={activeTab === 'preguntas' ? "help-circle-outline" : "chatbubble-ellipses-outline"}
                    size={24}
                    color="#d90429"
                />
            </View>
            <View style={styles.historyText}>
                <Text style={styles.itemTitle}>{activeTab === 'preguntas' ? 'Pregunta:' : 'Respuesta:'} {item.text}</Text>
                <Text style={styles.itemDate}>{item.date}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.navBar}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <View style={styles.logoContainer}>
                    <Ionicons name="location" size={24} color="white" />
                    <Text style={styles.logoText}>Streetask - {user?.username || 'Perfil'}</Text>
                </View>
            </View>

            <ScrollView style={styles.container}>
                <View style={styles.headerCard}>
                    <Text style={styles.rangoText}>{stats.rango}</Text>
                    <Text style={styles.userEmailText}>{user?.email}</Text>
                    <View style={styles.coinsRow}>
                        <Ionicons name="star" size={20} color="#FFD700" />
                        <Text style={styles.coinsText}>{stats.coins} StreetCoins</Text>
                    </View>
                </View>

                <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{stats.preguntas}</Text>
                        <Text style={styles.statLabel}>Preguntas Creadas</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{stats.respuestas}</Text>
                        <Text style={styles.statLabel}>Respuestas Dadas</Text>
                    </View>
                    <View style={[styles.statBox, { borderBottomColor: '#4CAF50', borderBottomWidth: 4 }]}>
                        <Text style={styles.statValue}>{stats.likes} 👍</Text>
                        <Text style={styles.statLabel}>Likes Recibidos</Text>
                    </View>
                    <View style={[styles.statBox, { borderBottomColor: '#F44336', borderBottomWidth: 4 }]}>
                        <Text style={styles.statValue}>{stats.dislikes} 👎</Text>
                        <Text style={styles.statLabel}>Dislikes Recibidos</Text>
                    </View>
                </View>

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

                <View style={styles.historyList}>
                    {activeTab === 'preguntas'
                        ? myQuestions.map(renderHistoryItem)
                        : myAnswers.map(renderHistoryItem)
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#d90429' }, // Rojo consistente con la otra pantalla
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        paddingTop: 40,
        justifyContent: 'center',
        backgroundColor: '#d90429'
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
        elevation: 5
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
        elevation: 2
    },
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
    itemDate: { fontSize: 12, color: '#999', marginTop: 4 }
});