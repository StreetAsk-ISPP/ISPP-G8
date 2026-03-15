package com.streetask.app.user;

import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.streetask.app.exceptions.ResourceNotFoundException;

@SpringBootTest
@AutoConfigureMockMvc
class UserRestControllerReputationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private AuthoritiesService authService;

    @Test
    @WithMockUser(username = "user1@streetask.com", authorities = { "USER" })
    void findCurrentUserReputation_shouldReturnScalarReputationWithStatusOk() throws Exception {
        User currentUser = new User();
        currentUser.setId(UUID.randomUUID());
        currentUser.setReputation(14);

        when(userService.findCurrentUser()).thenReturn(currentUser);

        mockMvc.perform(get("/api/v1/users/me/reputation"))
                .andExpect(status().isOk())
                .andExpect(content().string("14"));
    }

    @Test
    void findCurrentUserReputation_whenUnauthenticated_shouldReturnUnauthorized() throws Exception {
        mockMvc.perform(get("/api/v1/users/me/reputation"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "user1@streetask.com", authorities = { "USER" })
    void findReputationById_whenOwner_shouldReturnOwnReputation() throws Exception {
        UUID userId = UUID.randomUUID();

        User currentUser = new User();
        currentUser.setId(userId);
        currentUser.setReputation(9);

        Authorities userAuthority = new Authorities();
        userAuthority.setAuthority("USER");
        currentUser.setAuthority(userAuthority);

        when(userService.findCurrentUser()).thenReturn(currentUser);

        mockMvc.perform(get("/api/v1/users/{id}/reputation", userId))
                .andExpect(status().isOk())
                .andExpect(content().string("9"));

        verify(userService, never()).findUser(userId);
    }

    @Test
    @WithMockUser(username = "admin1@streetask.com", authorities = { "ADMIN" })
    void findReputationById_whenAdmin_shouldReturnRequestedUserReputation() throws Exception {
        UUID requestedUserId = UUID.randomUUID();

        User currentUser = new User();
        currentUser.setId(UUID.randomUUID());

        Authorities adminAuthority = new Authorities();
        adminAuthority.setAuthority("ADMIN");
        currentUser.setAuthority(adminAuthority);

        User requestedUser = new User();
        requestedUser.setId(requestedUserId);
        requestedUser.setReputation(22);

        when(userService.findCurrentUser()).thenReturn(currentUser);
        when(userService.findUser(requestedUserId)).thenReturn(requestedUser);

        mockMvc.perform(get("/api/v1/users/{id}/reputation", requestedUserId))
                .andExpect(status().isOk())
                .andExpect(content().string("22"));
    }

    @Test
    @WithMockUser(username = "user2@streetask.com", authorities = { "USER" })
    void findReputationById_whenNotOwnerAndNotAdmin_shouldReturnForbidden() throws Exception {
        UUID requestedUserId = UUID.randomUUID();

        User currentUser = new User();
        currentUser.setId(UUID.randomUUID());

        Authorities userAuthority = new Authorities();
        userAuthority.setAuthority("USER");
        currentUser.setAuthority(userAuthority);

        when(userService.findCurrentUser()).thenReturn(currentUser);

        mockMvc.perform(get("/api/v1/users/{id}/reputation", requestedUserId))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin1@streetask.com", authorities = { "ADMIN" })
    void findReputationById_whenRequestedUserDoesNotExist_shouldReturnNotFound() throws Exception {
        UUID requestedUserId = UUID.randomUUID();

        User currentUser = new User();
        currentUser.setId(UUID.randomUUID());

        Authorities adminAuthority = new Authorities();
        adminAuthority.setAuthority("ADMIN");
        currentUser.setAuthority(adminAuthority);

        when(userService.findCurrentUser()).thenReturn(currentUser);
        when(userService.findUser(requestedUserId))
                .thenThrow(new ResourceNotFoundException("User", "id", requestedUserId));

        mockMvc.perform(get("/api/v1/users/{id}/reputation", requestedUserId))
                .andExpect(status().isNotFound());
    }

}
