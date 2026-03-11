import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../app/providers/AuthProvider';
import apiClient from '../../shared/services/http/apiClient';

export default function ProfileStats() {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('questions');

    const [serverStats, setServerStats] = useState({
        questions: 0,
        answers: 0,
        username: '',
        role: '',
        likes: 0,
        dislikes: 0,
        reputation: 0
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
                        questions: data.questionsCount,
                        answers: data.answersCount,
                        username: data.username,
                        role: data.role === 'ADMIN' ? 'Moderator' : 'Local Expert',
                        likes: data.likesCount || 0,
                        dislikes: data.dislikesCount || 0,
                        reputation: data.reputation || 0
                    });
                }

                if (resQuestions.data) setUserQuestions(resQuestions.data);
                if (resAnswers.data) setUserAnswers(resAnswers.data);

            } catch (error) {
                console.error("Error loading profile data:", error);
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
                    name={type === 'questions' ? "help-circle-outline" : "chatbubble-ellipses-outline"}
                    size={24}
                    color="#d90429"
                />
            </View>
            <View style={styles.historyText}>
                <Text style={styles.itemTitle} numberOfLines={2}>
                    {type === 'questions' ? 'Q: ' : 'A: '}
                    {item.text || item.title || "No content"}
                </Text>
                <Text style={styles.itemDate}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Unknown date'}
                </Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={[styles.safeArea, styles.center]}>
                <ActivityIndicator size="large" color="white" />
                <Text style={styles.loadingText}>Syncing with Streetask...</Text>
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
                    <Text style={styles.logoText}>{serverStats.username || 'My Profile'}</Text>
                </View>
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Rank & Coins Card */}
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
                        <Text style={styles.statValue}>{serverStats.questions}</Text>
                        <Text style={styles.statLabel}>Asked questions</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{serverStats.answers}</Text>
                        <Text style={styles.statLabel}>Answered questions</Text>
                    </View>
                    <View style={[styles.statBox, styles.borderGreen]}>
                        <Text style={styles.statValue}>{serverStats.likes} 👍</Text>
                        <Text style={styles.statLabel}>Likes received</Text>
                    </View>
                    <View style={[styles.statBox, styles.borderRed]}>
                        <Text style={styles.statValue}>{serverStats.dislikes} 👎</Text>
                        <Text style={styles.statLabel}>Dislikes received</Text>
                    </View>
                </View>

                {/* Reputation Card */}
                <View style={styles.reputationCard}>
                    <View style={styles.reputationLeft}>
                        <Ionicons name="trophy" size={36} color="#F5A623" />
                    </View>
                    <View style={styles.reputationCenter}>
                        <Text style={styles.reputationTitle}>Reputation Score</Text>
                        <Text style={styles.reputationSub}>Based on your answers' votes</Text>
                    </View>
                    <View style={styles.reputationRight}>
                        <Text style={styles.reputationValue}>{serverStats.reputation}</Text>
                        <Text style={styles.reputationPts}>pts</Text>
                    </View>
                </View>

                {/* Activity History */}
                <Text style={styles.sectionTitle}>Activity History</Text>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'questions' && styles.activeTab]}
                        onPress={() => setActiveTab('questions')}
                    >
                        <Text style={activeTab === 'questions' ? styles.activeTabText : styles.tabText}>My Questions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'answers' && styles.activeTab]}
                        onPress={() => setActiveTab('answers')}
                    >
                        <Text style={activeTab === 'answers' ? styles.activeTabText : styles.tabText}>My Answers</Text>
                    </TouchableOpacity>
                </View>

                {/* History List */}
                <View style={styles.historyList}>
                    {activeTab === 'questions' ? (
                        userQuestions.length > 0
                            ? userQuestions.map(q => renderHistoryItem(q, 'questions'))
                            : <Text style={styles.emptyText}>{"You haven't asked any questions yet."}</Text>
                    ) : (
                        userAnswers.length > 0
                            ? userAnswers.map(a => renderHistoryItem(a, 'answers'))
                            : <Text style={styles.emptyText}>{"You haven't answered any questions yet."}</Text>
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
    reputationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 18,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#F5A623',
        elevation: 3,
        shadowColor: '#F5A623',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    reputationLeft: { marginRight: 14 },
    reputationCenter: { flex: 1 },
    reputationTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    reputationSub: { fontSize: 12, color: '#999', marginTop: 2 },
    reputationRight: { alignItems: 'center' },
    reputationValue: { fontSize: 32, fontWeight: 'bold', color: '#F5A623' },
    reputationPts: { fontSize: 12, color: '#F5A623', fontWeight: '600', marginTop: -4 },
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