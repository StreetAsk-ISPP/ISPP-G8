package com.streetask.app.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.streetask.app.model.UserLocation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test cases for UserLocationRestController
 */
@WebMvcTest(UserLocationRestController.class)
@DisplayName("UserLocationRestController Tests")
class UserLocationRestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserLocationService locationService;

    @MockBean
    private UserService userService;

    private User user;
    private UserLocationDTO locationDTO;
    private UserLocation userLocation;
    private LocalDateTime now;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1);
        user.setUsername("testuser");

        now = LocalDateTime.now();

        locationDTO = new UserLocationDTO();
        locationDTO.setLatitude(40.4168);
        locationDTO.setLongitude(-3.7038);
        locationDTO.setAccuracy(5.0f);
        locationDTO.setIsPublic(true);

        userLocation = new UserLocation();
        userLocation.setId(1);
        userLocation.setUser(user);
        userLocation.setLatitude(40.4168);
        userLocation.setLongitude(-3.7038);
        userLocation.setAccuracy(5.0f);
        userLocation.setTimestamp(now);
        userLocation.setIsPublic(true);
    }

    @Test
    @DisplayName("Should publish location without authentication")
    @WithMockUser(username = "testuser")
    void testPublishLocation() throws Exception {
        when(userService.findCurrentUser()).thenReturn(user);
        when(locationService.saveUserLocation(any(User.class), any(UserLocationDTO.class)))
                .thenReturn(userLocation);

        mockMvc.perform(post("/api/v1/locations/publish")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(locationDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.latitude").value(40.4168))
                .andExpect(jsonPath("$.longitude").value(-3.7038))
                .andExpect(jsonPath("$.accuracy").value(5.0))
                .andExpect(jsonPath("$.isPublic").value(true));

        verify(userService, times(1)).findCurrentUser();
        verify(locationService, times(1)).saveUserLocation(any(User.class), any(UserLocationDTO.class));
    }

    @Test
    @DisplayName("Should return 201 Created when publishing location")
    @WithMockUser(username = "testuser")
    void testPublishLocation_ReturnsCreated() throws Exception {
        when(userService.findCurrentUser()).thenReturn(user);
        when(locationService.saveUserLocation(any(User.class), any(UserLocationDTO.class)))
                .thenReturn(userLocation);

        mockMvc.perform(post("/api/v1/locations/publish")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(locationDTO)))
                .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("Should get my location")
    @WithMockUser(username = "testuser")
    void testGetMyLocation() throws Exception {
        when(userService.findCurrentUser()).thenReturn(user);
        when(locationService.getUserLatestLocation(user.getId()))
                .thenReturn(Optional.of(userLocation));

        mockMvc.perform(get("/api/v1/locations/me")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.latitude").value(40.4168))
                .andExpect(jsonPath("$.longitude").value(-3.7038));

        verify(userService, times(1)).findCurrentUser();
        verify(locationService, times(1)).getUserLatestLocation(user.getId());
    }

    @Test
    @DisplayName("Should return 404 when user has no location")
    @WithMockUser(username = "testuser")
    void testGetMyLocation_NotFound() throws Exception {
        when(userService.findCurrentUser()).thenReturn(user);
        when(locationService.getUserLatestLocation(user.getId()))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/locations/me")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should get public locations")
    @WithMockUser(username = "testuser", roles = "USER")
    void testGetPublicLocations() throws Exception {
        List<UserLocation> locations = Arrays.asList(userLocation);
        when(locationService.getPublicLocations()).thenReturn(locations);

        mockMvc.perform(get("/api/v1/locations/public")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].latitude").value(40.4168));

        verify(locationService, times(1)).getPublicLocations();
    }

    @Test
    @DisplayName("Should get public locations since parameter")
    @WithMockUser(username = "testuser", roles = "USER")
    void testGetPublicLocationsSince() throws Exception {
        List<UserLocation> locations = Arrays.asList(userLocation);
        when(locationService.getPublicLocationsSince(10))
                .thenReturn(locations);

        mockMvc.perform(get("/api/v1/locations/public/since")
                .param("minutesSince", "10")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));

        verify(locationService, times(1)).getPublicLocationsSince(10);
    }

    @Test
    @DisplayName("Should use default value of 10 minutes for minutesSince")
    @WithMockUser(username = "testuser", roles = "USER")
    void testGetPublicLocationsSince_DefaultValue() throws Exception {
        List<UserLocation> locations = Arrays.asList(userLocation);
        when(locationService.getPublicLocationsSince(10))
                .thenReturn(locations);

        mockMvc.perform(get("/api/v1/locations/public/since")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(locationService, times(1)).getPublicLocationsSince(10);
    }

    @Test
    @DisplayName("Should get user location by userId")
    @WithMockUser(username = "testuser")
    void testGetUserLocation() throws Exception {
        when(locationService.getUserLatestPublicLocation(2))
                .thenReturn(Optional.of(userLocation));

        mockMvc.perform(get("/api/v1/locations/user/2")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));

        verify(locationService, times(1)).getUserLatestPublicLocation(2);
    }

    @Test
    @DisplayName("Should return 404 when user location not found")
    @WithMockUser(username = "testuser")
    void testGetUserLocation_NotFound() throws Exception {
        when(locationService.getUserLatestPublicLocation(999))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/locations/user/999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should toggle privacy")
    @WithMockUser(username = "testuser")
    void testTogglePrivacy() throws Exception {
        userLocation.setIsPublic(false);
        when(userService.findCurrentUser()).thenReturn(user);
        when(locationService.toggleLocationPrivacy(user.getId()))
                .thenReturn(userLocation);

        mockMvc.perform(put("/api/v1/locations/toggle-privacy")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.isPublic").value(false));

        verify(userService, times(1)).findCurrentUser();
        verify(locationService, times(1)).toggleLocationPrivacy(user.getId());
    }

    @Test
    @DisplayName("Should delete location")
    @WithMockUser(username = "testuser")
    void testDeleteMyLocation() throws Exception {
        when(userService.findCurrentUser()).thenReturn(user);

        mockMvc.perform(delete("/api/v1/locations/me")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Location deleted!"));

        verify(userService, times(1)).findCurrentUser();
        verify(locationService, times(1)).deleteUserLocation(user.getId());
    }

    @Test
    @DisplayName("Should require authentication for publish endpoint")
    void testPublishLocation_RequiresAuth() throws Exception {
        mockMvc.perform(post("/api/v1/locations/publish")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(locationDTO)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should require authentication for get my location")
    void testGetMyLocation_RequiresAuth() throws Exception {
        mockMvc.perform(get("/api/v1/locations/me")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should require authentication for toggle privacy")
    void testTogglePrivacy_RequiresAuth() throws Exception {
        mockMvc.perform(put("/api/v1/locations/toggle-privacy")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should require authentication for delete location")
    void testDeleteMyLocation_RequiresAuth() throws Exception {
        mockMvc.perform(delete("/api/v1/locations/me")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should allow public access to get public locations")
    @WithMockUser(username = "testuser", roles = "USER")
    void testGetPublicLocations_PublicAccess() throws Exception {
        when(locationService.getPublicLocations()).thenReturn(Arrays.asList());

        mockMvc.perform(get("/api/v1/locations/public")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should allow public access to get public locations since")
    @WithMockUser(username = "testuser", roles = "USER")
    void testGetPublicLocationsSince_PublicAccess() throws Exception {
        when(locationService.getPublicLocationsSince(10)).thenReturn(Arrays.asList());

        mockMvc.perform(get("/api/v1/locations/public/since")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should return empty list for public locations")
    @WithMockUser(username = "testuser", roles = "USER")
    void testGetPublicLocations_Empty() throws Exception {
        when(locationService.getPublicLocations()).thenReturn(Arrays.asList());

        mockMvc.perform(get("/api/v1/locations/public")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @DisplayName("Should handle multiple public locations")
    @WithMockUser(username = "testuser", roles = "USER")
    void testGetPublicLocations_Multiple() throws Exception {
        UserLocation location2 = new UserLocation();
        location2.setId(2);
        location2.setLatitude(51.5074);
        location2.setLongitude(-0.1278);

        List<UserLocation> locations = Arrays.asList(userLocation, location2);
        when(locationService.getPublicLocations()).thenReturn(locations);

        mockMvc.perform(get("/api/v1/locations/public")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[1].id").value(2));
    }
}
