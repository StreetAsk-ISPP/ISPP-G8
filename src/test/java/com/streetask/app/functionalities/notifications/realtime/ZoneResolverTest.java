package com.streetask.app.functionalities.notifications.realtime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Set;

import org.junit.jupiter.api.Test;

class ZoneResolverTest {

    @Test
    void resolveZoneKeysWithinRadiusReturnsCenterZoneForZeroRadius() {
        ZoneResolver zoneResolver = new ZoneResolver(0.02d);

        String centerZone = zoneResolver.resolveZoneKey(37.7749d, -122.4194d);
        Set<String> zoneKeys = zoneResolver.resolveZoneKeysWithinRadius(37.7749d, -122.4194d, 0d);

        assertEquals(Set.of(centerZone), zoneKeys);
    }

    @Test
    void resolveZoneKeysWithinRadiusExcludesDiagonalBucketsOutsideCircle() {
        ZoneResolver zoneResolver = new ZoneResolver(0.01d);

        Set<String> zoneKeys = zoneResolver.resolveZoneKeysWithinRadius(0.005d, 0.005d, 0.1d);

        assertEquals(Set.of("9000_18000"), zoneKeys);
    }

    @Test
    void resolveZoneKeysWithinRadiusIncludesNeighborBucketWhenCircleTouchesIt() {
        ZoneResolver zoneResolver = new ZoneResolver(0.01d);

        Set<String> zoneKeys = zoneResolver.resolveZoneKeysWithinRadius(0.0098d, 0d, 0.3d);

        assertTrue(zoneKeys.contains("9001_18000"));
        assertTrue(zoneKeys.contains("9000_18000"));
    }
}