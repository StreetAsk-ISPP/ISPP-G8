import { React, useEffect, useMemo} from 'react';
import { Platform } from 'react-native';

let MapContainer, TileLayer, Marker, Circle;
let useMapEvents, useMap;
let L;

if (Platform.OS === 'web') {
    require('leaflet/dist/leaflet.css');
    MapContainer = require('react-leaflet').MapContainer;
    TileLayer = require('react-leaflet').TileLayer;
    Marker = require('react-leaflet').Marker;
    Circle = require('react-leaflet').Circle;
    useMapEvents = require('react-leaflet').useMapEvents;
    useMap = require('react-leaflet').useMap;
    L = require('leaflet');

    // Fix default icon paths for Leaflet
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
}

function ClickHandler({ onPick, enabled }) {
    useMapEvents({
        click(e) {
        if (!enabled) return;
        onPick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

function Recenter({ lat, lng }) {
    const map = useMap();
    useEffect(() => {
        if (typeof lat === 'number' && typeof lng === 'number') {
        map.setView([lat, lng], map.getZoom(), { animate: true });
        }
    }, [lat, lng, map]);
    return null;
}

export default function MapPickerWeb({
    latitude,
    longitude,
    userLat,
    userLng,
    radiusKm,
    pickEnabled = false,
    onPick,
    tempLat,
    tempLng,
}) {
    if (Platform.OS !== 'web') return null;
    if (!MapContainer || !TileLayer || !Marker || !Circle || !L) return null;

    const baseLat = typeof latitude === 'number' ? latitude : userLat;
    const baseLng = typeof longitude === 'number' ? longitude : userLng;

    const activeLat = pickEnabled && typeof tempLat === 'number' ? tempLat : baseLat;
    const activeLng = pickEnabled && typeof tempLng === 'number' ? tempLng : baseLng;

    if (typeof activeLat !== 'number' || typeof activeLng !== 'number') return null;

    const redDotIcon = useMemo(() => {
        return L.divIcon({
            className: '',
            html: `<div style="
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: #D40000;
                border: 3px solid white;
                box-shadow: 0 2px 6px rgba(0,0,0,0.35);
            "></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
        });
    }, []);

    return (
        <MapContainer center={[activeLat, activeLng]} zoom={15} style={{ width: '100%', height: '100%', zIndex: 1 }}>
            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Recenter lat={activeLat} lng={activeLng} />
            <ClickHandler enabled={pickEnabled} onPick={onPick} />

            {typeof userLat === 'number' && typeof userLng === 'number' ? (
                <Marker position={[userLat, userLng]} icon={redDotIcon} interactive={false} />
            ) : null}

            {(pickEnabled && typeof tempLat === 'number' && typeof tempLng === 'number') ? (
                <Marker position={[tempLat, tempLng]} />
            ) : (
                <Marker position={[latitude, longitude]} />
            )}

            <Circle
                center={[activeLat, activeLng]}
                radius={radiusKm * 1000}
                pathOptions={{
                color: '#D40000',
                weight: 3,
                fillColor: '#D40000',
                fillOpacity: 0.18,
                }}
            />
        </MapContainer>
    );
}