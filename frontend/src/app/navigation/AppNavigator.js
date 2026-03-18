import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from '../../features/auth/ui/LoginScreen';
import SignUpScreen from '../../features/auth/ui/SignUpScreen';
import BusinessSignupScreen from '../../features/auth/ui/BusinessSignupScreen';
import PaymentGatewayPlaceholderScreen from '../../features/payments/ui/PaymentGatewayPlaceholderScreen';
import HomeScreen from '../../features/home/ui/HomeScreen';
import CreateQuestionScreen from '../../features/questions/ui/CreateQuestionScreen';
import QuestionThreadScreen from '../../features/answers/ui/QuestionThreadScreen';
import ProfileScreen from '../../features/profile/ProfileScreen';
import ProfileStats from '../../features/profile/ProfileStats';
import AdminFeedbackScreen from '../../features/admin/ui/AdminFeedbackScreen';
import AdminScreen from '../../features/admin/ui/AdminScreen';
import AdminUsersScreen from '../../features/admin/ui/AdminUsersScreen';
import EditProfileScreen from '../../features/profile/EditProfileScreen';
import BalanceScreen from '../../features/profile/BalanceScreen';
import MyPurchasesScreen from '../../features/profile/MyPurchasesScreen';
import SettingsScreen from '../../features/profile/SettingsScreen';
import { useAuth } from '../providers/AuthProvider';
import { theme } from '../../shared/ui/theme/theme';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { isAuthenticated, isLoadingAuth, user } = useAuth();

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
                    {
                        user?.roles?.includes('ADMIN') ? (
                            <>
                                <Stack.Screen name="AdminDashboard" component={AdminScreen} />
                                <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
                                <Stack.Screen name="AdminFeedback" component={AdminFeedbackScreen} />
                                {/* Incluimos las rutas de la app aquí para que formen parte del stack
                                pero la inicial será AdminDashboard según el orden.
                                El botón volver atrás o ir al dashboard debe estar en un panel o cabecera
                            */}
                                <Stack.Screen name="Home" component={HomeScreen} />
                                <Stack.Screen name="CreateQuestion" component={CreateQuestionScreen} />
                                <Stack.Screen name="QuestionThread" component={QuestionThreadScreen} />
                                <Stack.Screen name="Profile" component={ProfileScreen} />
                                <Stack.Screen name="ProfileStats" component={ProfileStats} options={{ headerShown: false }} />
                            </>
                        ) : (
                            <>
                                <Stack.Screen name="Home" component={HomeScreen} />
                                <Stack.Screen name="CreateQuestion" component={CreateQuestionScreen} />
                                <Stack.Screen name="QuestionThread" component={QuestionThreadScreen} />
                                <Stack.Screen name="Profile" component={ProfileScreen} />
                                <Stack.Screen name="ProfileStats" component={ProfileStats} options={{ headerShown: false }} />
                                <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                                <Stack.Screen name="Balance" component={BalanceScreen} options={{ headerShown: false }} />
                                <Stack.Screen name="MyPurchases" component={MyPurchasesScreen} options={{ headerShown: false }} />
                                <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
                            </>
                        )
                    }
                </>
            )
            }
        </Stack.Navigator >
    );
}
