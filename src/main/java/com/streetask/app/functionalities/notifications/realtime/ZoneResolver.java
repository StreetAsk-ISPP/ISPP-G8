package com.streetask.app.functionalities.notifications.realtime;

import java.util.LinkedHashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ZoneResolver {

    private final double cellSizeDegrees;
    private static final double KM_PER_LAT_DEGREE = 111.32d;

    public ZoneResolver(@Value("${streetask.websocket.zone.cell-size-degrees:0.02}") double cellSizeDegrees) {
        this.cellSizeDegrees = cellSizeDegrees;
    }

    public String resolveZoneKey(Double latitude, Double longitude) {
        if (latitude == null || longitude == null) {
            return null;
        }
        if (cellSizeDegrees <= 0d) {
            return null;
        }

        int latBucket = (int) Math.floor((latitude + 90d) / cellSizeDegrees);
        int lonBucket = (int) Math.floor((longitude + 180d) / cellSizeDegrees);
        return latBucket + "_" + lonBucket;
    }

    public Set<String> resolveZoneKeysWithinRadius(Double latitude, Double longitude, Double radiusKm) {
        Set<String> zoneKeys = new LinkedHashSet<>();
        String centerZone = resolveZoneKey(latitude, longitude);
        if (centerZone == null) {
            return zoneKeys;
        }

        double safeRadiusKm = radiusKm == null || radiusKm < 0d ? 0d : radiusKm;
        if (safeRadiusKm == 0d) {
            zoneKeys.add(centerZone);
            return zoneKeys;
        }

        double latitudeDelta = safeRadiusKm / KM_PER_LAT_DEGREE;
        double cosLat = Math.cos(Math.toRadians(latitude));
        double longitudeDelta = safeRadiusKm / (KM_PER_LAT_DEGREE * Math.max(Math.abs(cosLat), 0.1d));

        int minLatBucket = (int) Math.floor(((latitude - latitudeDelta) + 90d) / cellSizeDegrees);
        int maxLatBucket = (int) Math.floor(((latitude + latitudeDelta) + 90d) / cellSizeDegrees);
        int minLonBucket = (int) Math.floor(((longitude - longitudeDelta) + 180d) / cellSizeDegrees);
        int maxLonBucket = (int) Math.floor(((longitude + longitudeDelta) + 180d) / cellSizeDegrees);

        for (int latBucket = minLatBucket; latBucket <= maxLatBucket; latBucket++) {
            for (int lonBucket = minLonBucket; lonBucket <= maxLonBucket; lonBucket++) {
                if (cellIntersectsRadius(latitude, longitude, safeRadiusKm, latBucket, lonBucket)) {
                    zoneKeys.add(latBucket + "_" + lonBucket);
                }
            }
        }

        return zoneKeys;
    }

    private boolean cellIntersectsRadius(double latitude, double longitude, double radiusKm, int latBucket,
            int lonBucket) {
        double minLat = (latBucket * cellSizeDegrees) - 90d;
        double maxLat = minLat + cellSizeDegrees;
        double minLon = (lonBucket * cellSizeDegrees) - 180d;
        double maxLon = minLon + cellSizeDegrees;

        double closestLat = clamp(latitude, minLat, maxLat);
        double closestLon = clamp(longitude, minLon, maxLon);

        return haversineDistanceKm(latitude, longitude, closestLat, closestLon) <= radiusKm;
    }

    private double clamp(double value, double min, double max) {
        return Math.max(min, Math.min(max, value));
    }

    private double haversineDistanceKm(double latitude1, double longitude1, double latitude2, double longitude2) {
        double lat1Radians = Math.toRadians(latitude1);
        double lon1Radians = Math.toRadians(longitude1);
        double lat2Radians = Math.toRadians(latitude2);
        double lon2Radians = Math.toRadians(longitude2);

        double latitudeDifference = lat2Radians - lat1Radians;
        double longitudeDifference = lon2Radians - lon1Radians;

        double a = Math.sin(latitudeDifference / 2d) * Math.sin(latitudeDifference / 2d)
                + Math.cos(lat1Radians) * Math.cos(lat2Radians)
                        * Math.sin(longitudeDifference / 2d) * Math.sin(longitudeDifference / 2d);
        double c = 2d * Math.atan2(Math.sqrt(a), Math.sqrt(1d - a));

        return 6371d * c;
    }
}
