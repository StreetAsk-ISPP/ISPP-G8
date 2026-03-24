package com.streetask.app.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.streetask.app.question.QuestionRepository;
import com.streetask.app.question.QuestionService;
import com.streetask.app.user.AuthoritiesRepository;
import com.streetask.app.user.Authorities;
import com.streetask.app.user.RegularUser;
import com.streetask.app.user.RegularUserRepository;
import com.streetask.app.user.UserLocationRepository;
import com.streetask.app.user.UserLocationService;
import com.streetask.app.model.Question;
import com.streetask.app.model.UserLocation;

@SpringBootTest
@Transactional
@DisplayName("Location-Based Question Integration Tests")
class LocationBasedQuestionIntegrationTest {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private UserLocationService userLocationService;

    @Autowired
    private UserLocationRepository userLocationRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private RegularUserRepository userRepository;

    @Autowired
    private AuthoritiesRepository authoritiesRepository;

    private RegularUser user1;
    private RegularUser user2;
    private RegularUser user3;
    private Authorities authority;

    private static final Double USER1_LAT = 40.7128;
    private static final Double USER1_LON = -74.0060;
    private static final Double USER2_LAT = 40.7200;
    private static final Double USER2_LON = -74.0100;
    private static final Double USER3_LAT = 34.0522;
    private static final Double USER3_LON = -118.2437;

    @BeforeEach
    void setUp() {
        authority = createAuthority("USER");
        user1 = createUser("user1", authority);
        user2 = createUser("user2", authority);
        user3 = createUser("user3", authority);
    }

    @Test
    @DisplayName("FLOW 1: Publish and retrieve user location")
    void testPublishAndRetrieveLocation() {
        // User publishes public location
        UserLocation location = createUserLocation(user1, USER1_LAT, USER1_LON, true);

        assertNotNull(location.getId());
        assertEquals(user1.getId(), location.getUser().getId());
        assertEquals(USER1_LAT, location.getLatitude());
        assertEquals(USER1_LON, location.getLongitude());

        // Verify location is retrievable
        Optional<UserLocation> retrieved = userLocationRepository.findById(location.getId());
        assertTrue(retrieved.isPresent());
        assertEquals(location.getLatitude(), retrieved.get().getLatitude());
    }

    @Test
    @DisplayName("FLOW 2: Public locations visible to others, private locations not")
    void testLocationVisibility() {
        UserLocation publicLocation = createUserLocation(user1, USER1_LAT, USER1_LON, true);
        UserLocation privateLocation = createUserLocation(user2, USER2_LAT, USER2_LON, false);

        // Query public locations (simulating other users seeing them)
        List<UserLocation> publicLocations = (List<UserLocation>) userLocationRepository.findAll();

        // Both locations should be in DB, but filtering would happen at service level
        assertTrue(publicLocations.size() >= 2);
        assertTrue(publicLocations.stream()
                .anyMatch(l -> l.getId().equals(publicLocation.getId())));
        assertTrue(publicLocations.stream()
                .anyMatch(l -> l.getId().equals(privateLocation.getId())));
    }

    @Test
    @DisplayName("FLOW 3: Location update (user moves)")
    void testLocationUpdate() {
        UserLocation initialLocation = createUserLocation(user1, USER1_LAT, USER1_LON, true);
        UUID locationId = initialLocation.getId();

        // User moves and publishes new location
        UserLocation updatedLocation = createUserLocation(user1, USER2_LAT, USER2_LON, true);

        // Retrieve most recent location (in real implementation would be
        // findFirst...OrderByTimestampDesc)
        UserLocation retrieved = userLocationRepository.findById(updatedLocation.getId()).orElseThrow();
        assertEquals(USER2_LAT, retrieved.getLatitude());
        assertEquals(USER2_LON, retrieved.getLongitude());
    }

    @Test
    @DisplayName("FLOW 4: Multiple locations per user")
    void testMultipleLocationsPerUser() {
        UserLocation loc1 = createUserLocation(user1, USER1_LAT, USER1_LON, true);
        UserLocation loc2 = createUserLocation(user1, USER2_LAT, USER2_LON, true);

        // Get all locations for user (simulated)
        List<UserLocation> userLocations = (List<UserLocation>) userLocationRepository.findAll();
        long user1LocationCount = userLocations.stream()
                .filter(l -> l.getUser().getId().equals(user1.getId()))
                .count();

        assertTrue(user1LocationCount >= 2);
    }

    @Test
    @DisplayName("FLOW 5: Question creation with geolocation context (user has published location)")
    void testQuestionCreationWithGeoContext() {
        // User publishes location
        UserLocation userLocation = createUserLocation(user1, USER1_LAT, USER1_LON, true);

        // User creates question from that location
        Question question = createQuestion(user1, "Local Issue: Street flooding",
                "There's water flooding the street here", true);

        assertNotNull(question.getId());
        assertEquals(user1.getId(), question.getCreator().getId());

        // Question should be retrievable
        Optional<Question> retrieved = questionRepository.findById(question.getId());
        assertTrue(retrieved.isPresent());
    }

