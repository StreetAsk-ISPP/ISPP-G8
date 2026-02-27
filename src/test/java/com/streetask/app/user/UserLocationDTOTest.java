package com.streetask.app.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test cases for UserLocationDTO
 */
@DisplayName("UserLocationDTO Tests")
class UserLocationDTOTest {

    private UserLocationDTO dto;

    @BeforeEach
    void setUp() {
        dto = new UserLocationDTO();
    }

    @Test
    @DisplayName("Should create UserLocationDTO with no-args constructor")
    void testUserLocationDTONoArgsConstructor() {
        UserLocationDTO newDTO = new UserLocationDTO();
        assertNotNull(newDTO);
        assertNull(newDTO.getLatitude());
        assertNull(newDTO.getLongitude());
        assertNull(newDTO.getAccuracy());
        assertNull(newDTO.getIsPublic());
    }

    @Test
    @DisplayName("Should create UserLocationDTO with all-args constructor")
    void testUserLocationDTOAllArgsConstructor() {
        UserLocationDTO newDTO = new UserLocationDTO(40.4168, -3.7038, 5.0f, true);
        assertEquals(40.4168, newDTO.getLatitude());
        assertEquals(-3.7038, newDTO.getLongitude());
        assertEquals(5.0f, newDTO.getAccuracy());
        assertTrue(newDTO.getIsPublic());
    }

    @Test
    @DisplayName("Should set and get latitude")
    void testSetGetLatitude() {
        Double latitude = 51.5074;
        dto.setLatitude(latitude);
        assertEquals(latitude, dto.getLatitude());
    }

    @Test
    @DisplayName("Should set and get longitude")
    void testSetGetLongitude() {
        Double longitude = -0.1278;
        dto.setLongitude(longitude);
        assertEquals(longitude, dto.getLongitude());
    }

    @Test
    @DisplayName("Should set and get accuracy")
    void testSetGetAccuracy() {
        Float accuracy = 10.5f;
        dto.setAccuracy(accuracy);
        assertEquals(accuracy, dto.getAccuracy());
    }

    @Test
    @DisplayName("Should set and get isPublic")
    void testSetGetIsPublic() {
        dto.setIsPublic(true);
        assertTrue(dto.getIsPublic());
        
        dto.setIsPublic(false);
        assertFalse(dto.getIsPublic());
    }

    @Test
    @DisplayName("Should allow null values")
    void testNullValuesAllowed() {
        dto.setLatitude(null);
        dto.setLongitude(null);
        dto.setAccuracy(null);
        dto.setIsPublic(null);
        
        assertNull(dto.getLatitude());
        assertNull(dto.getLongitude());
        assertNull(dto.getAccuracy());
        assertNull(dto.getIsPublic());
    }

    @Test
    @DisplayName("Should handle valid Spain coordinates")
    void testSpainCoordinates() {
        dto.setLatitude(40.4168);
        dto.setLongitude(-3.7038);
        dto.setAccuracy(5.0f);
        dto.setIsPublic(true);
        
        assertEquals(40.4168, dto.getLatitude());
        assertEquals(-3.7038, dto.getLongitude());
        assertEquals(5.0f, dto.getAccuracy());
        assertTrue(dto.getIsPublic());
    }

    @Test
    @DisplayName("Should handle extreme latitude values")
    void testExtremeLatitudes() {
        dto.setLatitude(90.0);
        assertEquals(90.0, dto.getLatitude());
        
        dto.setLatitude(-90.0);
        assertEquals(-90.0, dto.getLatitude());
    }

    @Test
    @DisplayName("Should handle extreme longitude values")
    void testExtremeLongitudes() {
        dto.setLongitude(180.0);
        assertEquals(180.0, dto.getLongitude());
        
        dto.setLongitude(-180.0);
        assertEquals(-180.0, dto.getLongitude());
    }

    @Test
    @DisplayName("Should handle zero accuracy")
    void testZeroAccuracy() {
        dto.setAccuracy(0.0f);
        assertEquals(0.0f, dto.getAccuracy());
    }

    @Test
    @DisplayName("Should handle very high accuracy values")
    void testHighAccuracy() {
        dto.setAccuracy(10000.0f);
        assertEquals(10000.0f, dto.getAccuracy());
    }

    @Test
    @DisplayName("Should handle precision in coordinates")
    void testCoordinatePrecision() {
        Double latitude = 40.41689123456789;
        Double longitude = -3.70380987654321;
        
        dto.setLatitude(latitude);
        dto.setLongitude(longitude);
        
        assertEquals(latitude, dto.getLatitude());
        assertEquals(longitude, dto.getLongitude());
    }
}
