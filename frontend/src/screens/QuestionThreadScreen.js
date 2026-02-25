import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TextInput, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { theme } from '../constants/theme';
import { globalStyles } from '../styles/globalStyles';
import apiClient from '../services/apiClient';

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

    const [question] = useState({
        id: questionId || 'q1',
        title: 'ANTIQUE TONIGHT',
        author: '@user1',
        text: "I'm 21, but they say only 23+ are allowed. Is it true?",
        stats: { likes: 3, dislikes: 0, replies: 3, people: 2 },
        createdAt: Date.now() - 18 * 60 * 1000, // ejemplo: publicada hace 18 min
        durationSeconds: 2 * 60 * 60,          // ejemplo: dura 2 hora
    });

    const [answers, setAnswers] = useState([
        {
        id: 'a1',
        author: '@user1',
        minutesAgo: 20,
        text: "I'm in the queue, and they're not letting anyone under 21 in.",
        likes: 3,
        dislikes: 0,
        avatarColor: '#CDE8D5',
        },
        {
        id: 'a2',
        author: '@user2',
        minutesAgo: 15,
        text: "They didn't let me in, I'm 22.",
        likes: 1,
        dislikes: 0,
        avatarColor: '#E7C6C2',
        },
        {
        id: 'a3',
        author: '@user4',
        minutesAgo: 13,
        text: "I'm 21 and the let me in!!!",
        likes: 1,
        dislikes: 0,
        avatarColor: '#F0D7B9',
        },
    ]);

    const [myVotes, setMyVotes] = useState({}); // myVotes[answerId] = 'LIKE' | 'DISLIKE' | undefined

    const [draft, setDraft] = useState('');
    const inputRef = useRef(null);

    const canSend = useMemo(() => draft.trim().length > 0, [draft]);

    const computedStats = useMemo(() => {
        const likes = answers.reduce((sum, a) => sum + (a.likes || 0), 0);
        const dislikes = answers.reduce((sum, a) => sum + (a.dislikes || 0), 0);
        const replies = answers.length;
        return { likes, dislikes, replies };
    }, [answers]);

    const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);

    useEffect(() => {
        const expiresAtMs = question.createdAt + question.durationSeconds * 1000;
        const tick = () => {
            const diffSeconds = Math.ceil((expiresAtMs - Date.now()) / 1000);
            setTimeLeftSeconds(Math.max(0, diffSeconds));
        };
        tick(); // calcula al entrar
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [question.createdAt, question.durationSeconds]);

    const sendAnswer = async () => {
        const content = draft.trim();
        if (!content) return;

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

        // Conectar backend cuando esté listo:
        // try {
        //   await apiClient.post(`/api/v1/questions/${question.id}/answers`, { content });
        //   // luego recargar hilo si queréis
        // } catch (e) {
        //   // si falla, podrías quitar la respuesta optimista o marcarla
        // }
    };

    const vote = (answerId, nextType /* 'LIKE' | 'DISLIKE' */) => {
        setMyVotes((prevVotes) => {
            const current = prevVotes[answerId]; // 'LIKE' | 'DISLIKE' | undefined

            setAnswers((prevAnswers) =>
            prevAnswers.map((a) => {
                if (a.id !== answerId) return a;

                let likes = a.likes;
                let dislikes = a.dislikes;

                // Si pulsa el mismo voto -> quitarlo
                if (current === nextType) {
                if (nextType === 'LIKE') likes = Math.max(0, likes - 1);
                else dislikes = Math.max(0, dislikes - 1);

                return { ...a, likes, dislikes };
                }

                // Si cambia de voto o vota por primera vez:
                if (current === 'LIKE') likes = Math.max(0, likes - 1);
                if (current === 'DISLIKE') dislikes = Math.max(0, dislikes - 1);

                if (nextType === 'LIKE') likes += 1;
                else dislikes += 1;

                return { ...a, likes, dislikes };
            })
            );

            // actualizar myVotes
            if (current === nextType) {
            const copy = { ...prevVotes };
            delete copy[answerId];
            return copy;
            }

            return { ...prevVotes, [answerId]: nextType };
        });

        // Backend cuando esté:
        // await apiClient.post(`/api/v1/answers/${answerId}/vote`, { type: nextType });
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
                        <Text style={styles.voteCount}>{item.likes}</Text>
                    </Pressable>

                    <Pressable onPress={() => vote(item.id, 'DISLIKE')}
                        style={[styles.voteBtn, myVote === 'LIKE' && styles.voteBtnDimmed]}
                    >
                        <Text style={styles.voteIcon}>👎</Text>
                        <Text style={styles.voteCount}>{item.dislikes}</Text>
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
            <View style={styles.header}>
            <View style={styles.headerTop}>
                <View style={styles.headerAvatar} />
                <View style={{ flex: 1 }}>
                <Text style={styles.headerTitle}>{question.title}</Text>
                <Text style={styles.headerText}>{question.text}</Text>
                <Text style={styles.headerAuthor}>{question.author}</Text>
                </View>
            </View>

            <View style={styles.chipsRow}>
                <View style={styles.chip}>
                <Text style={styles.chipIcon}>👍</Text>
                <Text style={styles.chipText}>{computedStats.likes}</Text>
                <View style={styles.chipDivider} />
                <Text style={styles.chipIcon}>👎</Text>
                <Text style={styles.chipText}>{computedStats.dislikes}</Text>
                </View>

                <View style={styles.chip}>
                <Text style={styles.chipIcon}>💬</Text>
                <Text style={styles.chipText}>{computedStats.replies}</Text>
                </View>

                <View style={styles.chip}>
                <Text style={styles.chipIcon}>👥</Text>
                <Text style={styles.chipText}>{question.stats.people}</Text>
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
            />

            {/* Composer abajo */}
            <View style={styles.composer}>
            <TextInput
                ref={inputRef}
                value={draft}
                onChangeText={setDraft}
                placeholder="Start typing..."
                placeholderTextColor={theme.colors?.textSecondary || '#757575'}
                style={styles.input}
            />
            <Pressable
                onPress={sendAnswer}
                disabled={!canSend}
                style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
            >
                <SendIcon />
            </Pressable>
            </View>
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