package com.streetask.app.user;

import com.streetask.app.model.UserLocation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.annotation.DirtiesContext;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test cases for UserLocationRepository
 */
@DataJpaTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@DisplayName("UserLocationRepository Tests")
class UserLocationRepositoryTest {

    @Autowired
    private UserLocationRepository userLocationRepository;

    @Autowired
    private TestEntityManager entityManager;

    private User user1;
    private User user2;
    private Authorities authority;
    private UserLocation location1;
    private UserLocation location2;
    private UserLocation location3;

    @BeforeEach
    void setUp() {
        // Clear the persistence context before each test
        entityManager.clear();
        
        // Create test authority with unique name
        authority = new Authorities();
        authority.setAuthority("USER_" + UUID.randomUUID().toString().substring(0, 8));
        entityManager.persistAndFlush(authority);

        // Create test users
        user1 = new User();
        user1.setUserName("user1");
        user1.setFirstName("Test");
        user1.setLastName("User1");
        user1.setEmail("user1@test.com");
        user1.setAuthority(authority);
        entityManager.persistAndFlush(user1);

        user2 = new User();
        user2.setUserName("user2");
        user2.setFirstName("Test");
        user2.setLastName("User2");
        user2.setEmail("user2@test.com");
        user2.setAuthority(authority);
        entityManager.persistAndFlush(user2);

        // Create test locations
        LocalDateTime now = LocalDateTime.now();

        location1 = new UserLocation();
        location1.setUser(user1);
        location1.setLatitude(40.4168);
        location1.setLongitude(-3.7038);
        location1.setAccuracy(5.0f);
        location1.setTimestamp(now.minusHours(2));
        location1.setIsPublic(true);
        entityManager.persistAndFlush(location1);

        location2 = new UserLocation();
        location2.setUser(user1);
        location2.setLatitude(40.4200);
        location2.setLongitude(-3.7050);
        location2.setAccuracy(3.0f);
        location2.setTimestamp(now.minusHours(1));
        location2.setIsPublic(false);
        entityManager.persistAndFlush(location2);

        location3 = new UserLocation();
        location3.setUser(user2);
        location3.setLatitude(51.5074);
        location3.setLongitude(-0.1278);
        location3.setAccuracy(4.5f);
        location3.setTimestamp(now);
        location3.setIsPublic(true);
        entityManager.persistAndFlush(location3);
    }

    @Test
    @DisplayName("Should find latest location by user ID")
    void testFindFirstByUserIdOrderByTimestampDesc() {
        Optional<UserLocation> result = userLocationRepository.findFirstByUserIdOrderByTimestampDesc(user1.getId());

        assertTrue(result.isPresent());
        assertEquals(location2.getId(), result.get().getId());
        assertEquals(user1.getId(), result.get().getUser().getId());
    }

    @Test
    @DisplayName("Should return empty when user has no locations")
    void testFindFirstByUserIdOrderByTimestampDesc_NoLocations() {
        User userWithoutLocations = new User();
        userWithoutLocations.setUserName("nolocations");
        userWithoutLocations.setFirstName("No");
        userWithoutLocations.setLastName("Locations");
        userWithoutLocations.setEmail("nolocations@test.com");
        userWithoutLocations.setAuthority(authority);
        entityManager.persistAndFlush(userWithoutLocations);

        Optional<UserLocation> result = userLocationRepository.findFirstByUserIdOrderByTimestampDesc(userWithoutLocations.getId());

        assertFalse(result.isPresent());
    }

    @Test
    @DisplayName("Should find all public locations")
    void testFindPublicLocations() {
        List<UserLocation> results = userLocationRepository.findPublicLocations();

        assertNotNull(results);
        assertTrue(results.size() >= 2);
        assertTrue(results.stream().allMatch(l -> l.getIsPublic() != null && l.getIsPublic()));
    }

    @Test
    @DisplayName("Should order public locations by timestamp descending")
    void testFindPublicLocationsOrderByTimestamp() {
        List<UserLocation> results = userLocationRepository.findPublicLocations();

        assertTrue(results.size() >= 2);
        for (int i = 0; i < results.size() - 1; i++) {
            assertTrue(results.get(i).getTimestamp().isAfter(results.get(i + 1).getTimestamp()) ||
                    results.get(i).getTimestamp().isEqual(results.get(i + 1).getTimestamp()));
        }
    }

