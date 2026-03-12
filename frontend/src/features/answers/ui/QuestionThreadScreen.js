import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, FlatList, TextInput,
    KeyboardAvoidingView, Platform, Pressable, ActivityIndicator,
    TouchableOpacity, useWindowDimensions,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../../shared/services/http/apiClient';
import { useAuth } from '../../../app/providers/AuthProvider';
import { crossAlert } from '../../../shared/utils/crossAlert';
import MapPickerWeb from '../../home/ui/components/MapPickerWeb';
import { calculateDistanceInKm } from '../../../shared/utils/helpers'; // Haversine formula para calcular distancia entre 2 puntos

const pad2 = (n) => String(n).padStart(2, '0');
const formatHms = (t) => {
    const s = Math.max(0, Math.floor(t));
    return `${Math.floor(s / 3600)}:${pad2(Math.floor((s % 3600) / 60))}:${pad2(s % 60)}`;
};
const avatarColors = ['#dbeafe', '#fce7f3', '#fef3c7', '#d1fae5', '#ede9fe', '#e0e7ff'];
const parsePositiveNumber = (value) => {
    const num = Number(value);
    return Number.isFinite(num) && num > 0 ? num : null;
};

export default function QuestionThreadScreen({ route, navigation }) {
    const { questionId } = route?.params || {};
    const { user } = useAuth();
    const { width } = useWindowDimensions();
    const isNarrow = width < 500;

    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [myVotes, setMyVotes] = useState({});
    const [draft, setDraft] = useState('');
    const [sendingAnswer, setSendingAnswer] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [pickMode, setPickMode] = useState(false);
    const [tempLat, setTempLat] = useState(null);
    const [tempLng, setTempLng] = useState(null);
    const inputRef = useRef(null);

    const getMinutesAgo = (d) => d ? Math.floor((Date.now() - new Date(d)) / 60000) : 0;

    const pickColor = useCallback((key) => {
        let hash = 0;
        const str = String(key || '');
        for (let i = 0; i < str.length; i++) {
            hash = (hash * 31 + str.charCodeAt(i)) | 0;
        }
        return avatarColors[Math.abs(hash) % avatarColors.length];
    }, []);

    const canSend = useMemo(() => draft.trim().length > 0, [draft]);
    const questionRadiusKm = useMemo(() => parsePositiveNumber(question?.radiusKm), [question?.radiusKm]);

    const isWithinRadius = useMemo(() => {
        if (!userLocation || !question) return null;
        const qLat = Number(question.location?.latitude);
        const qLng = Number(question.location?.longitude);
        if (!Number.isFinite(qLat) || !Number.isFinite(qLng) || questionRadiusKm == null) {
            // Mirrors backend behavior: if location/radius are not valid, answer is not geo-restricted.
            return true;
        }

        const distKm = calculateDistanceInKm(
            { latitude: userLocation.latitude, longitude: userLocation.longitude },
            { latitude: qLat, longitude: qLng }
        );

        return distKm <= questionRadiusKm;
    }, [userLocation, question, questionRadiusKm]);

    useEffect(() => {
        if (Platform.OS === 'web' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
                (error) => {
                    console.warn('[Geolocation] Failed:', error.code, error.message);

                    navigator.geolocation.getCurrentPosition(
                        (pos) => setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
                        (retryErr) => console.warn('[Geolocation] Retry failed:', retryErr.code, retryErr.message),
                        { enableHighAccuracy: true, timeout: 20000 }
                    );
                },
                { enableHighAccuracy: false, timeout: 8000, maximumAge: 180000 }
            );
        } else {
            (async () => {
                try {
                    const { status } = await Location.requestForegroundPermissionsAsync();
                    if (status === 'granted') {
                        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
                        setUserLocation(loc.coords);
                    }
                } catch (_) { /* location unavailable */ }
            })();
        }
    }, []);

    useEffect(() => {
        if (!questionId) return;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const qRes = await apiClient.get(`/api/v1/questions/${questionId}`);
                setQuestion(qRes.data);
                const aRes = await apiClient.get(`/api/v1/answers?questionId=${questionId}`);
                const list = Array.isArray(aRes.data) ? aRes.data : Array.from(aRes.data || []);
                setAnswers(list.map((a) => ({
                    id: a.id,
                    author: a.user?.userName || a.user?.username || 'Anonymous',
                    color: pickColor(a.id),
                    text: a.content || '',
                    likes: a.upvotes || 0,
                    dislikes: a.downvotes || 0,
                    minutesAgo: getMinutesAgo(a.createdAt),
                    userId: a.user?.id,
                    isVerified: a.isVerified,
                })));
            } catch (e) {
                setError(e.message || 'Error loading data');
            } finally {
                setLoading(false);
            }
        })();
    }, [questionId, pickColor]);

    const [timeLeft, setTimeLeft] = useState(0);
    useEffect(() => {
        if (!question?.expiresAt) return;
        let dateStr = question.expiresAt;

        // 2. Si no tiene la 'Z', se la concatenamos (y reemplazamos el espacio por 'T' para que sea ISO)
        if (!dateStr.includes('Z')) {
            dateStr = dateStr.replace(' ', 'T') + 'Z';
        }

        const exp = new Date(dateStr).getTime();


        const tick = () => setTimeLeft(Math.max(0, Math.ceil((exp - Date.now()) / 1000)));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [question?.expiresAt]);

    const sendAnswerHandler = async () => {
        const content = draft.trim();
        if (!content || !question) return;

        const optimistic = { id: `tmp-${Date.now()}`, author: '@me', minutesAgo: 0, text: content, likes: 0, dislikes: 0, color: '#dbeafe', optimistic: true };
        setAnswers((p) => [...p, optimistic]);
        setDraft('');
        inputRef.current?.blur();
        setSendingAnswer(true);

        try {
            let loc = userLocation;
            if (!loc) {
                try {
                    if (Platform.OS === 'web' && navigator.geolocation) {
                        loc = await new Promise((resolve, reject) => {
                            navigator.geolocation.getCurrentPosition(
                                (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
                                () => reject(new Error('Location unavailable')),
                                { enableHighAccuracy: true, timeout: 8000 }
                            );
                        });
                        setUserLocation(loc);
                    } else {
                        const { status } = await Location.requestForegroundPermissionsAsync();
                        if (status === 'granted') {
                            const l = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
                            loc = l.coords;
                            setUserLocation(loc);
                        }
                    }
                } catch (_) {
                    // Location not available — send without it; backend will reject only if the question requires it
                }
            }

            const payload = {
                content,
                question: { id: question.id },
                user: { id: user?.id },
            };
            if (loc) {
                payload.userLocation = { latitude: loc.latitude, longitude: loc.longitude };
            }

            const res = await apiClient.post('/api/v1/answers', payload);

            const saved = res.data;
            setAnswers((p) => p.map((a) => a.id === optimistic.id ? {
                id: saved.id, author: saved.user?.userName || saved.user?.username || 'Anonymous', color: '#dbeafe',
                text: saved.content, likes: saved.upvotes || 0, dislikes: saved.downvotes || 0,
                minutesAgo: 0, userId: saved.user?.id, isVerified: saved.isVerified,
            } : a));
        } catch (e) {
            setAnswers((p) => p.filter((a) => a.id !== optimistic.id));
            let msg = 'Error sending answer';
            if (e.response) {
                const s = e.response.status;
                const d = e.response.data;
                if (s === 400) msg = `Bad Request: ${d?.message || JSON.stringify(d)}`;
                else if (s === 401) msg = 'Unauthorized: Please log in again';
                else if (s === 403) msg = "Forbidden: You don't have permission";
                else msg = `Error (${s}): ${d?.message || e.message}`;
            } else msg = `Network error: ${e.message}`;
            crossAlert('Error', msg);
            setDraft(content);
        } finally {
            setSendingAnswer(false);
        }
    };

    const vote = async (answerId, type) => {
        const cur = myVotes[answerId];

        // 1. Calculamos los deltas a enviar al backend
        let upDelta = 0;
        let downDelta = 0;
        let newVoteState = type;

        if (cur === type) {
            // Caso 1: Quitar el voto actual (toggle)
            if (type === 'LIKE') upDelta = -1;
            else downDelta = -1;
            newVoteState = null; // Ya no hay voto
        } else if (cur) {
            // Caso 2: Cambiar el voto (de LIKE a DISLIKE o viceversa)
            if (type === 'LIKE') { upDelta = 1; downDelta = -1; }
            else { upDelta = -1; downDelta = 1; }
        } else {
            // Caso 3: Voto nuevo
            if (type === 'LIKE') upDelta = 1;
            else downDelta = 1;
        }

        // 2. Guardamos un respaldo por si falla la API (Rollback)
        const previousAnswers = [...answers];
        const previousVotes = { ...myVotes };

        // 3. Actualización Optimista (Visual e inmediata)
        setAnswers((pa) => pa.map((a) => {
            if (a.id !== answerId) return a;
            return {
                ...a,
                likes: Math.max(0, (a.likes || 0) + upDelta),
                dislikes: Math.max(0, (a.dislikes || 0) + downDelta)
            };
        }));

        setMyVotes((prev) => {
            const nextVotes = { ...prev };
            if (newVoteState) nextVotes[answerId] = newVoteState;
            else delete nextVotes[answerId];
            return nextVotes;
        });

        // 4. Llamada real al backend
        try {
            await apiClient.put(
                `/api/v1/answers/${answerId}/votes?upvotesDelta=${upDelta}&downvotesDelta=${downDelta}`
            );
        } catch (error) {
            // 5. Si algo sale mal, revertimos la interfaz y avisamos al usuario
            console.error("Error al votar:", error);
            setAnswers(previousAnswers);
            setMyVotes(previousVotes);
            crossAlert('Error', 'No se pudo registrar el voto. Verifica tu conexión.');
        }
    };

    const openMapPick = () => {
        setTempLat(userLocation?.latitude || null);
        setTempLng(userLocation?.longitude || null);
        setPickMode(true);
    };
    const cancelMapPick = () => { setPickMode(false); setTempLat(null); setTempLng(null); };
    const confirmMapPick = () => {
        if (typeof tempLat !== 'number' || typeof tempLng !== 'number') {
            crossAlert('Pick a point', 'Tap on the map to choose your location.');
            return;
        }
        setUserLocation({ latitude: tempLat, longitude: tempLng });
        setPickMode(false);
    };

    const renderAnswer = ({ item, index }) => {
        const v = myVotes[item.id];
        const isLast = index === answers.length - 1;
        return (
            <View style={styles.threadRow}>
                {/* Thread line + dot */}
                <View style={styles.threadLineCol}>
                    <View style={[styles.threadDot, { backgroundColor: item.color }]} />
                    {!isLast && <View style={styles.threadLine} />}
                </View>

                {/* Content */}
                <View style={styles.threadContent}>
                    <View style={styles.threadHeader}>
                        <Text style={styles.threadAuthor}>@{item.author}</Text>
                        <Text style={styles.threadTime}>{item.minutesAgo < 60 ? `${item.minutesAgo}m ago` : `${Math.floor(item.minutesAgo / 60)}h ago`}</Text>
                        <Text style={styles.threadIndex}>#{index + 1}</Text>
                    </View>
                    <Text style={styles.threadBody}>{item.text}</Text>
                    <View style={styles.threadActions}>
                        <Pressable onPress={() => vote(item.id, 'LIKE')} style={[styles.threadVoteBtn, v === 'DISLIKE' && { opacity: 0.3 }]}>
                            <Ionicons name={v === 'LIKE' ? 'arrow-up-circle' : 'arrow-up-circle-outline'} size={18} color={v === 'LIKE' ? '#667eea' : '#9ca3af'} />
                            <Text style={[styles.threadVoteCount, v === 'LIKE' && { color: '#667eea' }]}>{item.likes || 0}</Text>
                        </Pressable>
                        <Pressable onPress={() => vote(item.id, 'DISLIKE')} style={[styles.threadVoteBtn, v === 'LIKE' && { opacity: 0.3 }]}>
                            <Ionicons name={v === 'DISLIKE' ? 'arrow-down-circle' : 'arrow-down-circle-outline'} size={18} color={v === 'DISLIKE' ? '#ef4444' : '#9ca3af'} />
                            <Text style={[styles.threadVoteCount, v === 'DISLIKE' && { color: '#ef4444' }]}>{item.dislikes || 0}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        );
    };

    if (pickMode) {
        return (
            <SafeAreaView style={styles.screen}>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, width: '100%', height: '100%' }}>
                        <MapPickerWeb
                            latitude={tempLat} longitude={tempLng}
                            userLat={userLocation?.latitude} userLng={userLocation?.longitude}
                            radiusKm={questionRadiusKm} pickEnabled tempLat={tempLat} tempLng={tempLng}
                            onPick={(lat, lng) => { setTempLat(lat); setTempLng(lng); }}
                        />
                    </View>
                    <View style={styles.mapOverlay} pointerEvents="box-none">
                        <View style={styles.mapHint} pointerEvents="none">
                            <Text style={styles.mapHintText}>Tap the map to pick your location</Text>
                            <Text style={styles.mapHintCoords}>
                                {tempLat?.toFixed?.(5) ?? '--'}, {tempLng?.toFixed?.(5) ?? '--'}
                            </Text>
                        </View>
                        <View style={styles.mapBtnRow} pointerEvents="auto">
                            <TouchableOpacity style={styles.mapCancelBtn} onPress={cancelMapPick} activeOpacity={0.8}>
                                <Text style={styles.mapCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.mapOkBtn} onPress={confirmMapPick} activeOpacity={0.8}>
                                <Text style={styles.mapOkText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.screen}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
                {loading && (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color="#667eea" />
                    </View>
                )}

                {error && !loading && (
                    <View style={styles.center}>
                        <Text style={{ color: '#ef4444', fontSize: 15, textAlign: 'center', paddingHorizontal: 20 }}>{error}</Text>
                    </View>
                )}

                {!loading && !error && question && (
                    <>
                        {/* ── Header Card ── */}
                        <View style={[styles.headerCard, isNarrow && { marginHorizontal: 12, marginTop: 12 }]}>
                            {/* Back button */}
                            {navigation && (
                                <TouchableOpacity
                                    style={styles.backBtn}
                                    onPress={() => navigation.goBack()}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="chevron-back" size={22} color="#667eea" />
                                </TouchableOpacity>
                            )}

                            <View style={styles.headerContent}>
                                <View style={styles.qAvatar}>
                                    <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.qTitle}>{question.title}</Text>
                                    <Text style={styles.qBody}>{question.content}</Text>
                                    <Text style={styles.qAuthor}>by @{question.creator?.userName || question.creator?.username || 'unknown'}</Text>
                                </View>
                            </View>

                            <View style={styles.chips}>
                                <View style={styles.chip}>
                                    <Ionicons name="chatbubbles-outline" size={14} color="#667eea" />
                                    <Text style={styles.chipVal}>{answers.length}</Text>
                                </View>
                                <View style={styles.chip}>
                                    <Ionicons name="time-outline" size={14} color="#f59e0b" />
                                    <Text style={styles.chipVal}>{formatHms(timeLeft)}</Text>
                                </View>
                            </View>
                        </View>

                        {/* ── Answers ── */}
                        <FlatList
                            data={answers}
                            keyExtractor={(i) => String(i.id)}
                            contentContainerStyle={[styles.listContent, isNarrow && { paddingHorizontal: 12 }]}
                            renderItem={renderAnswer}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>No answers yet. Be the first!</Text>
                            }
                        />
                    </>
                )}

                {/* ── Composer ── */}
                {!loading && !error && (
                    isWithinRadius === false ? (
                        <View style={styles.outOfRange}>
                            <Ionicons name="location-outline" size={18} color="#ef4444" />
                            <Text style={styles.outOfRangeText}>
                                No estás en la zona de la pregunta, acércate para poder responder.
                            </Text>
                        </View>
                    ) : (
                        <View style={[styles.composer, isNarrow && { paddingHorizontal: 12 }]}>
                            <TextInput
                                ref={inputRef}
                                value={draft}
                                onChangeText={setDraft}
                                placeholder="Write your answer..."
                                placeholderTextColor="#9ca3af"
                                style={styles.composerInput}
                                editable={isWithinRadius !== false && !sendingAnswer}
                            />
                            <Pressable
                                onPress={sendAnswerHandler}
                                disabled={!canSend}
                                style={[styles.sendBtn, !canSend && { opacity: 0.4 }]}
                            >
                                {sendingAnswer
                                    ? <ActivityIndicator size="small" color="#fff" />
                                    : <Ionicons name="send" size={18} color="#fff" />
                                }
                            </Pressable>
                        </View>
                    )
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    /* ── Header Card ── */
    headerCard: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 4,
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    headerContent: {
        flexDirection: 'row',
        gap: 14,
    },
    qAvatar: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: '#667eea',
        alignItems: 'center',
        justifyContent: 'center',
    },
    qTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1f2937',
    },
    qBody: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 4,
        lineHeight: 20,
    },
    qAuthor: {
        fontSize: 12,
        color: '#9ca3af',
        marginTop: 6,
    },
    chips: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 14,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    chipVal: {
        fontSize: 13,
        fontWeight: '700',
        color: '#374151',
    },

    /* ── Answer List (Forum Thread) ── */
    listContent: {
        padding: 16,
        paddingBottom: 90,
    },
    emptyText: {
        textAlign: 'center',
        color: '#9ca3af',
        marginTop: 24,
        fontSize: 14,
    },
    threadRow: {
        flexDirection: 'row',
        minHeight: 60,
    },
    threadLineCol: {
        width: 28,
        alignItems: 'center',
    },
    threadDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#fff',
        marginTop: 4,
        zIndex: 1,
    },
    threadLine: {
        flex: 1,
        width: 2,
        backgroundColor: '#e5e7eb',
        marginTop: 2,
    },
    threadContent: {
        flex: 1,
        marginLeft: 10,
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        padding: 12,
    },
    threadHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    threadAuthor: {
        fontSize: 13,
        fontWeight: '700',
        color: '#667eea',
    },
    threadTime: {
        fontSize: 11,
        color: '#9ca3af',
    },
    threadIndex: {
        fontSize: 11,
        color: '#d1d5db',
        fontWeight: '700',
        marginLeft: 'auto',
    },
    threadBody: {
        fontSize: 14,
        color: '#1f2937',
        lineHeight: 20,
    },
    threadActions: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
    threadVoteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    threadVoteCount: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6b7280',
    },

    /* ── Composer ── */
    composer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 16,
        paddingVertical: 10,
        flexDirection: 'row',
        gap: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    composerInput: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: '#e5e7eb',
        borderRadius: 14,
        backgroundColor: '#f9fafb',
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        color: '#1f2937',
        outlineStyle: 'none',
    },
    sendBtn: {
        width: 46,
        height: 46,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#667eea',
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
    },
    locationBtn: {
        width: 46,
        height: 46,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        borderWidth: 1.5,
        borderColor: '#e5e7eb',
    },
    mapOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 16, zIndex: 100, justifyContent: 'space-between' },
    mapHint: { backgroundColor: 'rgba(255,255,255,0.95)', padding: 16, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 6 },
    mapHintText: { fontWeight: '700', fontSize: 15, color: '#1f2937', textAlign: 'center' },
    mapHintCoords: { fontSize: 13, color: '#6b7280', textAlign: 'center', marginTop: 6 },
    mapBtnRow: { flexDirection: 'row', gap: 12 },
    mapCancelBtn: { flex: 1, backgroundColor: '#fff', borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
    mapCancelText: { fontWeight: '700', fontSize: 15, color: '#6b7280' },
    mapOkBtn: { flex: 1, backgroundColor: '#667eea', borderRadius: 14, paddingVertical: 14, alignItems: 'center', shadowColor: '#667eea', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 5 },
    mapOkText: { fontWeight: '700', fontSize: 15, color: '#fff' },
    // Geolocation: estilo del banner de "fuera del radio"
    outOfRange: {
        // Banner rojo con icono de ubicación, se muestra cuando usuario está fuera del radio permitido.
        flexDirection: 'row', alignItems: 'center', gap: 10,
        margin: 12, padding: 14,
        backgroundColor: '#fef2f2', borderRadius: 14, // Fondo rojo claro
        borderWidth: 1, borderColor: '#fecaca', // Borde rojo
    },
    outOfRangeText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#ef4444', lineHeight: 18 }, // Texto rojo explicativo
});
