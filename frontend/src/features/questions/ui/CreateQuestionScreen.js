import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Pressable, Alert, Platform  } from 'react-native';
import apiClient from '../../../shared/services/http/apiClient';
import { globalStyles } from '../../../shared/ui/theme/globalStyles';
import MapPickerWeb from '../../home/ui/components/MapPickerWeb';

const addHoursISO = (hours) => {
    const nowMs = Date.now(); 
    const futureMs = nowMs + (hours * 60 * 60 * 1000);
    return new Date(futureMs).toISOString(); 
};

export default function CreateQuestionScreen({ navigation }) {
    const [place, setPlace] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const hours = 2; // Fixed time in MVP
    const [radiusKm] = useState(1);

    // placeholder hasta meter mapa real
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    const [searching, setSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [pickedLabel, setPickedLabel] = useState('');

    const [pickMode, setPickMode] = useState(false);

    const [tempLat, setTempLat] = useState(null);
    const [tempLng, setTempLng] = useState(null);

    const [userLat, setUserLat] = useState(null);
    const [userLng, setUserLng] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (Platform.OS === 'web') {
            if (!navigator.geolocation) return;

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;

                setUserLat(lat);
                setUserLng(lng);

                setLatitude((prev) => (typeof prev === 'number' ? prev : lat));
                setLongitude((prev) => (typeof prev === 'number' ? prev : lng));

                setPlace((prev) => (prev?.trim() ? prev : `(${lat.toFixed(5)}, ${lng.toFixed(5)})`));
                setPickedLabel((prev) => prev || '');
                },
                () => {
                },
                { enableHighAccuracy: true, timeout: 8000 }
            );
        } else {
        // En móvil lo ideal es Expo Location (si ya lo usáis en el proyecto).
        // Aquí lo dejo sin dependencia extra para que no te rompa la build.
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const canPost = useMemo(() => {
        return title.trim() && content.trim() && !isSubmitting;
    }, [title, content, isSubmitting]);

    const searchAddress = async () => {
    const q = place.trim();
    if (!q) {
        Alert.alert('Address is missing', 'Enter a street and number to search.');
        return;
    }

    setSearching(true);
    try {
        const url =
            `https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&q=${encodeURIComponent(q)}`;

        const res = await fetch(url, {
            headers: {
            'User-Agent': 'StreetAsk/1.0 (dev)',
            'Accept': 'application/json',
            },
        });

        const data = await res.json();

        const items = (data || []).map((it) => ({
            label: it.display_name,
            lat: Number(it.lat),
            lon: Number(it.lon),
        }));

        setSearchResults(items);

        if (items.length === 0) {
            Alert.alert('No results', 'No addresses found. Try being more specific.');
        }

        if (items.length === 1) {
            setLatitude(items[0].lat);
            setLongitude(items[0].lon);
            setPickedLabel(items[0].label);
            setSearchResults([]);
        }
        } catch (e) {
            Alert.alert('Error', 'The address could not be found (Nominatim).');
        } finally {
            setSearching(false);
        }
    };

    const openMapPick = () => {
        const lat = typeof latitude === 'number' ? latitude : userLat;
        const lng = typeof longitude === 'number' ? longitude : userLng;
        setTempLat(lat);
        setTempLng(lng);
        setPickMode(true);
    };

    const cancelMapPick = () => {
        setPickMode(false);
        setTempLat(null);
        setTempLng(null);
    };

    const confirmMapPick = () => {
        if (typeof tempLat !== 'number' || typeof tempLng !== 'number') {
            Alert.alert('Pick a point', 'Click on the map to choose a location.');
            return;
        }
        setLatitude(tempLat);
        setLongitude(tempLng);
        setPlace(`(${tempLat.toFixed(5)}, ${tempLng.toFixed(5)})`);
        setPickedLabel('');
        setSearchResults([]);
        setPickMode(false);
    };

    const onPost = async () => {
        if (!canPost) return;

        setIsSubmitting(true);
        try {

        const payload = {
            title: title.trim(),
            content: content.trim(),
            radiusKm: Number(radiusKm),
            expiresAt: addHoursISO(hours),
            location: { latitude, longitude }
        };

        const res = await apiClient.post('/api/v1/questions', payload);
        const created = res.data;

        Alert.alert('OK', 'Question created');

        if (created?.id) {
            navigation.goBack();
        } else {
            navigation.goBack();
        }
        } catch (e) {
        Alert.alert('Error', e.message);
        } finally {
        setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={globalStyles.screen}>
            <View style={{ flex: 1 }}>
                {/* MAP - Always full background */}
                {pickMode && (
                    <View style={styles.mapBg}>
                        <MapPickerWeb
                            latitude={latitude}
                            longitude={longitude}
                            userLat={userLat}
                            userLng={userLng}
                            radiusKm={radiusKm}
                            pickEnabled={pickMode}
                            tempLat={tempLat}
                            tempLng={tempLng}
                            onPick={(lat, lng) => {
                                if (!pickMode) return;
                                setTempLat(lat);
                                setTempLng(lng);
                            }}
                        />
                    </View>
                )}

                {/* MAP OVERLAY */}
                {pickMode && (
                    <View style={styles.mapOverlay} pointerEvents="box-none">
                        {/* hint arriba */}
                        <View style={styles.mapOverlayTop} pointerEvents="none">
                        <Text style={styles.mapOverlayText}>Click on the map to choose the center</Text>
                        <Text style={styles.mapOverlayTextSmall}>
                            Selected: {tempLat?.toFixed?.(5) ?? '--'}, {tempLng?.toFixed?.(5) ?? '--'}
                        </Text>
                        </View>

                        {/* botones siempre visibles abajo */}
                        <View style={styles.mapOverlayBottom} pointerEvents="auto">
                        <Pressable style={[styles.overlayBtn, styles.overlayCancelBtn]} onPress={cancelMapPick}>
                            <Text style={styles.overlayBtnText}>Cancel</Text>
                        </Pressable>

                        <Pressable style={[styles.overlayBtn, styles.okBtn]} onPress={confirmMapPick}>
                            <Text style={styles.overlayBtnText}>OK</Text>
                        </Pressable>
                        </View>
                    </View>
                )}

                {/* Panel rojo */}
                {!pickMode && (
                    <>
                        <View style={styles.mapBgPreview}>
                            <MapPickerWeb
                                latitude={latitude}
                                longitude={longitude}
                                userLat={userLat}
                                userLng={userLng}
                                radiusKm={radiusKm}
                                pickEnabled={false}
                                tempLat={tempLat}
                                tempLng={tempLng}
                                onPick={() => {}}
                            />
                        </View>
                        <View style={styles.panel}>
                        <Text style={styles.header}>Create a question</Text>

                        <Text style={styles.label}>Where:</Text>
                        <View style={styles.inputRow}>
                            <Text style={styles.icon}>🔍</Text>
                            <TextInput
                                value={place}
                                onChangeText={(t) => {
                                    setPlace(t);
                                    setSearchResults([]);
                                    setPickedLabel('');
                                    }}
                                onSubmitEditing={searchAddress}
                                returnKeyType="search"
                                placeholder="Search the location *"
                                placeholderTextColor="#999"
                                style={styles.input}
                            />
                        </View>
                        
                        <Pressable
                            style={[styles.secondaryBtn, { marginTop: 10, opacity: searching ? 0.6 : 1 }]}
                            onPress={searchAddress}
                            disabled={searching}
                        >
                            <Text style={styles.secondaryBtnText}>
                            {searching ? 'Searching...' : '🔎 Search address'}
                            </Text>
                        </Pressable>

                        {/* Search results */}
                        {searchResults.length > 1 && (
                            <View style={{ marginTop: 10, gap: 8 }}>
                                {searchResults.map((r, idx) => (
                                    <Pressable
                                        key={idx}
                                        style={styles.resultBtn}
                                        onPress={() => {
                                            setLatitude(r.lat);
                                            setLongitude(r.lon);
                                            setPickedLabel(r.label);
                                            setSearchResults([]);
                                        }}
                                    >
                                        <Text style={styles.resultText}>{r.label}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}

                        <Text style={styles.helper}>*Radius will be generated automatically</Text>
                        <Text style={styles.selectedText}>
                            {pickedLabel
                            ? `Selected: ${pickedLabel}`
                            : (typeof latitude === 'number' && typeof longitude === 'number'
                                ? `Selected: (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`
                                : 'Selected: (--, --)')}
                        </Text>
                        <Text style={styles.or}>OR</Text>

                        <Pressable style={styles.secondaryBtn} onPress={openMapPick}>
                            <Text style={styles.secondaryBtnText}>📍 Circle a selected area on the map</Text>
                        </Pressable>

                        <Text style={styles.label}>Topic: *</Text>
                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Enter the topic"
                            placeholderTextColor="#999"
                            style={styles.inputFull}
                        />

                        <Text style={styles.label}>Question:</Text>
                        <TextInput
                            value={content}
                            onChangeText={setContent}
                            placeholder="Enter the question"
                            placeholderTextColor="#999"
                            style={styles.inputFull}
                        />

                        <View style={styles.timeRow}>
                            <View style={styles.timePill}>
                                <Text style={styles.timePillText}>🔒 Time</Text>
                            </View>
                            <Text style={styles.timeValue}>{hours}h</Text>
                        </View>

                        <View style={styles.lockedTimeContainer}>
                            <Text style={styles.lockedTimeText}>
                                🔒 Time fixed at {hours}h (Premium feature)
                            </Text>
                        </View>

                        <View style={styles.buttonsContainer}>
                            <Pressable
                                onPress={() => navigation.goBack()}
                                style={styles.cancelBtn}
                            >
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                onPress={onPost}
                                disabled={!canPost}
                                style={[styles.postBtn, !canPost && { opacity: 0.5 }]}
                            >
                                <Text style={styles.postBtnText}>{isSubmitting ? 'POSTING...' : 'POST'}</Text>
                            </Pressable>
                        </View>
                        </View>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mapBg: { 
        flex: 1,
        width: '100%',
        height: '100%',
    },
    mapBgPreview: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
    },
    mapBgText: { color: '#888' },

    panel: {
        position: 'absolute',
        left: 18,
        right: 18,
        top: 60,
        backgroundColor: '#D40000',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 12,
        zIndex: 10,
    },

    header: { 
        color: '#fff', 
        fontSize: 28, 
        fontWeight: '900', 
        marginBottom: 18,
        letterSpacing: -0.5,
    },

    label: { 
        color: '#fff', 
        fontWeight: '700', 
        marginTop: 14, 
        marginBottom: 8,
        fontSize: 14,
        letterSpacing: 0.3,
    },
    helper: { 
        color: '#fff', 
        fontSize: 11, 
        opacity: 0.85, 
        marginTop: 6, 
        textAlign: 'center',
        fontWeight: '500',
    },
    or: { 
        color: '#fff', 
        textAlign: 'center', 
        fontWeight: '700', 
        marginVertical: 12,
        fontSize: 13,
        opacity: 0.9,
    },

    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    icon: { fontSize: 18 },
    input: { 
        flex: 1, 
        height: 48, 
        color: '#111',
        fontSize: 15,
        fontWeight: '500',
    },

    inputFull: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        height: 48,
        color: '#111',
        fontSize: 15,
        fontWeight: '500',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    secondaryBtn: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 13,
        paddingHorizontal: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    secondaryBtnText: { 
        fontWeight: '700', 
        color: '#111',
        fontSize: 15,
        letterSpacing: 0.3,
    },

    resultBtn: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 11,
        paddingHorizontal: 13,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
    },
    resultText: { 
        color: '#111', 
        fontWeight: '600',
        fontSize: 14,
    },

    timeRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginTop: 14,
    },
    timePill: { 
        backgroundColor: '#F5D400', 
        borderRadius: 10, 
        paddingHorizontal: 12, 
        paddingVertical: 7,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 2,
    },
    timePillText: { 
        fontWeight: '900', 
        color: '#111',
        fontSize: 13,
    },
    timeValue: { 
        color: '#fff', 
        fontWeight: '900',
        fontSize: 16,
    },

    buttonsContainer: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 18,
    },

    cancelBtn: {
        flex: 0.35,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        paddingVertical: 13,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#fff',
    },
    cancelBtnText: { 
        color: '#fff', 
        fontWeight: '700', 
        fontSize: 16,
        letterSpacing: 0.5,
    },

    postBtn: {
        flex: 0.65,
        backgroundColor: '#8B0000',
        borderRadius: 12,
        paddingVertical: 13,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    postBtnText: { 
        color: '#fff', 
        fontWeight: '900', 
        fontSize: 16,
        letterSpacing: 0.5,
    },

    lockedTimeContainer: {
        marginTop: 12,
        backgroundColor: '#F5D400',
        paddingVertical: 11,
        paddingHorizontal: 13,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },

    lockedTimeText: {
        fontWeight: '700',
        color: '#111',
        fontSize: 13,
        letterSpacing: 0.2,
    },

    selectedText: {
        color: '#fff',
        fontSize: 12,
        opacity: 0.9,
        marginTop: 6,
        textAlign: 'center',
        fontWeight: '500',
    },

    mapOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 12,
        zIndex: 100,
        elevation: 100,
    },

    mapOverlayTop: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },

    mapOverlayText: {
        color: '#fff',
        fontWeight: '800',
        textAlign: 'center',
        fontSize: 16,
        letterSpacing: 0.3,
    },

    mapOverlayTextSmall: {
        color: '#fff',
        marginTop: 8,
        fontSize: 13,
        textAlign: 'center',
        opacity: 0.9,
        fontWeight: '500',
    },

    mapOverlayBottom: {
        position: 'absolute',
        left: 12,
        right: 12,
        bottom: 12,
        flexDirection: 'row',
        gap: 10,
        zIndex: 101,
        elevation: 101,
    },

    overlayBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },

    overlayCancelBtn: {
        backgroundColor: 'rgba(0,0,0,0.65)',
    },

    okBtn: {
        backgroundColor: '#007AFF',
    },

    overlayBtnText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 16,
        letterSpacing: 0.3,
    },
});
