import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../app/providers/AuthProvider';
import apiClient from '../../shared/services/http/apiClient';

export default function ProfileScreen({ navigation }) {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({ questions: 0, answers: 0, rating: 0 });

    useEffect(() => {
        if (!user?.id) return;
        apiClient.get(`/api/v1/users/${user.id}/stats`)
            .then(res => {
                if (res.data) {
                    setStats({
                        questions: res.data.questionsCount || 0,
                        answers: res.data.answersCount || 0,
                        rating: res.data.rating != null ? res.data.rating : 0,
                    });
                }
            })
            .catch(() => { });
    }, [user]);
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

            {/* Stats card — floats above menu */}
            <View style={styles.statsBar}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.questions}</Text>
                    <Text style={styles.statItemLabel}>Asked{"\n"}questions</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.answers}</Text>
                    <Text style={styles.statItemLabel}>Answered{"\n"}questions</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                        {parseFloat(stats.rating).toFixed(1)}
                        <Text style={styles.statNumberSub}>/5</Text>
                    </Text>
                    <Text style={styles.statItemLabel}>Rated{"\n"}with</Text>
                </View>
            </View>

            <ScrollView style={styles.menuContainer}>
                <TouchableOpacity style={styles.editBtn}>
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
    screen: { flex: 1, backgroundColor: '#fff' },
    headerRed: {
        backgroundColor: '#d90429',
        padding: 20,
        paddingTop: 40,
        paddingBottom: 35,
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
    menuContainer: { padding: 20, paddingTop: 8 },
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
    statsBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 14,
        marginHorizontal: 16,
        marginTop: -28,
        marginBottom: 0,
        paddingVertical: 14,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        zIndex: 10,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#d90429',
    },
    statNumberSub: {
        fontSize: 14,
        fontWeight: '600',
        color: '#d90429',
    },
    statItemLabel: {
        fontSize: 11,
        color: '#666',
        textAlign: 'center',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        backgroundColor: '#e5e7eb',
        marginVertical: 4,
    },
});