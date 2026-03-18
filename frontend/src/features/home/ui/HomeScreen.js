import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Switch,
    useWindowDimensions,
    Modal,
    Pressable,
    Platform,
    TextInput,
    Alert,
    ActivityIndicator,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapComponent from './components/MapComponent';
import { useAuth } from '../../../app/providers/AuthProvider';
import { useNotifications } from '../../../app/providers/NotificationProvider';
import { APP_CONFIG } from '../../../app/config/config';
import apiClient from '../../../shared/services/http/apiClient';
import { bootstrapWebPushNotifications } from '../../../shared/services/notifications/webPushBootstrap';
import { updateWebPushZone } from '../../../shared/services/notifications/webPushService';
import { resolveZoneKey } from '../../../shared/services/notifications/zoneService';

export default function HomeScreen({ navigation }) {
    const { logout, token, user } = useAuth();
    const { ephemeralNotification, observeNotifications } = useNotifications();
    const { width } = useWindowDimensions();
    const isNarrow = width < 500;

    const [questions, setQuestions] = useState([]);
    const [showQuestions, setShowQuestions] = useState(true);
    const [comingSoon, setComingSoon] = useState(false);
    const [modalType, setModalType] = useState('notifications');
    const [currentLocation, setCurrentLocation] = useState(null);

    const [feedbackVisible, setFeedbackVisible] = useState(false);
    const [feedbackType, setFeedbackType] = useState('SUGGESTION');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [sendingFeedback, setSendingFeedback] = useState(false);
    const [feedbackSuccessVisible, setFeedbackSuccessVisible] = useState(false);
    const [feedbackSuccessMessage, setFeedbackSuccessMessage] = useState('');

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

    useFocusEffect(
        useCallback(() => {
            loadQuestions();
        }, [loadQuestions])
    );

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
                    APP_CONFIG.apiBaseUrl,
                    currentLocation.latitude,
                    currentLocation.longitude
                );

                pushZoneKeyRef.current = zoneKey;
            } catch (error) {
                console.error('Error updating push notification zone:', error);
            }
        }

        syncPushZone();
    }, [token, currentLocation]);

    const resetFeedbackForm = () => {
        setFeedbackType('SUGGESTION');
        setFeedbackMessage('');
    };

    const closeFeedbackModal = () => {
        if (sendingFeedback) return;
        setFeedbackVisible(false);
        resetFeedbackForm();
    };

    const sendFeedback = async () => {
        const trimmedMessage = feedbackMessage.trim();

        if (!trimmedMessage) {
            Alert.alert('Feedback required', 'Please write a message before sending.');
            return;
        }

        try {
            setSendingFeedback(true);

            await apiClient.post('/api/v1/feedback', {
                type: feedbackType,
                message: trimmedMessage,
            });

            setFeedbackVisible(false);
            resetFeedbackForm();
            setFeedbackSuccessMessage('Thank you for helping us improve StreetAsk.');
            setFeedbackSuccessVisible(true);
        } catch (error) {
            console.error('Error sending feedback:', error);
            Alert.alert('Error', 'Your feedback could not be sent. Please try again later.');
        } finally {
            setSendingFeedback(false);
        }
    };

    return (
        <>
            <SafeAreaView style={styles.screen}>
                <View style={styles.container}>
                    <View style={[styles.topBar, isNarrow && { paddingHorizontal: 12 }]}>
                        <View style={styles.topBarLeft}>
                            <View style={styles.logoBadge}>
                                <Image
                                    source={require('../../../../assets/logo.png')}
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

                            {user?.roles?.includes('ADMIN') && (
                                <TouchableOpacity
                                    style={styles.iconBtn}
                                    activeOpacity={0.7}
                                    onPress={() => navigation.navigate('AdminDashboard')}
                                >
                                    <Ionicons name="shield-checkmark-outline" size={20} color="#374151" />
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                style={styles.iconBtn}
                                activeOpacity={0.7}
                                onPress={() => setFeedbackVisible(true)}
                            >
                                <Ionicons name="chatbox-ellipses-outline" size={20} color="#a52019" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.iconBtn}
                                activeOpacity={0.7}
                                onPress={() => {
                                    setModalType('search');
                                    setComingSoon(true);
                                }}
                            >
                                <Ionicons name="search-outline" size={20} color="#a52019" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.iconBtn}
                                activeOpacity={0.7}
                                onPress={() => {
                                    setModalType('notifications');
                                    setComingSoon(true);
                                }}
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
                                <Text style={styles.notifTitle}>
                                    {ephemeralNotification.title || 'Notification'}
                                </Text>
                                <Text style={styles.notifMsg}>
                                    {ephemeralNotification.message || ''}
                                </Text>
                            </View>
                        </View>
                    ) : null}

                    <View style={styles.mapWrapper}>
                        <MapComponent
                            questions={showQuestions ? questions : []}
                            onQuestionPress={(qId) =>
                                navigation.navigate('QuestionThread', { questionId: qId })
                            }
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
            </SafeAreaView>

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

            <Modal
                visible={feedbackVisible}
                transparent
                animationType="fade"
                onRequestClose={closeFeedbackModal}
            >
                <Pressable style={styles.modalOverlay} onPress={closeFeedbackModal}>
                    <Pressable style={styles.feedbackModalBox} onPress={() => { }}>
                        <View style={styles.feedbackHeader}>
                            <View style={styles.feedbackHeaderLeft}>
                                <View style={styles.feedbackIconWrap}>
                                    <Ionicons name="chatbox-ellipses-outline" size={20} color="#a52019" />
                                </View>
                                <View>
                                    <Text style={styles.feedbackTitle}>Pilot feedback</Text>
                                    <Text style={styles.feedbackSubtitle}>
                                        Help us improve StreetAsk
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={closeFeedbackModal}
                                disabled={sendingFeedback}
                                style={styles.feedbackCloseBtn}
                            >
                                <Ionicons name="close" size={20} color="#6b7280" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.feedbackLabel}>Type</Text>
                        <View style={styles.feedbackTypeRow}>
                            <TouchableOpacity
                                style={[
                                    styles.feedbackTypeChip,
                                    feedbackType === 'BUG' && styles.feedbackTypeChipActive,
                                ]}
                                onPress={() => setFeedbackType('BUG')}
                                disabled={sendingFeedback}
                            >
                                <Text
                                    style={[
                                        styles.feedbackTypeText,
                                        feedbackType === 'BUG' && styles.feedbackTypeTextActive,
                                    ]}
                                >
                                    Bug
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.feedbackTypeChip,
                                    feedbackType === 'SUGGESTION' && styles.feedbackTypeChipActive,
                                ]}
                                onPress={() => setFeedbackType('SUGGESTION')}
                                disabled={sendingFeedback}
                            >
                                <Text
                                    style={[
                                        styles.feedbackTypeText,
                                        feedbackType === 'SUGGESTION' && styles.feedbackTypeTextActive,
                                    ]}
                                >
                                    Suggestion
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.feedbackTypeChip,
                                    feedbackType === 'OTHER' && styles.feedbackTypeChipActive,
                                ]}
                                onPress={() => setFeedbackType('OTHER')}
                                disabled={sendingFeedback}
                            >
                                <Text
                                    style={[
                                        styles.feedbackTypeText,
                                        feedbackType === 'OTHER' && styles.feedbackTypeTextActive,
                                    ]}
                                >
                                    Other
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.feedbackLabel}>Message</Text>
                        <TextInput
                            style={styles.feedbackInput}
                            placeholder="Tell us what happened or what we could improve..."
                            placeholderTextColor="#9ca3af"
                            multiline
                            value={feedbackMessage}
                            onChangeText={setFeedbackMessage}
                            editable={!sendingFeedback}
                            textAlignVertical="top"
                        />

                        <TouchableOpacity
                            style={[
                                styles.feedbackSendBtn,
                                sendingFeedback && styles.feedbackSendBtnDisabled,
                            ]}
                            onPress={sendFeedback}
                            activeOpacity={0.85}
                            disabled={sendingFeedback}
                        >
                            {sendingFeedback ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Ionicons name="send-outline" size={18} color="#fff" />
                                    <Text style={styles.feedbackSendBtnText}>Send feedback</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>

            <Modal
                visible={feedbackSuccessVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setFeedbackSuccessVisible(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setFeedbackSuccessVisible(false)}
                >
                    <Pressable style={styles.successModalBox} onPress={() => { }}>
                        <View style={styles.successIconWrap}>
                            <Ionicons name="checkmark" size={28} color="#fff" />
                        </View>

                        <Text style={styles.successTitle}>Feedback sent</Text>

                        <Text style={styles.successMsg}>
                            {feedbackSuccessMessage}
                        </Text>

                        <TouchableOpacity
                            style={styles.successBtn}
                            onPress={() => setFeedbackSuccessVisible(false)}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.successBtnText}>Great</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>
        </>
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
        paddingHorizontal: 20,
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
    feedbackModalBox: {
        width: '100%',
        maxWidth: 420,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.18,
        shadowRadius: 24,
        elevation: 14,
    },
    feedbackHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    feedbackHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    feedbackIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#fef2f2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    feedbackTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
    },
    feedbackSubtitle: {
        fontSize: 13,
        color: '#6b7280',
        marginTop: 2,
    },
    feedbackCloseBtn: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
    },
    feedbackLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 8,
    },
    feedbackTypeRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
        flexWrap: 'wrap',
    },
    feedbackTypeChip: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 999,
        backgroundColor: '#f3f4f6',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    feedbackTypeChipActive: {
        backgroundColor: '#a52019',
        borderColor: '#a52019',
    },
    feedbackTypeText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6b7280',
    },
    feedbackTypeTextActive: {
        color: '#fff',
    },
    feedbackInput: {
        minHeight: 120,
        maxHeight: 180,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: '#f9fafb',
        fontSize: 14,
        color: '#111827',
        marginBottom: 18,
    },
    feedbackSendBtn: {
        height: 48,
        borderRadius: 14,
        backgroundColor: '#a52019',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    feedbackSendBtnDisabled: {
        opacity: 0.7,
    },
    feedbackSendBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    successModalBox: {
        width: 280,
        backgroundColor: '#fff',
        borderRadius: 22,
        paddingVertical: 28,
        paddingHorizontal: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.18,
        shadowRadius: 24,
        elevation: 14,
    },
    successIconWrap: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: '#a52019',
        alignItems: 'center',
        justifyContent: 'center',
    },
    successTitle: {
        marginTop: 16,
        fontSize: 20,
        fontWeight: '700',
        color: '#1f2937',
    },
    successMsg: {
        marginTop: 8,
        fontSize: 14,
        lineHeight: 20,
        color: '#6b7280',
        textAlign: 'center',
    },
    successBtn: {
        marginTop: 20,
        minWidth: 110,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#a52019',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    successBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
});