import React, { useEffect, useMemo, useState } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, TextInput,
    TouchableOpacity, Platform, ScrollView, useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../../shared/services/http/apiClient';
import { crossAlert } from '../../../shared/utils/crossAlert';
import MapPickerWeb from '../../home/ui/components/MapPickerWeb';

const addHoursISO = (hours) => {
    const nowMs = Date.now();
    return new Date(nowMs + hours * 3600000).toISOString();
};

export default function CreateQuestionScreen({ navigation }) {
    const { width } = useWindowDimensions();
    const isNarrow = width < 500;

    const [place, setPlace] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const hours = 2;
    const [radiusKm] = useState(1);
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
    const [focusedField, setFocusedField] = useState(null);

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
                },
                () => { },
                { enableHighAccuracy: true, timeout: 8000 }
            );
        }
    }, []);

    const canPost = useMemo(() => title.trim() && content.trim() && !isSubmitting, [title, content, isSubmitting]);

    const searchAddress = async () => {
        const q = place.trim();
        if (!q) {
            crossAlert('Address is missing', 'Enter a street or place name to search.');
            return;
        }

        setSearching(true);
        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&q=${encodeURIComponent(q)}`;
            const res = await fetch(url, {
                headers: { 'Accept': 'application/json' },
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const items = (data || []).map((it) => ({
                label: it.display_name,
                lat: Number(it.lat),
                lon: Number(it.lon),
            }));
            setSearchResults(items);
            if (items.length === 0) {
                crossAlert('No results', 'No addresses found. Try being more specific.');
            }
            if (items.length === 1) {
                setLatitude(items[0].lat);
                setLongitude(items[0].lon);
                setPickedLabel(items[0].label);
                setSearchResults([]);
            }
        } catch (e) {
            console.error('Nominatim search error:', e);
            crossAlert('Error', 'The address could not be found. Please try again.');
        } finally {
            setSearching(false);
        }
    };

    const openMapPick = () => {
        setTempLat(typeof latitude === 'number' ? latitude : (typeof userLat === 'number' ? userLat : 37.3886));
        setTempLng(typeof longitude === 'number' ? longitude : (typeof userLng === 'number' ? userLng : -5.9823));
        setPickMode(true);
    };

    const cancelMapPick = () => { setPickMode(false); setTempLat(null); setTempLng(null); };

    const confirmMapPick = () => {
        if (typeof tempLat !== 'number' || typeof tempLng !== 'number') {
            crossAlert('Pick a point', 'Click on the map to choose a location.');
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
                location: { latitude, longitude },
            };
            await apiClient.post('/api/v1/questions', payload);
            crossAlert('Success', 'Question created!');
            navigation.goBack();
        } catch (e) {
            crossAlert('Error', e.response?.data?.message || e.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedDisplay = pickedLabel
        ? pickedLabel
        : (typeof latitude === 'number' && typeof longitude === 'number'
            ? `(${latitude.toFixed(5)}, ${longitude.toFixed(5)})`
            : 'None');

    // ━━━ MAP PICK MODE ━━━
    if (pickMode) {
        return (
            <SafeAreaView style={styles.screen}>
                <View style={{ flex: 1 }}>
                    <View style={styles.mapFull}>
                        <MapPickerWeb
                            latitude={tempLat} longitude={tempLng}
                            userLat={userLat ?? tempLat} userLng={userLng ?? tempLng}
                            radiusKm={radiusKm} pickEnabled tempLat={tempLat} tempLng={tempLng}
                            onPick={(lat, lng) => { setTempLat(lat); setTempLng(lng); }}
                        />
                    </View>
                    <View style={styles.mapOverlay} pointerEvents="box-none">
                        <View style={styles.mapHint} pointerEvents="none">
                            <Text style={styles.mapHintText}>Tap on the map to pick a location</Text>
                            <Text style={styles.mapHintCoords}>
                                {tempLat?.toFixed?.(5) ?? '--'}, {tempLng?.toFixed?.(5) ?? '--'}
                            </Text>
                        </View>
                        <View style={styles.mapBtnRow} pointerEvents="auto">
                            <TouchableOpacity style={styles.mapCancelBtn} onPress={cancelMapPick} activeOpacity={0.8}>
                                <Text style={styles.mapCancelLabel}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.mapOkBtn} onPress={confirmMapPick} activeOpacity={0.8}>
                                <Text style={styles.mapConfirmLabel}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    // ━━━ FORM MODE ━━━
    return (
        <SafeAreaView style={styles.screen}>
            <View style={{ flex: 1, position: 'relative' }}>
                {/* Map background */}
                <View style={styles.mapBgPreview}>
                    <MapPickerWeb
                        latitude={latitude ?? userLat ?? 37.3886} longitude={longitude ?? userLng ?? -5.9823}
                        userLat={userLat ?? 37.3886} userLng={userLng ?? -5.9823}
                        radiusKm={radiusKm} pickEnabled={false}
                        tempLat={tempLat} tempLng={tempLng} onPick={() => { }}
                    />
                </View>

                {/* White card form */}
                <ScrollView
                    style={styles.formScroll}
                    contentContainerStyle={[
                        styles.formScrollContent,
                        { maxWidth: isNarrow ? '100%' : 520, alignSelf: 'center', width: '100%' },
                    ]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.card}>
                        {/* Back button */}
                        <TouchableOpacity style={styles.backRow} onPress={() => navigation.goBack()} activeOpacity={0.7}>
                            <Ionicons name="chevron-back" size={22} color="#6b7280" />
                            <Text style={styles.backText}>Back</Text>
                        </TouchableOpacity>

                        <Text style={styles.heading}>Create a Question</Text>

                        {/* Location section */}
                        <Text style={styles.sectionLabel}>Location</Text>
                        <View style={[styles.inputWrapper, focusedField === 'place' && styles.inputFocused]}>
                            <Ionicons name="search-outline" size={18} color="#9ca3af" style={{ marginRight: 8 }} />
                            <TextInput
                                value={place}
                                onChangeText={(t) => { setPlace(t); setSearchResults([]); setPickedLabel(''); }}
                                onSubmitEditing={searchAddress}
                                returnKeyType="search"
                                placeholder="Search address or place..."
                                placeholderTextColor="#9ca3af"
                                style={styles.input}
                                onFocus={() => setFocusedField('place')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>

                        <View style={styles.locationBtnRow}>
                            <TouchableOpacity
                                style={[styles.btnOutline, { flex: 1, opacity: searching ? 0.5 : 1 }]}
                                onPress={searchAddress} disabled={searching} activeOpacity={0.7}
                            >
                                <Ionicons name="search" size={16} color="#667eea" />
                                <Text style={styles.btnOutlineText}>{searching ? 'Searching...' : 'Search'}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.btnOutline, { flex: 1 }]} onPress={openMapPick} activeOpacity={0.7}>
                                <Ionicons name="location" size={16} color="#667eea" />
                                <Text style={styles.btnOutlineText}>Pick on map</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Search results */}
                        {searchResults.length > 1 && searchResults.map((r, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={styles.resultItem}
                                onPress={() => { setLatitude(r.lat); setLongitude(r.lon); setPickedLabel(r.label); setSearchResults([]); }}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="location-outline" size={16} color="#667eea" />
                                <Text style={styles.resultText} numberOfLines={2}>{r.label}</Text>
                            </TouchableOpacity>
                        ))}

                        <View style={styles.selectedRow}>
                            <Ionicons name="pin" size={14} color="#6b7280" />
                            <Text style={styles.selectedText} numberOfLines={1}>Selected: {selectedDisplay}</Text>
                        </View>
                        <Text style={styles.helperText}>Radius will be calculated automatically</Text>

                        {/* Topic */}
                        <Text style={styles.sectionLabel}>Topic *</Text>
                        <View style={[styles.inputWrapper, focusedField === 'title' && styles.inputFocused]}>
                            <TextInput
                                value={title} onChangeText={setTitle}
                                placeholder="What is this about?"
                                placeholderTextColor="#9ca3af"
                                style={styles.input}
                                onFocus={() => setFocusedField('title')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>

                        {/* Question */}
                        <Text style={styles.sectionLabel}>Question *</Text>
                        <View style={[styles.inputWrapper, styles.inputMultiline, focusedField === 'content' && styles.inputFocused]}>
                            <TextInput
                                value={content} onChangeText={setContent}
                                placeholder="Type your question here..."
                                placeholderTextColor="#9ca3af"
                                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                                multiline
                                onFocus={() => setFocusedField('content')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>

                        {/* Time info */}
                        <View style={styles.timeChip}>
                            <Ionicons name="time-outline" size={16} color="#92400e" />
                            <Text style={styles.timeChipText}>Duration: {hours}h (fixed in free plan)</Text>
                        </View>

                        {/* Buttons */}
                        <View style={styles.actionRow}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.postBtn, !canPost && { opacity: 0.4 }]}
                                onPress={onPost} disabled={!canPost} activeOpacity={0.8}
                            >
                                <Text style={styles.postBtnText}>{isSubmitting ? 'Posting...' : 'Post Question'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#f3f4f6' },

    /* ── Map backgrounds ── */
    mapFull: { flex: 1, width: '100%', height: '100%' },
    mapBgPreview: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 },
    mapOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 16, zIndex: 100, justifyContent: 'space-between' },
    mapHint: { backgroundColor: 'rgba(255,255,255,0.95)', padding: 16, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 6 },
    mapHintText: { fontWeight: '700', fontSize: 15, color: '#1f2937', textAlign: 'center' },
    mapHintCoords: { fontSize: 13, color: '#6b7280', textAlign: 'center', marginTop: 6 },
    mapBtnRow: { flexDirection: 'row', gap: 12 },
    mapCancelBtn: { flex: 1, backgroundColor: '#fff', borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
    mapOkBtn: { flex: 1, backgroundColor: '#667eea', borderRadius: 14, paddingVertical: 14, alignItems: 'center', shadowColor: '#667eea', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 5 },
    mapCancelLabel: { fontWeight: '700', fontSize: 15, color: '#1f2937' },
    mapConfirmLabel: { fontWeight: '700', fontSize: 15, color: '#fff' },

    /* ── Form card ── */
    formScroll: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 },
    formScrollContent: { padding: 16, paddingTop: 40, paddingBottom: 40 },
    card: {
        backgroundColor: 'rgba(255,255,255,0.92)',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 8,
        backdropFilter: 'blur(12px)',
    },
    backRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 4 },
    backText: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
    heading: { fontSize: 24, fontWeight: '800', color: '#1f2937', marginBottom: 20 },
    sectionLabel: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 8, marginTop: 16, textTransform: 'uppercase', letterSpacing: 0.5 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 14, height: 48 },
    inputFocused: { borderColor: '#667eea', backgroundColor: '#fff' },
    inputMultiline: { height: 'auto', alignItems: 'flex-start', paddingVertical: 12 },
    input: { flex: 1, fontSize: 14, color: '#1f2937', outlineStyle: 'none' },

    locationBtnRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
    btnOutline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1.5, borderColor: '#667eea', borderRadius: 12, paddingVertical: 11, backgroundColor: '#f0f0ff' },
    btnOutlineText: { fontSize: 13, fontWeight: '600', color: '#667eea' },

    resultItem: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f9fafb', borderRadius: 10, padding: 12, marginTop: 8, borderWidth: 1, borderColor: '#e5e7eb' },
    resultText: { flex: 1, fontSize: 13, color: '#374151' },

    selectedRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
    selectedText: { fontSize: 12, color: '#6b7280', flex: 1 },
    helperText: { fontSize: 11, color: '#9ca3af', marginTop: 4 },

    timeChip: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fef3c7', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, marginTop: 20 },
    timeChipText: { fontSize: 13, fontWeight: '600', color: '#92400e' },

    actionRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
    cancelBtn: { flex: 0.35, backgroundColor: '#f3f4f6', borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
    cancelBtnText: { fontWeight: '600', fontSize: 15, color: '#6b7280' },
    postBtn: { flex: 0.65, backgroundColor: '#667eea', borderRadius: 14, paddingVertical: 14, alignItems: 'center', shadowColor: '#667eea', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 5 },
    postBtnText: { fontWeight: '700', fontSize: 15, color: '#fff' },
});
