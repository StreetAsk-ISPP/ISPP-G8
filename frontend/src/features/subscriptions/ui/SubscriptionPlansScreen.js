import React, { useEffect, useMemo, useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    useWindowDimensions,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { crossAlert } from '../../../shared/utils/crossAlert';
import { useAuth } from '../../../app/providers/AuthProvider';
import apiClient from '../../../shared/services/http/apiClient';

export default function SubscriptionPlansScreen({ navigation }) {
    const { user } = useAuth();
    const { width, height } = useWindowDimensions();
    const compact = width < 560;
    const shortScreen = height < 780;
    const veryShortScreen = height < 700;
    const [currentPlan, setCurrentPlan] = useState('FREE');
    const [loadingPlan, setLoadingPlan] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadPlan = async () => {
            if (!user?.id) {
                if (isMounted) {
                    setCurrentPlan('FREE');
                    setLoadingPlan(false);
                }
                return;
            }

            try {
                const response = await apiClient.get(`/api/v1/users/${user.id}`);
                if (!isMounted) {
                    return;
                }

                setCurrentPlan(response?.data?.premiumActive === true ? 'PREMIUM' : 'FREE');
            } catch (_) {
                if (isMounted) {
                    setCurrentPlan('FREE');
                }
            } finally {
                if (isMounted) {
                    setLoadingPlan(false);
                }
            }
        };

        loadPlan();

        return () => {
            isMounted = false;
        };
    }, [user?.id]);

    const onChangePlan = () => {
        crossAlert('Coming soon', 'Premium upgrade is coming soon.');
    };

    const isFreeCurrent = currentPlan === 'FREE';
    const isPremiumCurrent = currentPlan === 'PREMIUM';
    const headerSubtitle = useMemo(() => {
        if (loadingPlan) {
            return 'Checking your current plan...';
        }

        return isPremiumCurrent ? 'You are currently on Premium.' : 'You are currently on Free.';
    }, [isPremiumCurrent, loadingPlan]);

    const metrics = useMemo(() => ({
        heroPaddingTop: veryShortScreen ? 12 : shortScreen ? 18 : 24,
        heroPaddingBottom: veryShortScreen ? 16 : shortScreen ? 20 : 28,
        heroHorizontal: compact ? 14 : 20,
        backButtonSize: veryShortScreen ? 34 : 40,
        backButtonHeight: veryShortScreen ? 32 : 36,
        backButtonMargin: veryShortScreen ? 10 : 16,
        eyebrowSize: veryShortScreen ? 11 : 13,
        titleSize: veryShortScreen ? 24 : shortScreen ? 27 : 30,
        subtitleSize: veryShortScreen ? 13 : 15,
        subtitleLineHeight: veryShortScreen ? 18 : 22,
        titleMarginTop: veryShortScreen ? 4 : 8,
        contentHorizontal: compact ? 14 : 20,
        contentTop: veryShortScreen ? 10 : shortScreen ? 14 : 20,
        contentBottom: veryShortScreen ? 10 : shortScreen ? 14 : 24,
        sectionGap: veryShortScreen ? 10 : shortScreen ? 14 : 20,
        loadingPadding: veryShortScreen ? 6 : 12,
        cardRadius: veryShortScreen ? 18 : 22,
        cardPadding: veryShortScreen ? 14 : shortScreen ? 16 : 20,
        planTitleSize: veryShortScreen ? 22 : 26,
        badgeFontSize: veryShortScreen ? 11 : 12,
        badgePaddingVertical: veryShortScreen ? 4 : 6,
        badgePaddingHorizontal: veryShortScreen ? 8 : 10,
        leadMarginTop: veryShortScreen ? 8 : 12,
        leadSize: veryShortScreen ? 13 : 15,
        leadLineHeight: veryShortScreen ? 18 : 22,
        featureMarginTop: veryShortScreen ? 12 : 18,
        featureGap: veryShortScreen ? 6 : shortScreen ? 8 : 10,
        featureSize: veryShortScreen ? 13 : 15,
        featureLineHeight: veryShortScreen ? 17 : 20,
        buttonMarginTop: veryShortScreen ? 14 : 22,
        buttonPaddingVertical: veryShortScreen ? 10 : 14,
        buttonRadius: veryShortScreen ? 12 : 14,
        buttonTextSize: veryShortScreen ? 14 : 15,
    }), [compact, shortScreen, veryShortScreen]);

    return (
        <SafeAreaView style={styles.screen}>
            <View
                style={[
                    styles.hero,
                    {
                        paddingTop: metrics.heroPaddingTop,
                        paddingBottom: metrics.heroPaddingBottom,
                        paddingHorizontal: metrics.heroHorizontal,
                    },
                ]}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[
                        styles.backBtn,
                        {
                            width: metrics.backButtonSize,
                            height: metrics.backButtonHeight,
                            borderRadius: metrics.backButtonSize / 2,
                            marginBottom: metrics.backButtonMargin,
                        },
                    ]}
                    activeOpacity={0.8}
                >
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={[styles.headerEyebrow, { fontSize: metrics.eyebrowSize }]}>StreetAsk</Text>
                <Text style={[styles.headerTitle, { fontSize: metrics.titleSize, marginTop: metrics.titleMarginTop }]}>
                    Subscription Plans
                </Text>
                <Text
                    style={[
                        styles.headerSubtitle,
                        {
                            fontSize: metrics.subtitleSize,
                            lineHeight: metrics.subtitleLineHeight,
                            marginTop: metrics.titleMarginTop,
                        },
                    ]}
                    numberOfLines={2}
                    adjustsFontSizeToFit
                >
                    {headerSubtitle}
                </Text>
            </View>

            <View
                style={[
                    styles.content,
                    {
                        paddingHorizontal: metrics.contentHorizontal,
                        paddingTop: metrics.contentTop,
                        paddingBottom: metrics.contentBottom,
                        gap: metrics.sectionGap,
                    },
                ]}
            >
                {loadingPlan ? (
                    <View style={[styles.loadingCard, { paddingVertical: metrics.loadingPadding }]}>
                        <ActivityIndicator size="large" color="#d90429" />
                    </View>
                ) : null}

                <View
                    style={[
                        styles.planCard,
                        styles.freeCard,
                        isFreeCurrent && styles.currentCard,
                        { borderRadius: metrics.cardRadius, padding: metrics.cardPadding },
                    ]}
                >
                    <View style={styles.planTopRow}>
                        <Text style={[styles.freeTitle, { fontSize: metrics.planTitleSize }]}>FREE</Text>
                        {isFreeCurrent ? (
                            <Text
                                style={[
                                    styles.currentBadge,
                                    {
                                        fontSize: metrics.badgeFontSize,
                                        paddingVertical: metrics.badgePaddingVertical,
                                        paddingHorizontal: metrics.badgePaddingHorizontal,
                                    },
                                ]}
                            >
                                Current plan
                            </Text>
                        ) : null}
                    </View>
                    <Text
                        style={[
                            styles.planLead,
                            {
                                marginTop: metrics.leadMarginTop,
                                fontSize: metrics.leadSize,
                                lineHeight: metrics.leadLineHeight,
                            },
                        ]}
                        numberOfLines={2}
                        adjustsFontSizeToFit
                    >
                        Quick access with a short ad before posting.
                    </Text>

                    <View style={[styles.featureList, { marginTop: metrics.featureMarginTop, gap: metrics.featureGap }]}>
                        <Text style={[styles.freeFeature, { fontSize: metrics.featureSize, lineHeight: metrics.featureLineHeight }]}>Fixed question duration: 2h</Text>
                        <Text style={[styles.freeFeature, { fontSize: metrics.featureSize, lineHeight: metrics.featureLineHeight }]}>Fixed question radius: 500 m</Text>
                        <Text style={[styles.freeFeature, { fontSize: metrics.featureSize, lineHeight: metrics.featureLineHeight }]}>Ad shown before publishing</Text>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.secondaryBtn,
                            isFreeCurrent && styles.disabledBtn,
                            {
                                marginTop: metrics.buttonMarginTop,
                                paddingVertical: metrics.buttonPaddingVertical,
                                borderRadius: metrics.buttonRadius,
                            },
                        ]}
                        onPress={isFreeCurrent ? undefined : onChangePlan}
                        activeOpacity={isFreeCurrent ? 1 : 0.85}
                        disabled={isFreeCurrent}
                    >
                        <Text
                            style={[
                                styles.secondaryBtnText,
                                isFreeCurrent && styles.disabledBtnText,
                                { fontSize: metrics.buttonTextSize },
                            ]}
                        >
                            {isFreeCurrent ? 'Current plan' : 'Switch to Free'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View
                    style={[
                        styles.planCard,
                        styles.premiumCard,
                        isPremiumCurrent && styles.currentCard,
                        { borderRadius: metrics.cardRadius, padding: metrics.cardPadding },
                    ]}
                >
                    <View style={styles.planTopRow}>
                        <Text style={[styles.premiumTitle, { fontSize: metrics.planTitleSize }]}>PREMIUM</Text>
                        {isPremiumCurrent ? (
                            <Text
                                style={[
                                    styles.currentBadgePremium,
                                    {
                                        fontSize: metrics.badgeFontSize,
                                        paddingVertical: metrics.badgePaddingVertical,
                                        paddingHorizontal: metrics.badgePaddingHorizontal,
                                    },
                                ]}
                            >
                                Current plan
                            </Text>
                        ) : null}
                    </View>
                    <Text
                        style={[
                            styles.planLeadPremium,
                            {
                                marginTop: metrics.leadMarginTop,
                                fontSize: metrics.leadSize,
                                lineHeight: metrics.leadLineHeight,
                            },
                        ]}
                        numberOfLines={2}
                        adjustsFontSizeToFit
                    >
                        No ad break. More control when asking your question.
                    </Text>

                    <View style={[styles.featureList, { marginTop: metrics.featureMarginTop, gap: metrics.featureGap }]}>
                        <Text style={[styles.premiumFeature, { fontSize: metrics.featureSize, lineHeight: metrics.featureLineHeight }]}>Choose duration from 1h to 24h</Text>
                        <Text style={[styles.premiumFeature, { fontSize: metrics.featureSize, lineHeight: metrics.featureLineHeight }]}>Choose radius from 50 m to 1000 m</Text>
                        <Text style={[styles.premiumFeature, { fontSize: metrics.featureSize, lineHeight: metrics.featureLineHeight }]}>Priority support</Text>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.primaryBtn,
                            isPremiumCurrent && styles.disabledPremiumBtn,
                            {
                                marginTop: metrics.buttonMarginTop,
                                paddingVertical: metrics.buttonPaddingVertical,
                                borderRadius: metrics.buttonRadius,
                            },
                        ]}
                        onPress={isPremiumCurrent ? undefined : onChangePlan}
                        activeOpacity={isPremiumCurrent ? 1 : 0.85}
                        disabled={isPremiumCurrent}
                    >
                        <Text
                            style={[
                                styles.primaryBtnText,
                                isPremiumCurrent && styles.disabledPremiumBtnText,
                                { fontSize: metrics.buttonTextSize },
                            ]}
                        >
                            {isPremiumCurrent ? 'Current plan' : 'Go Pro'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    hero: {
        backgroundColor: '#d90429',
        paddingTop: 24,
        paddingHorizontal: 20,
        paddingBottom: 28,
    },
    backBtn: {
        width: 40,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        backgroundColor: 'rgba(255,255,255,0.14)',
    },
    headerEyebrow: {
        color: '#fecdd3',
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 30,
        fontWeight: '800',
        marginTop: 8,
    },
    headerSubtitle: {
        color: '#ffe4e6',
        fontSize: 15,
        lineHeight: 22,
        marginTop: 8,
    },
    content: {
        flex: 1,
        minHeight: 0,
    },
    loadingCard: {
        alignItems: 'center',
    },
    planCard: {
        flex: 1,
        minHeight: 0,
        borderWidth: 1,
        shadowColor: '#111827',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 14,
        elevation: 5,
    },
    freeCard: {
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
    },
    premiumCard: {
        backgroundColor: '#1f2937',
        borderColor: '#111827',
    },
    currentCard: {
        borderColor: '#d90429',
        borderWidth: 2,
    },
    planTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
    },
    freeTitle: {
        color: '#1f2937',
        fontSize: 26,
        fontWeight: '900',
    },
    premiumTitle: {
        color: '#fff',
        fontSize: 26,
        fontWeight: '900',
    },
    currentBadge: {
        backgroundColor: '#fee2e2',
        color: '#b91c1c',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        fontSize: 12,
        fontWeight: '800',
    },
    currentBadgePremium: {
        backgroundColor: '#fbbf24',
        color: '#1f2937',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        fontSize: 12,
        fontWeight: '800',
    },
    planLead: {
        marginTop: 12,
        color: '#4b5563',
        fontSize: 15,
        lineHeight: 22,
    },
    planLeadPremium: {
        marginTop: 12,
        color: '#d1d5db',
        fontSize: 15,
        lineHeight: 22,
    },
    featureList: {
        flexShrink: 1,
    },
    freeFeature: {
        color: '#1f2937',
        fontSize: 15,
        fontWeight: '600',
    },
    premiumFeature: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '600',
    },
    secondaryBtn: {
        marginTop: 'auto',
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    secondaryBtnText: {
        color: '#1f2937',
        fontSize: 15,
        fontWeight: '800',
    },
    primaryBtn: {
        marginTop: 'auto',
        backgroundColor: '#d90429',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ef233c',
    },
    primaryBtnText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '800',
    },
    disabledBtn: {
        backgroundColor: '#f9fafb',
        borderColor: '#e5e7eb',
    },
    disabledBtnText: {
        color: '#9ca3af',
    },
    disabledPremiumBtn: {
        backgroundColor: '#374151',
        borderColor: '#4b5563',
    },
    disabledPremiumBtnText: {
        color: '#d1d5db',
    },
});
