import { React, useCallback , useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import CustomButton from '../components/CustomButton';
import MapComponent from '../components/MapComponent';
import { useAuth } from '../context/AuthContext';
import { globalStyles } from '../styles/globalStyles';
import { theme } from '../constants/theme';
import apiClient from '../services/apiClient';

export default function HomeScreen({ navigation }) {
    const { logout } = useAuth();
    const [questions, setQuestions] = useState([]);

    useFocusEffect(
        useCallback(() => {
            const loadQuestions = async () => {
            try {
                const res = await apiClient.get('/api/v1/questions');
                const raw = res.data;

                const list = Array.isArray(raw) ? raw : [];
                setQuestions(list);
            } catch (e) {
                console.warn('Failed to load questions', e);
            }
            };

            loadQuestions();
        }, [])
        );

    return (
        <SafeAreaView style={globalStyles.screen}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={globalStyles.title}>StreetAsk</Text>
                    <Text style={globalStyles.subtitle}>Questions around you</Text>
                </View>

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
        marginBottom: 20,
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