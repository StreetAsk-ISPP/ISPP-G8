package com.streetask.app.user;

import com.streetask.app.answer.AnswerRepository;
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
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserService Unit Tests")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AnswerRepository answerRepository;

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

    // ===================== TESTS ORIGINALES =====================

    @Test
    @DisplayName("saveUser should persist user successfully")
    void saveUser_shouldPersistSuccessfully() {
        User userToSave = createTestUser(UUID.randomUUID(), "newuser@example.com", "newuser");
        when(userRepository.save(any(User.class))).thenReturn(userToSave);

        User savedUser = userService.saveUser(userToSave);

        assertNotNull(savedUser);
        assertEquals(userToSave.getEmail(), savedUser.getEmail());
        assertEquals(userToSave.getUserName(), savedUser.getUserName());
        verify(userRepository).save(userToSave);
    }

    @Test
    void findUserByEmail_shouldReturnUserWhenFound() {
        when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(testUser));

        User foundUser = userService.findUser(TEST_EMAIL);

        assertNotNull(foundUser);
        assertEquals(TEST_EMAIL, foundUser.getEmail());
        verify(userRepository).findByEmail(TEST_EMAIL);
    }

    @Test
    void findUserById_shouldReturnUserWhenFound() {
        when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));

        User foundUser = userService.findUser(testUserId);

        assertNotNull(foundUser);
        assertEquals(testUserId, foundUser.getId());
        verify(userRepository).findById(testUserId);
    }

    @Test
    void findAll_shouldReturnAllUsers() {
        List<User> users = new ArrayList<>();
        users.add(testUser);
        users.add(createTestUser(UUID.randomUUID(), "user2@example.com", "user2"));

        when(userRepository.findAll()).thenReturn(users);

        Iterable<User> result = userService.findAll();

        assertNotNull(result);
        verify(userRepository).findAll();
    }

    // ===================== TESTS DE REPUTACIÓN (TRUNK) =====================

    @Test
    void findUserById_shouldIncludeReputation() {
        UUID userId = UUID.randomUUID();
        User user = new User();
        user.setId(userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(answerRepository.aggregateVotesByUserIds(anyCollection())).thenReturn(
                Collections.singletonList(new Object[]{userId, 6L, 0L})
        );

        User result = userService.findUser(userId);

        assertEquals(12, result.getReputation());
        verify(answerRepository).aggregateVotesByUserIds(anyCollection());
    }

    @Test
    void findAll_shouldIncludeReputationForEveryUser() {
        UUID firstId = UUID.randomUUID();
        UUID secondId = UUID.randomUUID();

        User first = new User();
        first.setId(firstId);

        User second = new User();
        second.setId(secondId);

        List<User> users = Arrays.asList(first, second);

        when(userRepository.findAll()).thenReturn(users);
        when(answerRepository.aggregateVotesByUserIds(anyCollection())).thenReturn(Arrays.asList(
                new Object[]{firstId, 3L, 1L},
                new Object[]{secondId, 0L, 2L}
        ));

        Iterable<User> result = userService.findAll();

        User[] resultArray = ((List<User>) result).toArray(new User[0]);
        assertEquals(5, resultArray[0].getReputation());
        assertEquals(-2, resultArray[1].getReputation());

        verify(answerRepository).aggregateVotesByUserIds(anyCollection());
    }

    // ===================== HELPERS =====================

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