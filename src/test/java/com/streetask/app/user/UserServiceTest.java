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

    // ================= SAVE USER =================

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
    @DisplayName("saveUser should throw DataAccessException on database failure")
    void saveUser_shouldThrowDataAccessExceptionOnDatabaseFailure() {
        User userToSave = createTestUser(UUID.randomUUID(), "newuser@example.com", "newuser");

        when(userRepository.save(any(User.class)))
                .thenThrow(new DataAccessException("DB Error") {});

        assertThrows(DataAccessException.class, () -> userService.saveUser(userToSave));
        verify(userRepository).save(userToSave);
    }

    // ================= FIND USER =================

    @Test
    @DisplayName("findUser by email should return user when found")
    void findUserByEmail_shouldReturnUserWhenFound() {
        when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(testUser));

        User foundUser = userService.findUser(TEST_EMAIL);

        assertNotNull(foundUser);
        assertEquals(TEST_EMAIL, foundUser.getEmail());
        assertEquals(testUserId, foundUser.getId());
        verify(userRepository).findByEmail(TEST_EMAIL);
    }

    @Test
    @DisplayName("findUser by email should throw ResourceNotFoundException when not found")
    void findUserByEmail_shouldThrowResourceNotFoundExceptionWhenNotFound() {
        when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> userService.findUser("notfound@example.com"));
    }

    @Test
    @DisplayName("findUser by id should return user when found")
    void findUserById_shouldReturnUserWhenFound() {
        when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));

        User foundUser = userService.findUser(testUserId);

        assertNotNull(foundUser);
        assertEquals(testUserId, foundUser.getId());
    }

    @Test
    @DisplayName("findUser by id should throw ResourceNotFoundException when not found")
    void findUserById_shouldThrowResourceNotFoundExceptionWhenNotFound() {
        UUID nonExistentId = UUID.randomUUID();
        when(userRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> userService.findUser(nonExistentId));
    }

    // ================= CURRENT USER =================

    @Test
    @DisplayName("findCurrentUser should return authenticated user")
    void findCurrentUser_shouldReturnAuthenticatedUserWhenPresent() {

        setupSecurityContext(TEST_EMAIL);
        when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(testUser));

        User currentUser = userService.findCurrentUser();

        assertNotNull(currentUser);
        assertEquals(TEST_EMAIL, currentUser.getEmail());
    }

    // ================= EXISTS =================

    @Test
    void existsUser_shouldReturnTrueWhenUserExistsByEmail() {
        when(userRepository.existsByEmail(TEST_EMAIL)).thenReturn(true);

        assertTrue(userService.existsUser(TEST_EMAIL));
    }

    @Test
    void existsByUserName_shouldReturnTrueWhenUserExistsByUsername() {
        when(userRepository.existsByUserName(TEST_USERNAME)).thenReturn(true);

        assertTrue(userService.existsByUserName(TEST_USERNAME));
    }

    // ================= FIND ALL =================

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

    // ================= UPDATE =================

    @Test
    void updateUser_shouldPreserveOriginalIdWhenUpdatingUser() {

        User update = createTestUser(UUID.randomUUID(),"new@mail.com","newuser");

        when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any())).thenReturn(testUser);

        User updated = userService.updateUser(update,testUserId);

        assertEquals(testUserId,updated.getId());
    }

    // ================= DELETE =================

    @Test
    void deleteUser_shouldSuccessfullyDeleteUserWhenFound() {

        when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));
        doNothing().when(userRepository).delete(testUser);

        userService.deleteUser(testUserId);

        verify(userRepository).delete(testUser);
    }

    // ================= REPUTATION TESTS (TRUNK) =================

    @Test
    void findUserById_shouldIncludeReputation() {

        UUID userId = UUID.randomUUID();
        User user = new User();
        user.setId(userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        when(answerRepository.aggregateVotesByUserIds(anyCollection()))
                .thenReturn(Collections.singletonList(
                        new Object[]{userId,6L,0L}));

        User result = userService.findUser(userId);

        assertEquals(12,result.getReputation());
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

        List<User> users = Arrays.asList(first,second);

        when(userRepository.findAll()).thenReturn(users);

        when(answerRepository.aggregateVotesByUserIds(anyCollection()))
                .thenReturn(Arrays.asList(
                        new Object[]{firstId,3L,1L},
                        new Object[]{secondId,0L,2L}));

        Iterable<User> result = userService.findAll();

        User[] arr=((List<User>)result).toArray(new User[0]);

        assertEquals(5,arr[0].getReputation());
        assertEquals(-2,arr[1].getReputation());
    }

    // ================= HELPERS =================

    private User createTestUser(UUID id,String email,String userName){

        User user=new User();
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

    private void setupSecurityContext(String email){

        SecurityContext context=SecurityContextHolder.createEmptyContext();

        Authentication auth=mock(Authentication.class);
        when(auth.getName()).thenReturn(email);

        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);
    }
}