import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../app/providers/AuthProvider';

export default function ProfileScreen({ navigation }) {
    const { user, logout } = useAuth();
    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.headerRed}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>

                <View style={styles.userInfoRow}>
                    <View style={styles.avatarCircle}>
                        <Ionicons name="person" size={60} color="#666" />
                    </View>
                    <View style={styles.userTextInfo}>
                        <Text style={styles.userName}>{user?.username?.toUpperCase() || 'USER NAME'}</Text>
                        <Text style={styles.userSub}>{user?.role || 'Registered User'}</Text>
                        <Text style={styles.userSub}>Basic plan</Text>
                        <Text style={styles.userSub}>Seville, Spain</Text>
                        <Text style={styles.userSub}>{user?.email}</Text>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.menuContainer}>
                <TouchableOpacity style={styles.editBtn}
                    onPress={() => navigation.navigate('EditProfile')}>
                    <Text style={styles.editBtnText}>EDIT PROFILE</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('ProfileStats')}>
                    <Ionicons name="stats-chart-outline" size={24} color="#fff" />
                    <Text style={styles.menuItemText}>Insights</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => alert('Balance details (Coming Soon)')}>
                    <Ionicons name="wallet-outline" size={24} color="#fff" />
                    <Text style={styles.menuItemText}>Balance</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => alert('My purchases (Coming Soon)')}>
                    <Ionicons name="cart-outline" size={24} color="#fff" />
                    <Text style={styles.menuItemText}>My purchases</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => alert('Settings (Coming Soon)')}>
                    <Ionicons name="settings-outline" size={24} color="#fff" />
                    <Text style={styles.menuItemText}>Settings</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.menuItem, { backgroundColor: '#4b5563', marginTop: 10 }]}
                    onPress={logout}>
                    <Ionicons name="log-out-outline" size={24} color="#fff" />
                    <Text style={styles.menuItemText}>Log out</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.menuItem, { marginTop: 20, backgroundColor: '#fee2e2' }]}>
                    <Ionicons name="trash-outline" size={24} color="#ef4444" />
                    <Text style={[styles.menuItemText, { color: '#ef4444' }]}>Delete my account</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#e5e7eb' },
    headerRed: {
        backgroundColor: '#d90429',
        padding: 20,
        paddingTop: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#b90421'
    },
    backBtn: { marginBottom: 10 },
    userInfoRow: { flexDirection: 'row', alignItems: 'center' },
    avatarCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    userTextInfo: { marginLeft: 20 },
    userName: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    userSub: { color: '#fff', fontSize: 14, marginTop: 2 },
    menuContainer: { padding: 20 },
    editBtn: {
        backgroundColor: '#d90429',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 25
    },
    editBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
    menuItem: {
        backgroundColor: '#bcbcbc',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10
    },
    menuItemText: {
        marginLeft: 15,
        fontSize: 16,
        fontWeight: '600',
        color: '#fff'
    },
});