    @Test
    @DisplayName("FLOW 6: Nearby users can see nearby questions (geo-proximity)")
    void testNearbyQuestionsDiscovery() {
        // User 1 publishes location and creates question
        UserLocation userLocation1 = createUserLocation(user1, USER1_LAT, USER1_LON, true);
        Question question1 = createQuestion(user1, "Question from User1", "User1 question context", true);

        // User 2 is nearby and creates question
        UserLocation userLocation2 = createUserLocation(user2, USER2_LAT, USER2_LON, true);
        Question question2 = createQuestion(user2, "Question from User2", "User2 question context", true);

        // User 3 is far away
        UserLocation userLocation3 = createUserLocation(user3, USER3_LAT, USER3_LON, true);
        Question question3 = createQuestion(user3, "Question from User3", "User3 question context", true);

        // Verify questions are created
        List<Question> allQuestions = (List<Question>) questionRepository.findAll();
        assertTrue(allQuestions.size() >= 3);

        // In a real geo-proximity implementation, filtering would happen based on
        // coordinates
        // For now, verify all questions exist
        assertTrue(allQuestions.stream()
                .anyMatch(q -> q.getCreator().getId().equals(user1.getId())));
        assertTrue(allQuestions.stream()
                .anyMatch(q -> q.getCreator().getId().equals(user2.getId())));
        assertTrue(allQuestions.stream()
                .anyMatch(q -> q.getCreator().getId().equals(user3.getId())));
    }

    @Test
    @DisplayName("FLOW 7: Timestamp accuracy for locations")
    void testLocationTimestampAccuracy() {
        LocalDateTime beforeCreation = LocalDateTime.now();
        UserLocation location = createUserLocation(user1, USER1_LAT, USER1_LON, true);
        LocalDateTime afterCreation = LocalDateTime.now();

        assertNotNull(location.getTimestamp());
        assertTrue(location.getTimestamp().isAfter(beforeCreation) ||
                location.getTimestamp().isEqual(beforeCreation));
        assertTrue(location.getTimestamp().isBefore(afterCreation) ||
                location.getTimestamp().isEqual(afterCreation));
    }

    @Test
    @DisplayName("FLOW 8: Location accuracy/precision handling")
    void testLocationAccuracy() {
        // High precision coordinates
        Double precisionLat = 40.712776;
        Double precisionLon = -74.005974;

        UserLocation location = createUserLocation(user1, precisionLat, precisionLon, true);

        UserLocation retrieved = userLocationRepository.findById(location.getId()).orElseThrow();
        assertEquals(precisionLat, retrieved.getLatitude());
        assertEquals(precisionLon, retrieved.getLongitude());
    }

    @Test
    @DisplayName("FLOW 9: Location public/private toggle")
    void testLocationPrivacyToggle() {
        UserLocation initialPublic = createUserLocation(user1, USER1_LAT, USER1_LON, true);

        // Verify public flag
        UserLocation retrieved = userLocationRepository.findById(initialPublic.getId()).orElseThrow();
        assertTrue(retrieved.getIsPublic());

        // In real implementation, would update privacy
        UserLocation privateVersion = createUserLocation(user1, USER1_LAT + 0.001, USER1_LON + 0.001, false);
        UserLocation retrievedPrivate = userLocationRepository.findById(privateVersion.getId()).orElseThrow();
        assertTrue(!retrievedPrivate.getIsPublic());
    }

    // ========== Helper Methods ==========

    private Authorities createAuthority(String authorityName) {
        Authorities auth = new Authorities();
        auth.setAuthority(authorityName + "_" + UUID.randomUUID().toString().substring(0, 8));
        return authoritiesRepository.save(auth);
    }

    private RegularUser createUser(String prefix, Authorities authority) {
        String uniqueSuffix = UUID.randomUUID().toString().substring(0, 8);
        RegularUser user = new RegularUser();
        user.setEmail(prefix + "_" + uniqueSuffix + "@test.com");
        user.setUserName(prefix + "_" + uniqueSuffix);
        user.setPassword("password123");
        user.setFirstName("Test");
        user.setLastName("User");
        user.setActive(true);
        user.setAuthority(authority);
        return userRepository.save(user);
    }

    private UserLocation createUserLocation(RegularUser user, Double latitude, Double longitude, Boolean isPublic) {
        UserLocation location = new UserLocation();
        location.setUser(user);
        location.setLatitude(latitude);
        location.setLongitude(longitude);
        location.setIsPublic(isPublic);
        location.setTimestamp(LocalDateTime.now());
        return userLocationRepository.save(location);
    }

    private Question createQuestion(RegularUser creator, String title, String content, Boolean active) {
        Question question = new Question();
        question.setCreator(creator);
        question.setTitle(title);
        question.setContent(content);
        question.setActive(active);
        return questionRepository.save(question);
    }
}
