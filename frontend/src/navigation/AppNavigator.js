import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import QuestionThreadScreen from '../screens/QuestionThreadScreen';

import { useAuth } from '../context/AuthContext';
import { theme } from '../constants/theme';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { isAuthenticated, isLoadingAuth } = useAuth();

    if (isLoadingAuth) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors?.background }}>
                <ActivityIndicator size="large" color={theme.colors?.primary || '#0000ff'} />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!isAuthenticated ? (
                <Stack.Screen name="Login" component={LoginScreen} />
            ) : (
                <>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="QuestionThread" component={QuestionThreadScreen} />
                </>
            )}
        </Stack.Navigator>
    );
}