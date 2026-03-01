import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Pressable, Alert, Platform  } from 'react-native';
import apiClient from '../../../shared/services/http/apiClient';
import { globalStyles } from '../../../shared/ui/theme/globalStyles';
import MapPickerWeb from '../../home/ui/components/MapPickerWeb';

const addHoursISO = (hours) => {
    const d = new Date(Date.now() + hours * 60 * 60 * 1000);
    return d.toISOString().slice(0, 19);
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
                {/* MAP */}
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

                    {pickMode ? (
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
                            <Pressable style={[styles.overlayBtn, styles.cancelBtn]} onPress={cancelMapPick}>
                                <Text style={styles.overlayBtnText}>Cancel</Text>
                            </Pressable>

                            <Pressable style={[styles.overlayBtn, styles.okBtn]} onPress={confirmMapPick}>
                                <Text style={styles.overlayBtnText}>OK</Text>
                            </Pressable>
                            </View>
                        </View>
                    ) : null}
                </View>

                {/* Panel rojo */}
                {!pickMode ? (
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

                        <Pressable
                            onPress={onPost}
                            disabled={!canPost}
                            style={[styles.postBtn, !canPost && { opacity: 0.5 }]}
                        >
                            <Text style={styles.postBtnText}>{isSubmitting ? 'POSTING...' : 'POST'}</Text>
                        </Pressable>
                    </View>
                ) : null}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mapBg: { flex: 1 },
    mapBgText: { color: '#888' },

    panel: {
        position: 'absolute',
        left: 18,
        right: 18,
        top: 60,
        backgroundColor: '#D40000',
        borderRadius: 14,
        padding: 16,
    },

    header: { color: '#fff', fontSize: 26, fontWeight: '900', marginBottom: 10 },

    label: { color: '#fff', fontWeight: '800', marginTop: 10, marginBottom: 6 },
    helper: { color: '#fff', fontSize: 12, opacity: 0.9, marginTop: 6, textAlign: 'center' },
    or: { color: '#fff', textAlign: 'center', fontWeight: '900', marginVertical: 10 },

    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 44,
        gap: 8,
    },
    icon: { fontSize: 16 },
    input: { flex: 1, height: 44, color: '#111' },

    inputFull: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 44,
        color: '#111',
    },

    secondaryBtn: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    secondaryBtnText: { fontWeight: '800', color: '#111' },

    resultBtn: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    resultText: { color: '#111', fontWeight: '800' },

    timeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
    timePill: { backgroundColor: '#F5D400', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
    timePillText: { fontWeight: '900', color: '#111' },
    timeValue: { color: '#fff', fontWeight: '900' },

    postBtn: {
        marginTop: 14,
        backgroundColor: '#8B0000',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
    },
    postBtnText: { color: '#fff', fontWeight: '900', fontSize: 16 },

    lockedTimeContainer: {
        marginTop: 10,
        backgroundColor: '#F5D400',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignItems: 'center',
    },

    lockedTimeText: {
        fontWeight: '900',
        color: '#111',
    },

    selectedText: {
        color: '#fff',
        fontSize: 12,
        opacity: 0.95,
        marginTop: 6,
        textAlign: 'center',
    },

    mapOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 12,
        zIndex: 999999,
        elevation: 999999,
    },

    mapOverlayTop: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 10,
        borderRadius: 10,
    },

    mapOverlayText: {
        color: '#fff',
        fontWeight: '900',
        textAlign: 'center',
    },

    mapOverlayTextSmall: {
        color: '#fff',
        marginTop: 6,
        fontSize: 12,
        textAlign: 'center',
        opacity: 0.9,
    },

    mapOverlayBottom: {
        position: 'absolute',
        left: 12,
        right: 12,
        bottom: 12,
        flexDirection: 'row',
        gap: 10,
        zIndex: 999999,
        elevation: 999999,
    },

    overlayBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },

    cancelBtn: {
        backgroundColor: 'rgba(0,0,0,0.65)',
    },

    okBtn: {
        backgroundColor: '#007AFF',
    },

    overlayBtnText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 16,
    },
});
