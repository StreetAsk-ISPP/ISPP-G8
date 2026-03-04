import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
    Switch, useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapComponent from './components/MapComponent';
import { useAuth } from '../../../app/providers/AuthProvider';
import { useNotifications } from '../../../app/providers/NotificationProvider';
import apiClient from '../../../shared/services/http/apiClient';

export default function HomeScreen({ navigation }) {
    const { logout } = useAuth();
    const { ephemeralNotification, observeNotifications } = useNotifications();
    const { width } = useWindowDimensions();
    const isNarrow = width < 500;

    const [questions, setQuestions] = useState([]);
    const [showQuestions, setShowQuestions] = useState(true);

    const loadQuestions = useCallback(async () => {
        try {
            const res = await apiClient.get('/api/v1/questions');
            const raw = res.data;
            setQuestions(Array.isArray(raw) ? raw : []);
        } catch (e) {
            console.warn('Failed to load questions', e);
        }
    }, []);

    useFocusEffect(useCallback(() => { loadQuestions(); }, [loadQuestions]));

    useEffect(() => {
        const unsub = observeNotifications((n) => {
            if (n?.type === 'NEARBY_QUESTION') loadQuestions();
        });
        return unsub;
    }, [loadQuestions, observeNotifications]);

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.container}>
                {/* ─── Top Bar ─── */}
                <View style={[styles.topBar, isNarrow && { paddingHorizontal: 12 }]}>
                    <View style={styles.topBarLeft}>
                        <View style={styles.logoBadge}>
                            <Ionicons name="map" size={18} color="#fff" />
                        </View>
                        <Text style={styles.appName}>StreetAsk</Text>
                    </View>

                    <View style={styles.topBarRight}>
                        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
                            <Ionicons name="search-outline" size={20} color="#374151" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
                            <Ionicons name="notifications-outline" size={20} color="#374151" />
                            {ephemeralNotification ? <View style={styles.badge} /> : null}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.iconBtn, styles.logoutBtn]}
                            onPress={logout}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ─── Notification banner ─── */}
                {ephemeralNotification ? (
                    <View style={styles.notifBanner}>
                        <Ionicons name="information-circle" size={18} color="#92400e" />
                        <View style={{ flex: 1, marginLeft: 8 }}>
                            <Text style={styles.notifTitle}>{ephemeralNotification.title || 'Notification'}</Text>
                            <Text style={styles.notifMsg}>{ephemeralNotification.message || ''}</Text>
                        </View>
                    </View>
                ) : null}

                {/* ─── Map ─── */}
                <View style={styles.mapWrapper}>
                    <MapComponent
                        questions={showQuestions ? questions : []}
                        onQuestionPress={(qId) => navigation.navigate('QuestionThread', { questionId: qId })}
                    />
                </View>

                {/* ─── Footer ─── */}
                <View style={[styles.footer, isNarrow && { paddingHorizontal: 14 }]}>
                    <Text style={styles.toggleLabel}>Show Questions</Text>
                    <Switch
                        value={showQuestions}
                        onValueChange={setShowQuestions}
                        trackColor={{ false: '#d1d5db', true: '#667eea' }}
                        thumbColor="#fff"
                    />
                </View>

                {/* ─── Floating "Ask" button ─── */}
                <TouchableOpacity
                    style={[styles.fab, isNarrow && { width: 220 }]}
                    onPress={() => navigation.navigate('CreateQuestion')}
                    activeOpacity={0.85}
                >
                    <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
                    <Text style={styles.fabText}>Ask a question</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    container: {
        flex: 1,
        position: 'relative',
    },

    /* ── Top Bar ── */
    topBar: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    topBarLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    logoBadge: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: '#667eea',
        alignItems: 'center',
        justifyContent: 'center',
    },
    appName: {
        fontSize: 17,
        fontWeight: '800',
        color: '#1f2937',
    },
    topBarRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    iconBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutBtn: {
        backgroundColor: '#fef2f2',
    },
    badge: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ef4444',
    },

    /* ── Notification ── */
    notifBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fffbeb',
        borderBottomWidth: 1,
        borderBottomColor: '#fcd34d',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    notifTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#92400e',
    },
    notifMsg: {
        fontSize: 13,
        color: '#78350f',
        marginTop: 1,
    },

    /* ── Map ── */
    mapWrapper: {
        flex: 1,
        overflow: 'hidden',
    },

    /* ── Footer ── */
    footer: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    toggleLabel: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },

    /* ── FAB ── */
    fab: {
        position: 'absolute',
        bottom: 76,
        alignSelf: 'center',
        width: 260,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#667eea',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 10,
    },
    fabText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
});
