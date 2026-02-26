import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../services/apiClient';
import { globalStyles } from '../styles/globalStyles';
import { theme } from '../constants/theme';

const USER_ID_KEY = 'auth_user_id'; // guarda esto al login (te digo abajo)

const addHoursISO = (hours) => {
  const d = new Date(Date.now() + hours * 60 * 60 * 1000);
  // ISO sin milisegundos: 2026-02-25T12:30:00
    return d.toISOString().slice(0, 19);
};

export default function CreateQuestionScreen({ navigation }) {
    const [place, setPlace] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const hours = 2; // Tiempo fijo en MVP
    const [radiusKm, setRadiusKm] = useState(1);

    // placeholder hasta meter mapa real
    const [latitude, setLatitude] = useState(40.4168);
    const [longitude, setLongitude] = useState(-3.7038);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const canPost = useMemo(() => {
        return place.trim() && title.trim() && content.trim() && !isSubmitting;
    }, [place, title, content, isSubmitting]);

    const onPost = async () => {
        if (!canPost) return;

        setIsSubmitting(true);
        try {

        const payload = {
            title: title.trim(),
            content: content.trim(),
            radiusKm: Number(radiusKm),
            expiresAt: addHoursISO(hours),
            location: { latitude, longitude }
        };

        const res = await apiClient.post('/api/v1/questions', payload);
        const created = res.data;

        Alert.alert('OK', 'Question created');

        if (created?.id) {
            navigation.navigate('QuestionThread', { questionId: created.id });
        } else {
            navigation.goBack();
        }
        } catch (e) {
        Alert.alert('Error', e.message);
        } finally {
        setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={globalStyles.screen}>
        <View style={{ flex: 1 }}>
            {/*TODO Placeholder de mapa */}
            <View style={styles.mapBg}>
            <Text style={styles.mapBgText}>[ Map will be integrated here ]</Text>
            </View>

            {/* Panel rojo */}
            <View style={styles.panel}>
            <Text style={styles.header}>Create a question</Text>

            <Text style={styles.label}>Where:</Text>
            <View style={styles.inputRow}>
                <Text style={styles.icon}>🔍</Text>
                <TextInput
                value={place}
                onChangeText={setPlace}
                placeholder="Search the location *"
                placeholderTextColor="#999"
                style={styles.input}
                />
            </View>

            <Text style={styles.helper}>*Radius will be generated automatically</Text>
            <Text style={styles.or}>OR</Text>

            <Pressable
                style={styles.secondaryBtn}
                onPress={() => Alert.alert('TODO', 'Circle a selected area on the map')}
            >
                <Text style={styles.secondaryBtnText}>📍 Circle a selected area on the map</Text>
            </Pressable>

            <Text style={styles.label}>Topic: *</Text>
            <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Enter the topic"
                placeholderTextColor="#999"
                style={styles.inputFull}
            />

            <Text style={styles.label}>Question:</Text>
            <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="Enter the question"
                placeholderTextColor="#999"
                style={styles.inputFull}
            />

            <View style={styles.timeRow}>
                <View style={styles.timePill}>
                <Text style={styles.timePillText}>🔒 Time</Text>
                </View>
                <Text style={styles.timeValue}>{hours}h</Text>
            </View>

            <View style={styles.lockedTimeContainer}>
            <Text style={styles.lockedTimeText}>
                🔒 Time fixed at {hours}h (Premium feature)
            </Text>
            </View>

            <Pressable
                onPress={onPost}
                disabled={!canPost}
                style={[styles.postBtn, !canPost && { opacity: 0.5 }]}
            >
                <Text style={styles.postBtnText}>{isSubmitting ? 'POSTING...' : 'POST'}</Text>
            </Pressable>
            </View>
        </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mapBg: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    mapBgText: { color: '#888' },

    panel: {
        position: 'absolute',
        left: 18,
        right: 18,
        top: 60,
        backgroundColor: '#D40000',
        borderRadius: 14,
        padding: 16,
    },

    header: { color: '#fff', fontSize: 26, fontWeight: '900', marginBottom: 10 },

    label: { color: '#fff', fontWeight: '800', marginTop: 10, marginBottom: 6 },
    helper: { color: '#fff', fontSize: 12, opacity: 0.9, marginTop: 6, textAlign: 'center' },
    or: { color: '#fff', textAlign: 'center', fontWeight: '900', marginVertical: 10 },

    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 44,
        gap: 8,
    },
    icon: { fontSize: 16 },
    input: { flex: 1, height: 44, color: '#111' },

    inputFull: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 44,
        color: '#111',
    },

    secondaryBtn: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    secondaryBtnText: { fontWeight: '800', color: '#111' },

    timeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
    timePill: { backgroundColor: '#F5D400', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
    timePillText: { fontWeight: '900', color: '#111' },
    timeValue: { color: '#fff', fontWeight: '900' },

    postBtn: {
        marginTop: 14,
        backgroundColor: '#8B0000',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
    },
    postBtnText: { color: '#fff', fontWeight: '900', fontSize: 16 },

    lockedTimeContainer: {
    marginTop: 10,
    backgroundColor: '#F5D400',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    },

    lockedTimeText: {
    fontWeight: '900',
    color: '#111',
    },
});