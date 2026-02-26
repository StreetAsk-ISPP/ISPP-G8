import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import BusinessSignupScreen from '../screens/BusinessSignupScreen';
import PaymentGatewayPlaceholderScreen from '../screens/PaymentGatewayPlaceholderScreen';
import HomeScreen from '../screens/HomeScreen';
import CreateQuestionScreen from '../screens/CreateQuestionScreen';

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
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                    <Stack.Screen name="BusinessSignup" component={BusinessSignupScreen} />
                    <Stack.Screen name="PaymentGatewayPlaceholder" component={PaymentGatewayPlaceholderScreen} />
                </>
            ) : (
                <>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="CreateQuestion" component={CreateQuestionScreen} />
                </>
            )}
        </Stack.Navigator>
    );
}