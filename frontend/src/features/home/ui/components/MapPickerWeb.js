import React, { useEffect, useMemo } from 'react';
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
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
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

function Recenter({ lat, lng, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (typeof lat === 'number' && typeof lng === 'number') {
      map.setView([lat, lng], zoom, { animate: true });
    }
  }, [lat, lng, map, zoom]);
  return null;
}

const getZoomForRadiusKm = (radiusKm) => {
  const r = Number(radiusKm);
  if (!Number.isFinite(r) || r <= 0) return 15;
  if (r <= 0.3) return 16;
  if (r <= 0.8) return 15;
  if (r <= 1.5) return 14;
  if (r <= 3) return 13;
  if (r <= 6) return 12;
  if (r <= 12) return 11;
  if (r <= 25) return 10;
  return 9;
};

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
  const userLocationIcon = useMemo(() => {
    if (!L) return null;
    return L.divIcon({
      className: '',
      html: `<div style="
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #a52019;
        border: 3px solid #ffffff;
        box-shadow: 0 0 0 3px rgba(165,32,25,0.35);
      "></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  }, []);

  // Guard clauses AFTER hooks
  if (Platform.OS !== 'web') return null;
  if (!MapContainer || !TileLayer || !Marker || !Circle || !L) return null;

  const baseLat = typeof latitude === 'number' ? latitude : userLat;
  const baseLng = typeof longitude === 'number' ? longitude : userLng;

  const activeLat = pickEnabled && typeof tempLat === 'number' ? tempLat : baseLat;
  const activeLng = pickEnabled && typeof tempLng === 'number' ? tempLng : baseLng;
  const zoom = getZoomForRadiusKm(radiusKm);

  if (typeof activeLat !== 'number' || typeof activeLng !== 'number') return null;

  return (
    <MapContainer
      center={[activeLat, activeLng]}
      zoom={zoom}
      style={{ width: '100%', height: '100%', zIndex: 1 }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Recenter lat={activeLat} lng={activeLng} zoom={zoom} />
      <ClickHandler enabled={pickEnabled} onPick={onPick} />

      {typeof userLat === 'number' && typeof userLng === 'number' && userLocationIcon ? (
        <Marker position={[userLat, userLng]} icon={userLocationIcon} interactive={false} />
      ) : null}

      {pickEnabled && typeof tempLat === 'number' && typeof tempLng === 'number' ? (
        <Marker position={[tempLat, tempLng]} />
      ) : typeof baseLat === 'number' && typeof baseLng === 'number' ? (
        <Marker position={[baseLat, baseLng]} />
      ) : null}

      {typeof radiusKm === 'number' ? (
        <Circle
          center={[activeLat, activeLng]}
          radius={radiusKm * 1000}
          pathOptions={{
            color: '#a52019',
            weight: 3,
            fillColor: '#a52019',
            fillOpacity: 0.2,
            dashArray: '6 4',
          }}
        />
      ) : null}
    </MapContainer>
  );
}
