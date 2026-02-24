import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import CustomButton from '../components/CustomButton';
import MapComponent from '../components/MapComponent';
import { useAuth } from '../context/AuthContext';
import { globalStyles } from '../styles/globalStyles';
import { theme } from '../constants/theme';

export default function HomeScreen() {
    const { logout } = useAuth();

    return (
        <SafeAreaView style={globalStyles.screen}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={globalStyles.title}>StreetAsk</Text>
                    <Text style={globalStyles.subtitle}>Questions around you</Text>
                </View>

                <View style={styles.mapContainer}>
                    <MapComponent />
                </View>

                <View style={styles.footer}>
                    <CustomButton 
                        label="Ask a question" 
                        onPress={() => console.log('Open question modal')} 
                    />
                    
                    <View style={{ height: 12 }} />

                    <CustomButton 
                        label="Sign out" 
                        onPress={logout} 
                    />
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