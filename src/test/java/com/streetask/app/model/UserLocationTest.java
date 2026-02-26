package com.streetask.app.model;

import com.streetask.app.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test cases for UserLocation entity
 */
@DisplayName("UserLocation Entity Tests")
class UserLocationTest {

    private UserLocation userLocation;
    private User user;
    private LocalDateTime now;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(UUID.randomUUID());
        user.setUserName("testuser");
        
        now = LocalDateTime.now();
        
        userLocation = new UserLocation();
        userLocation.setId(UUID.randomUUID());
        userLocation.setUser(user);
        userLocation.setLatitude(40.4168);
        userLocation.setLongitude(-3.7038);
        userLocation.setAccuracy(5.0f);
        userLocation.setTimestamp(now);
        userLocation.setIsPublic(true);
    }

    @Test
    @DisplayName("Should create UserLocation with all fields")
    void testUserLocationCreation() {
        assertNotNull(userLocation);
        assertNotNull(userLocation.getId());
        assertEquals(user, userLocation.getUser());
        assertEquals(40.4168, userLocation.getLatitude());
        assertEquals(-3.7038, userLocation.getLongitude());
        assertEquals(5.0f, userLocation.getAccuracy());
        assertEquals(now, userLocation.getTimestamp());
        assertTrue(userLocation.getIsPublic());
    }

    @Test
    @DisplayName("Should create UserLocation with no-args constructor")
    void testUserLocationNoArgsConstructor() {
        UserLocation defaultLocation = new UserLocation();
        assertNotNull(defaultLocation);
        assertNull(defaultLocation.getUser());
        assertNull(defaultLocation.getLatitude());
        assertNull(defaultLocation.getLongitude());
        assertNull(defaultLocation.getAccuracy());
        assertNull(defaultLocation.getTimestamp());
        assertNull(defaultLocation.getIsPublic());
    }

    @Test
    @DisplayName("Should create UserLocation with all-args constructor")
    void testUserLocationAllArgsConstructor() {
        UserLocation location = new UserLocation(user, 40.4168, -3.7038, 5.0f, now, true);
        assertEquals(user, location.getUser());
        assertEquals(40.4168, location.getLatitude());
        assertEquals(-3.7038, location.getLongitude());
        assertEquals(5.0f, location.getAccuracy());
        assertEquals(now, location.getTimestamp());
        assertTrue(location.getIsPublic());
    }

    @Test
    @DisplayName("Should set and get user")
    void testSetGetUser() {
        User newUser = new User();
        newUser.setId(UUID.randomUUID());
        newUser.setUserName("newuser");
        
        userLocation.setUser(newUser);
        assertEquals(newUser, userLocation.getUser());
    }

    @Test
    @DisplayName("Should set and get latitude")
    void testSetGetLatitude() {
        Double newLatitude = 51.5074;
        userLocation.setLatitude(newLatitude);
        assertEquals(newLatitude, userLocation.getLatitude());
    }

    @Test
    @DisplayName("Should set and get longitude")
    void testSetGetLongitude() {
        Double newLongitude = -0.1278;
        userLocation.setLongitude(newLongitude);
        assertEquals(newLongitude, userLocation.getLongitude());
    }

    @Test
    @DisplayName("Should set and get accuracy")
    void testSetGetAccuracy() {
        Float newAccuracy = 10.5f;
        userLocation.setAccuracy(newAccuracy);
        assertEquals(newAccuracy, userLocation.getAccuracy());
    }

    @Test
    @DisplayName("Should set and get timestamp")
    void testSetGetTimestamp() {
        LocalDateTime newTimestamp = LocalDateTime.now().minusHours(1);
        userLocation.setTimestamp(newTimestamp);
        assertEquals(newTimestamp, userLocation.getTimestamp());
    }

    @Test
    @DisplayName("Should set and get isPublic")
    void testSetGetIsPublic() {
        userLocation.setIsPublic(false);
        assertFalse(userLocation.getIsPublic());
        
        userLocation.setIsPublic(true);
        assertTrue(userLocation.getIsPublic());
    }

    @Test
    @DisplayName("Should allow null values for optional fields")
    void testNullValuesAllowed() {
        userLocation.setUser(null);
        userLocation.setLatitude(null);
        userLocation.setLongitude(null);
        userLocation.setAccuracy(null);
        userLocation.setTimestamp(null);
        userLocation.setIsPublic(null);
        
        assertNull(userLocation.getUser());
        assertNull(userLocation.getLatitude());
        assertNull(userLocation.getLongitude());
        assertNull(userLocation.getAccuracy());
        assertNull(userLocation.getTimestamp());
        assertNull(userLocation.getIsPublic());
    }

    @Test
    @DisplayName("Should handle very high and low latitude values")
    void testLatitudeExtremeValues() {
        userLocation.setLatitude(90.0); // North Pole
        assertEquals(90.0, userLocation.getLatitude());
        
        userLocation.setLatitude(-90.0); // South Pole
        assertEquals(-90.0, userLocation.getLatitude());
    }

    @Test
    @DisplayName("Should handle very high and low longitude values")
    void testLongitudeExtremeValues() {
        userLocation.setLongitude(180.0); // International Date Line
        assertEquals(180.0, userLocation.getLongitude());
        
        userLocation.setLongitude(-180.0); // International Date Line (other side)
        assertEquals(-180.0, userLocation.getLongitude());
    }
}
