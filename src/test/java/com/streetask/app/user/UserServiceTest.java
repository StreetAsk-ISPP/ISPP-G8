package com.streetask.app.user;

import com.streetask.app.exceptions.ResourceNotFoundException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataAccessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserService Unit Tests")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private UUID testUserId;
    private static final String TEST_EMAIL = "test@example.com";
    private static final String TEST_USERNAME = "testuser";
    private static final String TEST_FIRST_NAME = "Test";
    private static final String TEST_LAST_NAME = "User";

    @BeforeEach
    void setUp() {
        testUserId = UUID.randomUUID();
        testUser = createTestUser(testUserId, TEST_EMAIL, TEST_USERNAME);
        SecurityContextHolder.clearContext();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    // =============== SAVE USER TESTS ===============

    @Test
    @DisplayName("saveUser should persist user successfully")
    void saveUser_shouldPersistSuccessfully() {
        User userToSave = createTestUser(UUID.randomUUID(), "newuser@example.com", "newuser");
        when(userRepository.save(any(User.class))).thenReturn(userToSave);

        User savedUser = userService.saveUser(userToSave);

        assertNotNull(savedUser);
        assertEquals(userToSave.getEmail(), savedUser.getEmail());
        assertEquals(userToSave.getUserName(), savedUser.getUserName());
        verify(userRepository, times(1)).save(userToSave);
    }

    @Test
    @DisplayName("saveUser should throw DataAccessException on database failure")
    void saveUser_shouldThrowDataAccessExceptionOnDatabaseFailure() {
        User userToSave = createTestUser(UUID.randomUUID(), "newuser@example.com", "newuser");
        when(userRepository.save(any(User.class)))
                .thenThrow(new org.springframework.dao.DataAccessException("DB Error") {
                });

        assertThrows(DataAccessException.class, () -> userService.saveUser(userToSave));
        verify(userRepository, times(1)).save(userToSave);
    }

    // =============== FIND USER BY EMAIL TESTS ===============

    @Test
    @DisplayName("findUser by email should return user when found")
    void findUserByEmail_shouldReturnUserWhenFound() {
        when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(testUser));

        User foundUser = userService.findUser(TEST_EMAIL);

        assertNotNull(foundUser);
        assertEquals(TEST_EMAIL, foundUser.getEmail());
        assertEquals(testUserId, foundUser.getId());
        verify(userRepository, times(1)).findByEmail(TEST_EMAIL);
    }

    @Test
    @DisplayName("findUser by email should throw ResourceNotFoundException when not found")
    void findUserByEmail_shouldThrowResourceNotFoundExceptionWhenNotFound() {
        String nonExistentEmail = "notfound@example.com";
        when(userRepository.findByEmail(nonExistentEmail)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.findUser(nonExistentEmail));
        verify(userRepository, times(1)).findByEmail(nonExistentEmail);
    }

    // =============== FIND USER BY ID TESTS ===============

    @Test
    @DisplayName("findUser by id should return user when found")
    void findUserById_shouldReturnUserWhenFound() {
        when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));

        User foundUser = userService.findUser(testUserId);

        assertNotNull(foundUser);
        assertEquals(testUserId, foundUser.getId());
        assertEquals(TEST_EMAIL, foundUser.getEmail());
        verify(userRepository, times(1)).findById(testUserId);
    }

    @Test
    @DisplayName("findUser by id should throw ResourceNotFoundException when not found")
    void findUserById_shouldThrowResourceNotFoundExceptionWhenNotFound() {
        UUID nonExistentId = UUID.randomUUID();
        when(userRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.findUser(nonExistentId));
        verify(userRepository, times(1)).findById(nonExistentId);
    }

    // =============== FIND CURRENT USER TESTS ===============

    @Test
    @DisplayName("findCurrentUser should return authenticated user when present")
    void findCurrentUser_shouldReturnAuthenticatedUserWhenPresent() {
        setupSecurityContext(TEST_EMAIL);
        when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(testUser));

        User currentUser = userService.findCurrentUser();

        assertNotNull(currentUser);
        assertEquals(TEST_EMAIL, currentUser.getEmail());
        assertEquals(testUserId, currentUser.getId());
        verify(userRepository, times(1)).findByEmail(TEST_EMAIL);
    }

    @Test
    @DisplayName("findCurrentUser should throw ResourceNotFoundException when authentication is missing")
    void findCurrentUser_shouldThrowResourceNotFoundExceptionWhenAuthenticationMissing() {
        SecurityContextHolder.setContext(SecurityContextHolder.createEmptyContext());

        assertThrows(ResourceNotFoundException.class, () -> userService.findCurrentUser());
        verify(userRepository, never()).findByEmail(anyString());
    }

    @Test
    @DisplayName("findCurrentUser should throw ResourceNotFoundException when authenticated email not found in database")
    void findCurrentUser_shouldThrowResourceNotFoundExceptionWhenAuthenticatedEmailNotFound() {
        setupSecurityContext(TEST_EMAIL);
        when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.findCurrentUser());
        verify(userRepository, times(1)).findByEmail(TEST_EMAIL);
    }

    // =============== EXISTS USER TESTS ===============

    @Test
    @DisplayName("existsUser should return true when user exists by email")
    void existsUser_shouldReturnTrueWhenUserExistsByEmail() {
        when(userRepository.existsByEmail(TEST_EMAIL)).thenReturn(true);

        Boolean exists = userService.existsUser(TEST_EMAIL);

        assertTrue(exists);
        verify(userRepository, times(1)).existsByEmail(TEST_EMAIL);
    }

    @Test
    @DisplayName("existsUser should return false when user does not exist by email")
    void existsUser_shouldReturnFalseWhenUserDoesNotExistByEmail() {
        when(userRepository.existsByEmail(TEST_EMAIL)).thenReturn(false);

        Boolean exists = userService.existsUser(TEST_EMAIL);

        assertFalse(exists);
        verify(userRepository, times(1)).existsByEmail(TEST_EMAIL);
    }

    // =============== EXISTS BY USERNAME TESTS ===============

    @Test
    @DisplayName("existsByUserName should return true when user exists by username")
    void existsByUserName_shouldReturnTrueWhenUserExistsByUsername() {
        when(userRepository.existsByUserName(TEST_USERNAME)).thenReturn(true);

        Boolean exists = userService.existsByUserName(TEST_USERNAME);

        assertTrue(exists);
        verify(userRepository, times(1)).existsByUserName(TEST_USERNAME);
    }

    @Test
    @DisplayName("existsByUserName should return false when user does not exist by username")
    void existsByUserName_shouldReturnFalseWhenUserDoesNotExistByUsername() {
        when(userRepository.existsByUserName(TEST_USERNAME)).thenReturn(false);

        Boolean exists = userService.existsByUserName(TEST_USERNAME);

        assertFalse(exists);
        verify(userRepository, times(1)).existsByUserName(TEST_USERNAME);
    }

    // =============== FIND ALL TESTS ===============

    @Test
    @DisplayName("findAll should return all users")
    void findAll_shouldReturnAllUsers() {
        List<User> users = new ArrayList<>();
        users.add(testUser);
        users.add(createTestUser(UUID.randomUUID(), "user2@example.com", "user2"));
        users.add(createTestUser(UUID.randomUUID(), "user3@example.com", "user3"));

        when(userRepository.findAll()).thenReturn(users);

        Iterable<User> foundUsers = userService.findAll();

        assertNotNull(foundUsers);
        List<User> userList = new ArrayList<>();
        foundUsers.forEach(userList::add);
        assertEquals(3, userList.size());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("findAll should return empty iterable when no users exist")
    void findAll_shouldReturnEmptyIterableWhenNoUsersExist() {
        when(userRepository.findAll()).thenReturn(new ArrayList<>());

        Iterable<User> foundUsers = userService.findAll();

        assertNotNull(foundUsers);
        List<User> userList = new ArrayList<>();
        foundUsers.forEach(userList::add);
        assertTrue(userList.isEmpty());
        verify(userRepository, times(1)).findAll();
    }

    // =============== FIND ALL BY AUTHORITY TESTS ===============

    @Test
    @DisplayName("findAllByAuthority should return users with specific authority")
    void findAllByAuthority_shouldReturnUsersWithSpecificAuthority() {
        String authority = "ADMIN";
        User admin1 = createTestUser(UUID.randomUUID(), "admin1@example.com", "admin1");
        User admin2 = createTestUser(UUID.randomUUID(), "admin2@example.com", "admin2");
        List<User> adminUsers = List.of(admin1, admin2);

        when(userRepository.findAllByAuthority(authority)).thenReturn(adminUsers);

        Iterable<User> foundUsers = userService.findAllByAuthority(authority);

        assertNotNull(foundUsers);
        List<User> userList = new ArrayList<>();
        foundUsers.forEach(userList::add);
        assertEquals(2, userList.size());
        verify(userRepository, times(1)).findAllByAuthority(authority);
    }

    @Test
    @DisplayName("findAllByAuthority should return empty iterable when no users with authority exist")
    void findAllByAuthority_shouldReturnEmptyIterableWhenNoUsersWithAuthorityExist() {
        String authority = "NONEXISTENT";
        when(userRepository.findAllByAuthority(authority)).thenReturn(new ArrayList<>());

        Iterable<User> foundUsers = userService.findAllByAuthority(authority);

        assertNotNull(foundUsers);
        List<User> userList = new ArrayList<>();
        foundUsers.forEach(userList::add);
        assertTrue(userList.isEmpty());
        verify(userRepository, times(1)).findAllByAuthority(authority);
    }

    // =============== UPDATE USER TESTS ===============

    @Test
    @DisplayName("updateUser should preserve original id when updating user")
    void updateUser_shouldPreserveOriginalIdWhenUpdatingUser() {
        UUID userIdToUpdate = testUserId;
        User userToUpdate = createTestUser(UUID.randomUUID(), "newmail@example.com", "newusername");
        userToUpdate.setFirstName("UpdatedFirst");
        userToUpdate.setLastName("UpdatedLast");

        when(userRepository.findById(userIdToUpdate)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        User updatedUser = userService.updateUser(userToUpdate, userIdToUpdate);

        assertNotNull(updatedUser);
        assertEquals(userIdToUpdate, updatedUser.getId());
        // Verify properties were updated
        assertEquals("UpdatedFirst", updatedUser.getFirstName());
        assertEquals("UpdatedLast", updatedUser.getLastName());
        verify(userRepository, times(1)).findById(userIdToUpdate);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("updateUser should not change id during update")
    void updateUser_shouldNotChangeIdDuringUpdate() {
        UUID userIdToUpdate = testUserId;
        UUID differentId = UUID.randomUUID();
        User userWithDifferentId = createTestUser(differentId, "new@example.com", "newuser");

        when(userRepository.findById(userIdToUpdate)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            return savedUser;
        });

        User updatedUser = userService.updateUser(userWithDifferentId, userIdToUpdate);

        assertEquals(userIdToUpdate, updatedUser.getId());
        assertNotEquals(differentId, updatedUser.getId());
        verify(userRepository, times(1)).findById(userIdToUpdate);
    }

    @Test
    @DisplayName("updateUser should throw ResourceNotFoundException when user to update not found")
    void updateUser_shouldThrowResourceNotFoundExceptionWhenUserToUpdateNotFound() {
        UUID nonExistentId = UUID.randomUUID();
        User userToUpdate = createTestUser(UUID.randomUUID(), "new@example.com", "newuser");
        when(userRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.updateUser(userToUpdate, nonExistentId));
        verify(userRepository, times(1)).findById(nonExistentId);
        verify(userRepository, never()).save(any(User.class));
    }

    // =============== DELETE USER TESTS ===============

    @Test
    @DisplayName("deleteUser should successfully delete user when found")
    void deleteUser_shouldSuccessfullyDeleteUserWhenFound() {
        when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));
        doNothing().when(userRepository).delete(testUser);

        userService.deleteUser(testUserId);

        verify(userRepository, times(1)).findById(testUserId);
        verify(userRepository, times(1)).delete(testUser);
    }

    @Test
    @DisplayName("deleteUser should throw ResourceNotFoundException when user not found")
    void deleteUser_shouldThrowResourceNotFoundExceptionWhenUserNotFound() {
        UUID nonExistentId = UUID.randomUUID();
        when(userRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.deleteUser(nonExistentId));
        verify(userRepository, times(1)).findById(nonExistentId);
        verify(userRepository, never()).delete(any(User.class));
    }

    @Test
    @DisplayName("deleteUser should throw exception on database delete failure")
    void deleteUser_shouldThrowExceptionOnDatabaseDeleteFailure() {
        when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));
        doThrow(new RuntimeException("Delete failed")).when(userRepository).delete(testUser);

        assertThrows(RuntimeException.class, () -> userService.deleteUser(testUserId));
        verify(userRepository, times(1)).findById(testUserId);
        verify(userRepository, times(1)).delete(testUser);
    }

    private User createTestUser(UUID id, String email, String userName) {
        User user = new User();
        user.setId(id);
        user.setEmail(email);
        user.setUserName(userName);
        user.setFirstName(TEST_FIRST_NAME);
        user.setLastName(TEST_LAST_NAME);
        user.setPassword("password123");
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        return user;
    }

    private void setupSecurityContext(String email) {
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn(email);
        securityContext.setAuthentication(authentication);
        SecurityContextHolder.setContext(securityContext);
    }
}
