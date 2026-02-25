package com.streetask.app.user;

import com.streetask.app.model.UserLocation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Test cases for UserLocationService
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("UserLocationService Tests")
class UserLocationServiceTest {

    @Mock
    private UserLocationRepository locationRepository;

    @InjectMocks
    private UserLocationService locationService;

    private User user;
    private UserLocationDTO locationDTO;
    private UserLocation userLocation;
    private LocalDateTime now;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(UUID.randomUUID());
        user.setUserName("testuser");

        now = LocalDateTime.now();

        locationDTO = new UserLocationDTO();
        locationDTO.setLatitude(40.4168);
        locationDTO.setLongitude(-3.7038);
        locationDTO.setAccuracy(5.0f);
        locationDTO.setIsPublic(true);

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
    @DisplayName("Should save user location with all fields")
    void testSaveUserLocation() {
        when(locationRepository.save(any(UserLocation.class))).thenReturn(userLocation);

        UserLocation result = locationService.saveUserLocation(user, locationDTO);

        assertNotNull(result);
        assertEquals(40.4168, result.getLatitude());
        assertEquals(-3.7038, result.getLongitude());
        assertEquals(5.0f, result.getAccuracy());
        assertTrue(result.getIsPublic());
        assertEquals(user, result.getUser());
        verify(locationRepository, times(1)).save(any(UserLocation.class));
    }

    @Test
    @DisplayName("Should save with default isPublic as false when null")
    void testSaveUserLocationWithNullIsPublic() {
        locationDTO.setIsPublic(null);
        when(locationRepository.save(any(UserLocation.class))).thenAnswer(invocation -> {
            UserLocation arg = invocation.getArgument(0);
            arg.setId(UUID.randomUUID());
            return arg;
        });

        UserLocation result = locationService.saveUserLocation(user, locationDTO);

        assertFalse(result.getIsPublic());
        verify(locationRepository, times(1)).save(any(UserLocation.class));
    }

    @Test
    @DisplayName("Should save with current timestamp")
    void testSaveUserLocationTimestamp() {
        when(locationRepository.save(any(UserLocation.class))).thenAnswer(invocation -> {
            UserLocation arg = invocation.getArgument(0);
            assertNotNull(arg.getTimestamp());
            arg.setId(UUID.randomUUID());
            return arg;
        });

        UserLocation result = locationService.saveUserLocation(user, locationDTO);

        assertNotNull(result.getTimestamp());
    }

    @Test
    @DisplayName("Should get user latest location")
    void testGetUserLatestLocation() {
        when(locationRepository.findFirstByUserIdOrderByTimestampDesc(user.getId()))
                .thenReturn(Optional.of(userLocation));

        Optional<UserLocation> result = locationService.getUserLatestLocation(user.getId());

        assertTrue(result.isPresent());
        assertEquals(userLocation, result.get());
        verify(locationRepository, times(1)).findFirstByUserIdOrderByTimestampDesc(user.getId());
    }

    @Test
    @DisplayName("Should return empty when user has no location")
    void testGetUserLatestLocation_NotFound() {
        when(locationRepository.findFirstByUserIdOrderByTimestampDesc(user.getId()))
                .thenReturn(Optional.empty());

        Optional<UserLocation> result = locationService.getUserLatestLocation(user.getId());

        assertFalse(result.isPresent());
    }

    @Test
    @DisplayName("Should get user latest public location")
    void testGetUserLatestPublicLocation() {
        when(locationRepository.findFirstByUserIdOrderByTimestampDesc(user.getId()))
                .thenReturn(Optional.of(userLocation));

        Optional<UserLocation> result = locationService.getUserLatestPublicLocation(user.getId());

        assertTrue(result.isPresent());
        assertEquals(userLocation, result.get());
    }

    @Test
    @DisplayName("Should return empty for private location")
    void testGetUserLatestPublicLocation_PrivateLocation() {
        userLocation.setIsPublic(false);
        when(locationRepository.findFirstByUserIdOrderByTimestampDesc(user.getId()))
                .thenReturn(Optional.of(userLocation));

        Optional<UserLocation> result = locationService.getUserLatestPublicLocation(user.getId());

        assertFalse(result.isPresent());
    }

    @Test
    @DisplayName("Should return empty when location isPublic is null")
    void testGetUserLatestPublicLocation_NullIsPublic() {
        userLocation.setIsPublic(null);
        when(locationRepository.findFirstByUserIdOrderByTimestampDesc(user.getId()))
                .thenReturn(Optional.of(userLocation));

        Optional<UserLocation> result = locationService.getUserLatestPublicLocation(user.getId());

        assertFalse(result.isPresent());
    }

