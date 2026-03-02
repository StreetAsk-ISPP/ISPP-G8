import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import CustomButton from '../../../shared/components/CustomButton';
import MapComponent from './components/MapComponent';
import { useAuth } from '../../../app/providers/AuthProvider';
import { useNotifications } from '../../../app/providers/NotificationProvider';
import { useWebSocket } from '../../../app/providers/WebSocketProvider';
import { globalStyles } from '../../../shared/ui/theme/globalStyles';
import { theme } from '../../../shared/ui/theme/theme';
import apiClient from '../../../shared/services/http/apiClient';

export default function HomeScreen({ navigation }) {
    const { logout } = useAuth();
    const { currentZoneKey, ephemeralNotification, observeNotifications } = useNotifications();
    const { isConnected } = useWebSocket();
    const [questions, setQuestions] = useState([]);

    const loadQuestions = useCallback(async () => {
        try {
            const res = await apiClient.get('/api/v1/questions');
            const raw = res.data;

            const list = Array.isArray(raw) ? raw : [];
            setQuestions(list);
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
        const unsubscribe = observeNotifications((notification) => {
            if (notification?.type === 'NEARBY_QUESTION') {
                loadQuestions();
            }
        });
        return unsubscribe;
    }, [loadQuestions, observeNotifications]);

    return (
        <SafeAreaView style={globalStyles.screen}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={globalStyles.title}>StreetAsk</Text>
                    <Text style={globalStyles.subtitle}>Questions around you</Text>
                    <Text style={styles.zoneText}>
                        {currentZoneKey ? `Listening zone: ${currentZoneKey}` : 'Listening zone: --'}
                    </Text>
                    <Text style={styles.zoneText}>
                        {`WebSocket: ${isConnected ? 'connected' : 'disconnected'}`}
                    </Text>
                </View>

                {ephemeralNotification ? (
                    <View style={styles.notificationsPanel}>
                        <View style={styles.notificationItem}>
                            <Text style={styles.notificationTitle}>{ephemeralNotification.title || 'Notification'}</Text>
                            <Text style={styles.notificationText}>{ephemeralNotification.message || ''}</Text>
                        </View>
                    </View>
                ) : null}

                <View style={styles.mapContainer}>
                    <MapComponent
                        questions={questions}
                        onQuestionPress={(questionId) =>
                            navigation.navigate('QuestionThread', { questionId })
                        }
                    />
                </View>

                <View style={styles.footer}>
                    <CustomButton
                        label="Ask a question"
                        onPress={() => navigation.navigate('CreateQuestion')}
                    />
                    
                    <View style={{ height: 12 }} />

                    <CustomButton label="Sign out" onPress={logout}/>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing?.md || 16,
    },
    header: {
        marginBottom: 12,
    },
    zoneText: {
        marginTop: 6,
        color: theme.colors?.textSecondary || '#64748B',
        fontSize: 12,
    },
    notificationsPanel: {
        gap: 8,
        marginBottom: 12,
    },
    notificationItem: {
        backgroundColor: '#FFF7E6',
        borderColor: '#FCD34D',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    notificationTitle: {
        color: '#92400E',
        fontSize: 13,
        fontWeight: '700',
    },
    notificationText: {
        marginTop: 2,
        color: '#78350F',
        fontSize: 13,
    },
    mapContainer: {
        flex: 1,
        backgroundColor: theme.colors?.surface || '#F5F5F5',
        borderColor: theme.colors?.border || '#E0E0E0',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: theme.radius?.md || 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    placeholderText: {
        color: theme.colors?.textSecondary || '#757575',
        fontSize: 16,
        textAlign: 'center',
        padding: 20,
    },
    footer: {
        paddingBottom: 10,
    }
});
