import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView,
    TouchableOpacity, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../app/providers/AuthProvider';
import apiClient from '../../shared/services/http/apiClient';

export default function BalanceScreen({ navigation }) {
    const { user } = useAuth();
    const [balance, setBalance] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) { setLoading(false); return; }
        apiClient.get(`/api/v1/users/${user.id}`)
            .then(res => {
                setBalance(res.data?.coinBalance ?? 0);
                setTransactions(res.data?.coinTransactions ?? []);
            })
            .catch(() => { setBalance(0); })
            .finally(() => setLoading(false));
    }, [user]);

    if (loading) {
        return (
            <SafeAreaView style={[styles.safeArea, styles.center]}>
                <ActivityIndicator size="large" color="white" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.navBar}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <Text style={styles.navTitle}>Balance</Text>
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.balanceCard}>
                    <Ionicons name="wallet" size={40} color="#FFD700" />
                    <Text style={styles.balanceLabel}>StreetCoins</Text>
                    <Text style={styles.balanceAmount}>{balance ?? 0}</Text>
                </View>

                <Text style={styles.sectionTitle}>Transaction History</Text>

                {transactions.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="receipt-outline" size={48} color="#ccc" />
                        <Text style={styles.emptyText}>No transactions yet.</Text>
                    </View>
                ) : (
                    transactions.map((tx, idx) => (
                        <View key={tx.id ?? idx} style={styles.txItem}>
                            <View style={styles.txIconCircle}>
                                <Ionicons
                                    name={tx.amount >= 0 ? 'arrow-down-circle' : 'arrow-up-circle'}
                                    size={24}
                                    color={tx.amount >= 0 ? '#22c55e' : '#ef4444'}
                                />
                            </View>
                            <View style={styles.txInfo}>
                                <Text style={styles.txDescription}>{tx.description || 'Transaction'}</Text>
                                <Text style={styles.txDate}>
                                    {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : ''}
                                </Text>
                            </View>
                            <Text style={[styles.txAmount, { color: tx.amount >= 0 ? '#22c55e' : '#ef4444' }]}>
                                {tx.amount >= 0 ? '+' : ''}{tx.amount}
                            </Text>
                        </View>
                    ))
                )}
                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#d90429' },
    center: { justifyContent: 'center', alignItems: 'center' },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        paddingTop: 40,
        justifyContent: 'center',
    },
    backButton: { position: 'absolute', left: 15, top: 40 },
    navTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 20,
    },
    balanceCard: {
        backgroundColor: '#1f2937',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        marginBottom: 28,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    balanceLabel: { color: '#9ca3af', fontSize: 14, marginTop: 10 },
    balanceAmount: { color: '#FFD700', fontSize: 48, fontWeight: 'bold', marginTop: 4 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 14 },
    emptyState: { alignItems: 'center', paddingVertical: 40 },
    emptyText: { color: '#999', marginTop: 12, fontStyle: 'italic' },
    txItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    txIconCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    txInfo: { flex: 1 },
    txDescription: { fontSize: 14, fontWeight: '600', color: '#333' },
    txDate: { fontSize: 12, color: '#999', marginTop: 2 },
    txAmount: { fontSize: 16, fontWeight: 'bold' },
});