    @Test
    @DisplayName("Should get all public locations")
    void testGetPublicLocations() {
        List<UserLocation> publicLocations = Arrays.asList(userLocation);
        when(locationRepository.findPublicLocations()).thenReturn(publicLocations);

        List<UserLocation> result = locationService.getPublicLocations();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(userLocation, result.get(0));
        verify(locationRepository, times(1)).findPublicLocations();
    }

    @Test
    @DisplayName("Should get public locations since minutes")
    void testGetPublicLocationsSince() {
        Integer minutesSince = 10;
        List<UserLocation> locations = Arrays.asList(userLocation);
        when(locationRepository.findPublicLocationsSince(any(LocalDateTime.class)))
                .thenReturn(locations);

        List<UserLocation> result = locationService.getPublicLocationsSince(minutesSince);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(locationRepository, times(1)).findPublicLocationsSince(any(LocalDateTime.class));
    }

    @Test
    @DisplayName("Should toggle location privacy from public to private")
    void testToggleLocationPrivacyFromPublicToPrivate() {
        userLocation.setIsPublic(true);
        when(locationRepository.findFirstByUserIdOrderByTimestampDesc(user.getId()))
                .thenReturn(Optional.of(userLocation));
        when(locationRepository.save(any(UserLocation.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserLocation result = locationService.toggleLocationPrivacy(user.getId());

        assertFalse(result.getIsPublic());
        verify(locationRepository, times(1)).save(any(UserLocation.class));
    }

    @Test
    @DisplayName("Should toggle location privacy from private to public")
    void testToggleLocationPrivacyFromPrivateToPublic() {
        userLocation.setIsPublic(false);
        when(locationRepository.findFirstByUserIdOrderByTimestampDesc(user.getId()))
                .thenReturn(Optional.of(userLocation));
        when(locationRepository.save(any(UserLocation.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserLocation result = locationService.toggleLocationPrivacy(user.getId());

        assertTrue(result.getIsPublic());
    }

    @Test
    @DisplayName("Should toggle location privacy when null to true")
    void testToggleLocationPrivacyFromNullToTrue() {
        userLocation.setIsPublic(null);
        when(locationRepository.findFirstByUserIdOrderByTimestampDesc(user.getId()))
                .thenReturn(Optional.of(userLocation));
        when(locationRepository.save(any(UserLocation.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserLocation result = locationService.toggleLocationPrivacy(user.getId());

        assertTrue(result.getIsPublic());
    }

    @Test
    @DisplayName("Should throw exception when toggling privacy for non-existent location")
    void testToggleLocationPrivacy_LocationNotFound() {
        when(locationRepository.findFirstByUserIdOrderByTimestampDesc(user.getId()))
                .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> locationService.toggleLocationPrivacy(user.getId()));
        verify(locationRepository, never()).save(any(UserLocation.class));
    }

    @Test
    @DisplayName("Should delete user location")
    void testDeleteUserLocation() {
        when(locationRepository.findFirstByUserIdOrderByTimestampDesc(user.getId()))
                .thenReturn(Optional.of(userLocation));

        locationService.deleteUserLocation(user.getId());

        verify(locationRepository, times(1)).delete(userLocation);
    }

    @Test
    @DisplayName("Should not throw error when deleting non-existent location")
    void testDeleteUserLocation_NotFound() {
        when(locationRepository.findFirstByUserIdOrderByTimestampDesc(user.getId()))
                .thenReturn(Optional.empty());

        assertDoesNotThrow(() -> locationService.deleteUserLocation(user.getId()));
        verify(locationRepository, never()).delete(any(UserLocation.class));
    }

    @Test
    @DisplayName("Should get all user locations")
    void testGetUserLocations() {
        List<UserLocation> locations = Arrays.asList(userLocation);
        when(locationRepository.findByUserIdOrderByTimestampDesc(user.getId()))
                .thenReturn(locations);

        List<UserLocation> result = locationService.getUserLocations(user.getId());

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(userLocation, result.get(0));
        verify(locationRepository, times(1)).findByUserIdOrderByTimestampDesc(user.getId());
    }

    @Test
    @DisplayName("Should return empty list when user has no locations")
    void testGetUserLocations_NoLocations() {
        when(locationRepository.findByUserIdOrderByTimestampDesc(user.getId()))
                .thenReturn(Arrays.asList());

        List<UserLocation> result = locationService.getUserLocations(user.getId());

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }
}