    @Test
    @DisplayName("Should find public locations since a specific time")
    void testFindPublicLocationsSince() {
        LocalDateTime since = LocalDateTime.now().minusMinutes(30);
        List<UserLocation> results = userLocationRepository.findPublicLocationsSince(since);

        assertNotNull(results);
        assertTrue(results.stream().allMatch(l -> l.getTimestamp().isAfter(since) || l.getTimestamp().isEqual(since)));
        assertTrue(results.stream().allMatch(l -> l.getIsPublic() != null && l.getIsPublic()));
    }

    @Test
    @DisplayName("Should find all user locations ordered by timestamp descending")
    void testFindByUserIdOrderByTimestampDesc() {
        List<UserLocation> results = userLocationRepository.findByUserIdOrderByTimestampDesc(user1.getId());

        assertNotNull(results);
        assertEquals(2, results.size());
        assertEquals(location2.getId(), results.get(0).getId());
        assertEquals(location1.getId(), results.get(1).getId());
    }

    @Test
    @DisplayName("Should return empty list when user has no locations")
    void testFindByUserIdOrderByTimestampDesc_NoLocations() {
        User userWithoutLocations = new User();
        userWithoutLocations.setUserName("nolocations2");
        userWithoutLocations.setFirstName("No");
        userWithoutLocations.setLastName("Locations2");
        userWithoutLocations.setEmail("nolocations2@test.com");
        userWithoutLocations.setAuthority(authority);
        entityManager.persistAndFlush(userWithoutLocations);

        List<UserLocation> results = userLocationRepository.findByUserIdOrderByTimestampDesc(userWithoutLocations.getId());

        assertNotNull(results);
        assertTrue(results.isEmpty());
    }

    @Test
    @DisplayName("Should persist and retrieve UserLocation")
    void testSaveAndRetrieve() {
        User testUser = new User();
        testUser.setUserName("testuser");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setEmail("testuser@test.com");
        testUser.setAuthority(authority);
        entityManager.persistAndFlush(testUser);

        UserLocation newLocation = new UserLocation();
        newLocation.setUser(testUser);
        newLocation.setLatitude(48.8566);
        newLocation.setLongitude(2.3522);
        newLocation.setAccuracy(2.5f);
        newLocation.setTimestamp(LocalDateTime.now());
        newLocation.setIsPublic(true);

        UserLocation saved = userLocationRepository.save(newLocation);
        entityManager.flush();

        assertNotNull(saved.getId());
        Optional<UserLocation> retrieved = userLocationRepository.findById(saved.getId());
        assertTrue(retrieved.isPresent());
        assertEquals(48.8566, retrieved.get().getLatitude());
        assertEquals(2.3522, retrieved.get().getLongitude());
    }

    @Test
    @DisplayName("Should delete UserLocation")
    void testDelete() {
        UUID locationIdToDelete = location1.getId();
        userLocationRepository.deleteById(locationIdToDelete);
        entityManager.flush();

        Optional<UserLocation> result = userLocationRepository.findById(locationIdToDelete);
        assertFalse(result.isPresent());
    }

    @Test
    @DisplayName("Should find public locations excluding private ones")
    void testPublicLocationsExcludePrivate() {
        List<UserLocation> results = userLocationRepository.findPublicLocations();

        assertTrue(results.stream().noneMatch(l -> l.getId().equals(location2.getId())));
        assertTrue(results.stream().anyMatch(l -> l.getId().equals(location1.getId())));
        assertTrue(results.stream().anyMatch(l -> l.getId().equals(location3.getId())));
    }

    @Test
    @DisplayName("Should find locations within time range")
    void testFindPublicLocationsSinceTimeRange() {
        LocalDateTime since = LocalDateTime.now().minusMinutes(90);
        List<UserLocation> results = userLocationRepository.findPublicLocationsSince(since);

        assertTrue(results.stream().allMatch(l -> l.getTimestamp().isAfter(since)));
    }
}
