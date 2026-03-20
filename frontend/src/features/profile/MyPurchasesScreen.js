import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView,
    TouchableOpacity, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../app/providers/AuthProvider';
import apiClient from '../../shared/services/http/apiClient';

export default function MyPurchasesScreen({ navigation }) {
    const { user } = useAuth();
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) { setLoading(false); return; }
        apiClient.get(`/api/v1/users/${user.id}`)
            .then(res => {
                const txs = res.data?.coinTransactions ?? [];
                setPurchases(txs.filter(tx => tx.amount < 0));
            })
            .catch(() => { })
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
                <Text style={styles.navTitle}>My Purchases</Text>
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {purchases.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="cart-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyTitle}>No purchases yet</Text>
                        <Text style={styles.emptySubtitle}>
                            Items you purchase with StreetCoins will appear here.
                        </Text>
                    </View>
                ) : (
                    purchases.map((item, idx) => (
                        <View key={item.id ?? idx} style={styles.purchaseItem}>
                            <View style={styles.purchaseIconCircle}>
                                <Ionicons name="bag-handle-outline" size={24} color="#d90429" />
                            </View>
                            <View style={styles.purchaseInfo}>
                                <Text style={styles.purchaseDescription}>
                                    {item.description || 'Purchase'}
                                </Text>
                                <Text style={styles.purchaseDate}>
                                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                                </Text>
                            </View>
                            <Text style={styles.purchaseCost}>{item.amount} coins</Text>
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
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 20,
    },
    purchaseItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    purchaseIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fff1f1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    purchaseInfo: { flex: 1 },
    purchaseDescription: { fontSize: 14, fontWeight: '600', color: '#333' },
    purchaseDate: { fontSize: 12, color: '#999', marginTop: 2 },
    purchaseCost: { fontSize: 14, fontWeight: 'bold', color: '#ef4444' },
});
