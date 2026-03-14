import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import {
    View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
    Switch, useWindowDimensions, Modal, Pressable, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapComponent from './components/MapComponent';
import { useAuth } from '../../../app/providers/AuthProvider';
import { useNotifications } from '../../../app/providers/NotificationProvider';
import { APP_CONFIG } from '../../../app/config/config';
import apiClient from '../../../shared/services/http/apiClient';
import { Image } from 'react-native';
import { bootstrapWebPushNotifications } from '../../../shared/services/notifications/webPushBootstrap';
import { updateWebPushZone } from '../../../shared/services/notifications/webPushService';
import { resolveZoneKey } from '../../../shared/services/notifications/zoneService';

export default function HomeScreen({ navigation }) {
    const { logout, token } = useAuth();
    const { ephemeralNotification, observeNotifications } = useNotifications();
    const { width } = useWindowDimensions();
    const isNarrow = width < 500;

    const [questions, setQuestions] = useState([]);
    const [showQuestions, setShowQuestions] = useState(true);
    const [comingSoon, setComingSoon] = useState(false);
    const [modalType, setModalType] = useState('notifications');
    const [currentLocation, setCurrentLocation] = useState(null);

    const pushBootstrappedRef = useRef(false);
    const pushSubscriptionRef = useRef(null);
    const pushZoneKeyRef = useRef(null);

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

            setQuestions(Array.isArray(raw) ? raw : []);
        } catch (e) {
            console.warn('Failed to load questions', e);
        }
    }, []);

    useFocusEffect(useCallback(() => { loadQuestions(); }, [loadQuestions]));

    useEffect(() => {
        const unsub = observeNotifications((n) => {
            if (!isFocused) return;

            if (n?.type === 'NEARBY_QUESTION') {
                loadQuestions();
            }

            if (
                (n?.type === 'NEARBY_QUESTION' || n?.type === 'ANSWER_TO_QUESTION') &&
                n?.referenceId
            ) {
                // TODO: enable automatic navigation to the question thread when a notification is received.
                // This should open the QuestionThread screen using the referenceId provided in the notification payload.
                // navigation.navigate('QuestionThread', { questionId: n.referenceId });
            }
        });

        return unsub;
    }, [isFocused, loadQuestions, observeNotifications]);

    useEffect(() => {
        async function initPush() {
            try {
                if (Platform.OS !== 'web') {
                    return;
                }

                if (!token) {
                    pushBootstrappedRef.current = false;
                    pushSubscriptionRef.current = null;
                    pushZoneKeyRef.current = null;
                    return;
                }

                if (pushBootstrappedRef.current) {
                    return;
                }

                // Keep push registration aligned with the same backend used by the API client.
                const apiBaseUrl = APP_CONFIG.apiBaseUrl;

                const { subscription } = await bootstrapWebPushNotifications({
                    authToken: token,
                    apiBaseUrl,
                    latitude: currentLocation?.latitude,
                    longitude: currentLocation?.longitude,
                    onNotificationClick: (data) => {
                        if (
                            (data?.type === 'NEARBY_QUESTION' || data?.type === 'ANSWER_TO_QUESTION') &&
                            data?.referenceId
                        ) {
                            navigation.navigate('QuestionThread', { questionId: data.referenceId });
                        }
                    },
                });

                if (subscription) {
                    pushSubscriptionRef.current = subscription;
                    pushBootstrappedRef.current = true;
                }
            } catch (error) {
                console.error('Error bootstrapping web push notifications:', error);
            }
        }

        initPush();
    }, [token, currentLocation, navigation]);

    useEffect(() => {
        async function syncPushZone() {
            try {
                if (Platform.OS !== 'web' || !token || !pushSubscriptionRef.current) {
                    return;
                }

                if (
                    typeof currentLocation?.latitude !== 'number' ||
                    typeof currentLocation?.longitude !== 'number'
                ) {
                    return;
                }

                const zoneKey = resolveZoneKey(currentLocation.latitude, currentLocation.longitude);
                if (!zoneKey || pushZoneKeyRef.current === zoneKey) {
                    return;
                }

                await updateWebPushZone(
                    pushSubscriptionRef.current,
                    zoneKey,
                    token,
                    APP_CONFIG.apiBaseUrl
                );
                pushZoneKeyRef.current = zoneKey;
            } catch (error) {
                console.error('Error updating push notification zone:', error);
            }
        }

        syncPushZone();
    }, [token, currentLocation]);

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.container}>
                <View style={[styles.topBar, isNarrow && { paddingHorizontal: 12 }]}>
                    <View style={styles.topBarLeft}>
                        <View style={styles.logoBadge}>
                            <Image
                                source={require("../../../../assets/logo.png")}
                                style={{ width: 18, height: 28 }}
                            />
                        </View>
                        <Text style={styles.appName}>StreetAsk</Text>
                    </View>

                    <View style={styles.topBarRight}>
                        <TouchableOpacity
                            style={styles.iconBtn}
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate('Profile')}
                        >
                            <Ionicons name="person-outline" size={20} color="#374151" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.iconBtn}
                            activeOpacity={0.7}
                            onPress={() => { setModalType('search'); setComingSoon(true); }}
                        >
                            <Ionicons name="search-outline" size={20} color="#a52019" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.iconBtn}
                            activeOpacity={0.7}
                            onPress={() => { setModalType('notifications'); setComingSoon(true); }}
                        >
                            <Ionicons name="notifications-outline" size={20} color="#a52019" />
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

                {ephemeralNotification ? (
                    <View style={styles.notifBanner}>
                        <Ionicons name="information-circle" size={18} color="#92400e" />
                        <View style={{ flex: 1, marginLeft: 8 }}>
                            <Text style={styles.notifTitle}>{ephemeralNotification.title || 'Notification'}</Text>
                            <Text style={styles.notifMsg}>{ephemeralNotification.message || ''}</Text>
                        </View>
                    </View>
                ) : null}

                <View style={styles.mapWrapper}>
                    <MapComponent
                        questions={showQuestions ? questions : []}
                        onQuestionPress={(qId) => navigation.navigate('QuestionThread', { questionId: qId })}
                        onLocationChange={setCurrentLocation}
                    />
                </View>

                <View style={[styles.footer, isNarrow && { paddingHorizontal: 14 }]}>
                    <Text style={styles.toggleLabel}>Show Questions</Text>
                    <Switch
                        value={showQuestions}
                        onValueChange={setShowQuestions}
                        trackColor={{ false: '#d1d5db', true: '#a52019' }}
                        thumbColor="#fff"
                    />
                </View>

                <TouchableOpacity
                    style={[styles.fab, isNarrow && { width: 220 }]}
                    onPress={() => navigation.navigate('CreateQuestion')}
                    activeOpacity={0.85}
                >
                    <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
                    <Text style={styles.fabText}>Ask a question</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={comingSoon}
                transparent
                animationType="fade"
                onRequestClose={() => setComingSoon(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setComingSoon(false)}>
                    <View style={styles.modalBox}>
                        <Ionicons
                            name={modalType === 'search' ? 'search' : 'notifications'}
                            size={28}
                            color="#a52019"
                        />

                        <Text style={styles.modalTitle}>Coming Soon</Text>

                        <Text style={styles.modalMsg}>
                            {modalType === 'search'
                                ? 'Search is not available yet.'
                                : 'Notifications are not available yet.'}
                        </Text>

                        <TouchableOpacity
                            style={styles.modalBtn}
                            onPress={() => setComingSoon(false)}
                            activeOpacity={0.8}
                        >
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
        width: 38,
        height: 38,
        borderRadius: 10,
        backgroundColor: '#a52019',
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
        backgroundColor: '#a52019',
    },
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
    mapWrapper: {
        flex: 1,
        overflow: 'hidden',
    },
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
        color: '#a52019',
    },
    fab: {
        position: 'absolute',
        bottom: 76,
        alignSelf: 'center',
        width: 260,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#a52019',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        shadowColor: '#a52019',
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
        backgroundColor: '#a52019',
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