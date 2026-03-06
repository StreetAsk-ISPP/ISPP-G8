import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import {
    View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
    Switch, useWindowDimensions, Modal, Pressable,
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
    const [comingSoon, setComingSoon] = useState(false);

    const isFocused = useIsFocused();
    const latestRequestRef = useRef(0);

    const loadQuestions = useCallback(async () => {
        const requestId = ++latestRequestRef.current;
        try {
            const res = await apiClient.get('/api/v1/questions');
            const raw = res.data;

            if (requestId !== latestRequestRef.current) {
                return;
            }
            console.log('[HomeScreen] loaded questions:', raw);

            setQuestions(Array.isArray(raw) ? raw : []);
        } catch (e) {
            console.warn('Failed to load questions', e);
        }
    }, []);

    useFocusEffect(useCallback(() => { loadQuestions(); }, [loadQuestions]));

    useEffect(() => {
        const unsub = observeNotifications((n) => {
            console.log('[HomeScreen] notification received', JSON.stringify(n, null, 2));

            if (!isFocused) return;

            if (n?.type === 'NEARBY_QUESTION') {
                loadQuestions();
            }
        });

        return unsub;
    }, [isFocused, loadQuestions, observeNotifications]);

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
                        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7} onPress={() => setComingSoon(true)}>
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

            {/* ─── Coming Soon Modal ─── */}
            <Modal
                visible={comingSoon}
                transparent
                animationType="fade"
                onRequestClose={() => setComingSoon(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setComingSoon(false)}>
                    <View style={styles.modalBox}>
                        <Ionicons name="notifications" size={28} color="#667eea" />
                        <Text style={styles.modalTitle}>Coming Soon</Text>
                        <Text style={styles.modalMsg}>Notifications are not available yet.</Text>
                        <TouchableOpacity style={styles.modalBtn} onPress={() => setComingSoon(false)} activeOpacity={0.8}>
                            <Text style={styles.modalBtnText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
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

    /* ── Coming Soon Modal ── */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        backgroundColor: '#fff',
        borderRadius: 18,
        paddingVertical: 28,
        paddingHorizontal: 32,
        alignItems: 'center',
        width: 260,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 12,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
        marginTop: 10,
    },
    modalMsg: {
        fontSize: 13,
        color: '#6b7280',
        marginTop: 6,
        textAlign: 'center',
    },
    modalBtn: {
        marginTop: 18,
        backgroundColor: '#667eea',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 28,
    },
    modalBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});
