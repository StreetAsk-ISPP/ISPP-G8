import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TextInput, KeyboardAvoidingView, Platform, Pressable, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { theme } from '../../../shared/ui/theme/theme';
import { globalStyles } from '../../../shared/ui/theme/globalStyles';
import apiClient from '../../../shared/services/http/apiClient';
import { useAuth } from '../../../app/providers/AuthProvider';

const SendIcon = () => <Text style={styles.sendIcon}>➤</Text>;
const pad2 = (n) => String(n).padStart(2, '0');

const formatHms = (totalSeconds) => {
    const s = Math.max(0, Math.floor(totalSeconds));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}:${pad2(m)}:${pad2(sec)}`;
};

export default function QuestionThreadScreen({ route }) {
    const { questionId } = route?.params || {};
    const { user } = useAuth(); // Obtener usuario autenticado

    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [myVotes, setMyVotes] = useState({}); // myVotes[answerId] = 'LIKE' | 'DISLIKE' | undefined (LOCAL ONLY)

    const [draft, setDraft] = useState('');
    const [sendingAnswer, setSendingAnswer] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const inputRef = useRef(null);

    // Función auxiliar para calcular minutos anteriores
    const getMinutesAgo = (createdAt) => {
        if (!createdAt) return 0;
        const created = new Date(createdAt);
        const now = new Date();
        return Math.floor((now - created) / (1000 * 60));
    };

    // Función auxiliar para obtener color aleatorio de avatar
    const getRandomAvatarColor = () => {
        const colors = ['#CDE8D5', '#E7C6C2', '#F0D7B9', '#D6E4FF', '#FFD6E8', '#D6FFE8'];
        const randomArray = new Uint32Array(1);
        window.crypto.getRandomValues(randomArray);
        return colors[randomArray[0] % colors.length];
    };

    const canSend = useMemo(() => draft.trim().length > 0 && !sendingAnswer, [draft, sendingAnswer]);

    // Obtener ubicación del usuario al montar el componente
    useEffect(() => {
        const requestLocationPermission = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status === 'granted') {
                    const location = await Location.getCurrentPositionAsync({
                        accuracy: Location.Accuracy.High,
                    });
                    setUserLocation(location.coords);
                } else {
                    console.warn('Location permission not granted');
                }
            } catch (err) {
                console.warn('Error getting user location:', err);
            }
        };

        requestLocationPermission();
    }, []);

    // Cargar pregunta y respuestas al montar el componente
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Obtener la pregunta
                const questionResponse = await apiClient.get(`/api/v1/questions/${questionId}`);
                const loadedQuestion = questionResponse.data;
                setQuestion(loadedQuestion);

                // Obtener las respuestas
                const answersResponse = await apiClient.get(`/api/v1/answers?questionId=${questionId}`);
                const loadedAnswers = Array.isArray(answersResponse.data)
                    ? answersResponse.data
                    : Array.from(answersResponse.data || []);

                // Transformar respuestas para el frontend
                const transformedAnswers = loadedAnswers.map((answer) => ({
                    id: answer.id,
                    author: answer.user?.username || '@user',
                    avatarColor: getRandomAvatarColor(),
                    text: answer.content || '',
                    likes: answer.upvotes || 0,
                    dislikes: answer.downvotes || 0,
                    minutesAgo: getMinutesAgo(answer.createdAt),
                    createdAt: answer.createdAt,
                    userId: answer.user?.id,
                    isVerified: answer.isVerified,
                }));

                setAnswers(transformedAnswers);
            } catch (err) {
                console.error('Error loading data:', err);
                setError(err.message || 'Error loading question and answers');
            } finally {
                setLoading(false);
            }
        };

        if (questionId) {
            loadData();
        }
    }, [questionId]);

    const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);

    // Actualizar temporizador cuando cambia la pregunta
    useEffect(() => {
        if (!question?.expiresAt) return;

        const expiresAtMs = new Date(question.expiresAt).getTime();
        const tick = () => {
            const diffSeconds = Math.ceil((expiresAtMs - Date.now()) / 1000);
            setTimeLeftSeconds(Math.max(0, diffSeconds));
        };
        tick(); // calcula al entrar
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [question?.expiresAt]);

    const sendAnswer = async () => {
        const content = draft.trim();
        if (!content || !question) return;

        const optimistic = {
            id: `tmp-${Date.now()}`,
            author: '@me',
            minutesAgo: 0,
            text: content,
            likes: 0,
            dislikes: 0,
            avatarColor: '#D6E4FF',
            optimistic: true,
        };

        setAnswers(prev => [...prev, optimistic]);
        setDraft('');
        inputRef.current?.blur();
        setSendingAnswer(true);

        try {
            // Validar que tenemos la ubicación del usuario
            let currentLocation = userLocation;
            if (!currentLocation) {
                // Intentar obtener ubicación si no la tenemos
                try {
                    const { status } = await Location.requestForegroundPermissionsAsync();
                    if (status === 'granted') {
                        const location = await Location.getCurrentPositionAsync({
                            accuracy: Location.Accuracy.High,
                        });
                        currentLocation = location.coords;
                        setUserLocation(currentLocation);
                    } else {
                        throw new Error('Location permission required to post an answer');
                    }
                } catch (locErr) {
                    alert('Error: Cannot get your location. Please enable location permissions.');
                    setAnswers(prev => prev.filter(a => a.id !== optimistic.id));
                    setDraft(content);
                    setSendingAnswer(false);
                    return;
                }
            }

            // Construir el payload con la ubicación real del usuario
            const payload = {
                content: content,
                question: { id: question.id },
                user: { id: user?.id }, // Enviar ID del usuario autenticado
                userLocation: {
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                },
            };

            console.log('Sending answer payload:', JSON.stringify(payload, null, 2));

            // Enviar respuesta al backend con usuario autenticado
            const response = await apiClient.post('/api/v1/answers', payload);

            // Reemplazar respuesta optimista con la respuesta del servidor
            const savedAnswer = response.data;
            setAnswers(prev =>
                prev.map(a =>
                    a.id === optimistic.id
                        ? {
                            id: savedAnswer.id,
                            author: savedAnswer.user?.username || '@user',
                            avatarColor: '#D6E4FF',
                            text: savedAnswer.content,
                            likes: savedAnswer.upvotes || 0,
                            dislikes: savedAnswer.downvotes || 0,
                            minutesAgo: 0,
                            createdAt: savedAnswer.createdAt,
                            userId: savedAnswer.user?.id,
                            isVerified: savedAnswer.isVerified,
                        }
                        : a
                )
            );
        } catch (e) {
            console.error('Error sending answer:', e);
            console.error('Error response status:', e.response?.status);
            console.error('Error response data:', e.response?.data);
            console.error('Full error:', e);

            // Quitar la respuesta optimista si falla
            setAnswers(prev => prev.filter(a => a.id !== optimistic.id));

            // Mostrar mensaje de error detallado
            let errorMessage = 'Error sending answer';
            if (e.response) {
                const status = e.response.status;
                const data = e.response.data;
                if (status === 400) {
                    errorMessage = `Bad Request: ${data?.message || JSON.stringify(data) || 'Invalid data'}`;
                } else if (status === 401) {
                    errorMessage = 'Unauthorized: Please log in again';
                } else if (status === 403) {
                    errorMessage = 'Forbidden: You don\'t have permission';
                } else if (status === 404) {
                    errorMessage = 'Not found: Question or resource not found';
                } else if (status >= 500) {
                    errorMessage = `Server error (${status}): ${data?.message || 'Please try again later'}`;
                } else {
                    errorMessage = `Error (${status}): ${data?.message || e.message}`;
                }
            } else {
                errorMessage = `Network error: ${e.message}`;
            }

            alert(errorMessage);
            // Restaurar el draft
            setDraft(content);
        } finally {
            setSendingAnswer(false);
        }
    };

    // Función local de voto (sin guardar en backend)
    const vote = (answerId, nextType) => {
        setMyVotes((prevVotes) => {
            const current = prevVotes[answerId];

            // Actualizar UX localmente
            setAnswers((prevAnswers) =>
                prevAnswers.map((a) => {
                    if (a.id !== answerId) return a;

                    let likes = a.likes || 0;
                    let dislikes = a.dislikes || 0;

                    if (current === nextType) {
                        if (nextType === 'LIKE') likes = Math.max(0, likes - 1);
                        else dislikes = Math.max(0, dislikes - 1);
                        return { ...a, likes, dislikes };
                    }

                    if (current === 'LIKE') likes = Math.max(0, likes - 1);
                    if (current === 'DISLIKE') dislikes = Math.max(0, dislikes - 1);
                    if (nextType === 'LIKE') likes += 1;
                    else dislikes += 1;

                    return { ...a, likes, dislikes };
                })
            );

            if (current === nextType) {
                const copy = { ...prevVotes };
                delete copy[answerId];
                return copy;
            }
            return { ...prevVotes, [answerId]: nextType };
        });
    };

    const renderAnswer = ({ item }) => {
        const myVote = myVotes[item.id];

        return (
            <View style={styles.answerRow}>
                <View style={[styles.avatar, { backgroundColor: item.avatarColor }]} />
                <View style={styles.bubble}>
                    <Text style={styles.metaText}>
                        {item.author} · {item.minutesAgo} min ago
                    </Text>
                    <Text style={styles.answerText}>{item.text}</Text>
                </View>

                <View style={styles.votesCol}>
                    <Pressable onPress={() => vote(item.id, 'LIKE')}
                        style={[styles.voteBtn, myVote === 'DISLIKE' && styles.voteBtnDimmed]}
                    >
                        <Text style={styles.voteIcon}>👍</Text>
                        <Text style={styles.voteCount}>{item.likes || 0}</Text>
                    </Pressable>

                    <Pressable onPress={() => vote(item.id, 'DISLIKE')}
                        style={[styles.voteBtn, myVote === 'LIKE' && styles.voteBtnDimmed]}
                    >
                        <Text style={styles.voteIcon}>👎</Text>
                        <Text style={styles.voteCount}>{item.dislikes || 0}</Text>
                    </Pressable>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={globalStyles.screen}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
                {/* Estado de carga */}
                {loading && (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={theme.colors?.primary || '#D40000'} />
                    </View>
                )}

                {/* Estado de error */}
                {error && !loading && (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                        <Text style={{ textAlign: 'center', color: '#D40000', fontSize: 16 }}>
                            {error}
                        </Text>
                    </View>
                )}

                {/* Contenido principal */}
                {!loading && !error && question && (
                    <>
                        <View style={styles.header}>
                            <View style={styles.headerTop}>
                                <View style={styles.headerAvatar} />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.headerTitle}>{question.title}</Text>
                                    <Text style={styles.headerText}>{question.content}</Text>
                                    <Text style={styles.headerAuthor}>
                                        {question.creator?.username || '@user'}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.chipsRow}>
                                <View style={styles.chip}>
                                    <Text style={styles.chipIcon}>💬</Text>
                                    <Text style={styles.chipText}>{answers.length}</Text>
                                </View>

                                <View style={styles.chip}>
                                    <Text style={styles.chipIcon}>⏱</Text>
                                    <Text style={styles.chipText}>{formatHms(timeLeftSeconds)}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Lista respuestas */}
                        <FlatList
                            data={answers}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.listContent}
                            renderItem={renderAnswer}
                            ListEmptyComponent={
                                <Text style={{ textAlign: 'center', color: theme.colors?.textSecondary || '#757575', marginTop: 20 }}>
                                    No answers yet. Be the first to answer!
                                </Text>
                            }
                        />
                    </>
                )}

                {/* Composer abajo */}
                {!loading && !error && (
                    <View style={styles.composer}>
                        <TextInput
                            ref={inputRef}
                            value={draft}
                            onChangeText={setDraft}
                            placeholder="Start typing..."
                            placeholderTextColor={theme.colors?.textSecondary || '#757575'}
                            style={styles.input}
                            editable={!sendingAnswer}
                        />
                        <Pressable
                            onPress={sendAnswer}
                            disabled={!canSend}
                            style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
                        >
                            {sendingAnswer ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <SendIcon />
                            )}
                        </Pressable>
                    </View>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#D40000',
        padding: theme.spacing?.md || 16,
    },
    headerTop: {
        flexDirection: 'row',
        gap: 12,
    },
    headerAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFFFFF55',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: 1,
    },
    headerText: {
        color: '#fff',
        marginTop: 6,
        fontSize: 14,
        lineHeight: 18,
    },
    headerAuthor: {
        color: '#fff',
        marginTop: 8,
        fontSize: 12,
        opacity: 0.9,
    },

    chipsRow: {
        marginTop: 12,
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap',
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 18,
        gap: 6,
    },
    chipIcon: { fontSize: 14 },
    chipText: { fontSize: 13, fontWeight: '700' },
    chipDivider: {
        width: 1,
        height: 14,
        backgroundColor: '#ddd',
        marginHorizontal: 4,
    },

    listContent: {
        padding: theme.spacing?.md || 16,
        paddingBottom: 90,
    },

    answerRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 14,
        gap: 10,
    },
    avatar: {
        width: 34,
        height: 34,
        borderRadius: 17,
    },
    bubble: {
        flex: 1,
        backgroundColor: theme.colors?.surface || '#fff',
        borderRadius: 18,
        padding: 12,
        borderWidth: 1,
        borderColor: theme.colors?.border || '#E0E0E0',
    },
    metaText: {
        fontSize: 12,
        color: theme.colors?.textSecondary || '#757575',
        marginBottom: 6,
    },
    answerText: {
        fontSize: 14,
        color: theme.colors?.textPrimary || '#111',
    },

    votesCol: {
        width: 52,
        alignItems: 'center',
        gap: 10,
        paddingTop: 2,
    },
    voteBtn: {
        alignItems: 'center',
        gap: 2,
    },
    voteBtnDimmed: {
        opacity: 0.3,
    },
    voteIcon: { fontSize: 18 },
    voteCount: { fontSize: 12, fontWeight: '700' },

    composer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: theme.spacing?.md || 16,
        paddingVertical: theme.spacing?.sm || 10,
        flexDirection: 'row',
        gap: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: theme.colors?.border || '#E0E0E0',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: theme.colors?.border || '#E0E0E0',
        borderRadius: theme.radius?.md || 12,
        backgroundColor: theme.colors?.surface || '#F5F5F5',
        paddingHorizontal: theme.spacing?.md || 16,
        paddingVertical: theme.spacing?.sm || 10,
        fontSize: theme.typography?.body || 16,
        color: theme.colors?.textPrimary || '#111',
    },
    sendBtn: {
        width: 46,
        height: 46,
        borderRadius: 23,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#D40000',
    },
    sendBtnDisabled: {
        opacity: 0.5,
    },
    sendIcon: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '900',
        transform: [{ rotate: '-10deg' }],
    },
});