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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthoritiesService Unit Tests")
class AuthoritiesServiceTest {

    @Mock
    private AuthoritiesRepository authoritiesRepository;

    @InjectMocks
    private AuthoritiesService authoritiesService;

    private Authorities testAuthority;
    private UUID testAuthorityId;
    private static final String ADMIN_ROLE = "ADMIN";
    private static final String USER_ROLE = "USER";

    @BeforeEach
    void setUp() {
        testAuthorityId = UUID.randomUUID();
        testAuthority = createTestAuthority(testAuthorityId, ADMIN_ROLE);
    }

    @AfterEach
    void tearDown() {
    }

    // =============== FIND BY AUTHORITY TESTS ===============

    @Test
    @DisplayName("findByAuthority should return authority when found")
    void findByAuthority_shouldReturnAuthorityWhenFound() {
        when(authoritiesRepository.findByName(ADMIN_ROLE)).thenReturn(Optional.of(testAuthority));

        Authorities foundAuthority = authoritiesService.findByAuthority(ADMIN_ROLE);

        assertNotNull(foundAuthority);
        assertEquals(ADMIN_ROLE, foundAuthority.getAuthority());
        assertEquals(testAuthorityId, foundAuthority.getId());
        verify(authoritiesRepository, times(1)).findByName(ADMIN_ROLE);
    }

    @Test
    @DisplayName("findByAuthority should throw ResourceNotFoundException when authority not found")
    void findByAuthority_shouldThrowResourceNotFoundExceptionWhenAuthorityNotFound() {
        String nonExistentAuthority = "NONEXISTENT";
        when(authoritiesRepository.findByName(nonExistentAuthority)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> authoritiesService.findByAuthority(nonExistentAuthority));
        verify(authoritiesRepository, times(1)).findByName(nonExistentAuthority);
    }

    @Test
    @DisplayName("findByAuthority should handle USER role successfully")
    void findByAuthority_shouldHandleUserRoleSuccessfully() {
        Authorities userAuthority = createTestAuthority(UUID.randomUUID(), USER_ROLE);
        when(authoritiesRepository.findByName(USER_ROLE)).thenReturn(Optional.of(userAuthority));

        Authorities foundAuthority = authoritiesService.findByAuthority(USER_ROLE);

        assertNotNull(foundAuthority);
        assertEquals(USER_ROLE, foundAuthority.getAuthority());
        verify(authoritiesRepository, times(1)).findByName(USER_ROLE);
    }

    @Test
    @DisplayName("findByAuthority should throw exception with original authority name")
    void findByAuthority_shouldThrowExceptionWithOriginalAuthorityName() {
        String testRole = "MODERATOR";
        when(authoritiesRepository.findByName(testRole)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> authoritiesService.findByAuthority(testRole));

        assertNotNull(exception);
        verify(authoritiesRepository, times(1)).findByName(testRole);
    }

    // =============== FIND ALL TESTS ===============

    @Test
    @DisplayName("findAll should return all authorities")
    void findAll_shouldReturnAllAuthorities() {
        List<Authorities> authorities = new ArrayList<>();
        authorities.add(testAuthority);
        authorities.add(createTestAuthority(UUID.randomUUID(), USER_ROLE));
        authorities.add(createTestAuthority(UUID.randomUUID(), "MODERATOR"));

        when(authoritiesRepository.findAll()).thenReturn(authorities);

        Iterable<Authorities> foundAuthorities = authoritiesService.findAll();

        assertNotNull(foundAuthorities);
        List<Authorities> authoritiesList = new ArrayList<>();
        foundAuthorities.forEach(authoritiesList::add);
        assertEquals(3, authoritiesList.size());
        verify(authoritiesRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("findAll should return empty iterable when no authorities exist")
    void findAll_shouldReturnEmptyIterableWhenNoAuthoritiesExist() {
        when(authoritiesRepository.findAll()).thenReturn(new ArrayList<>());

        Iterable<Authorities> foundAuthorities = authoritiesService.findAll();

        assertNotNull(foundAuthorities);
        List<Authorities> authoritiesList = new ArrayList<>();
        foundAuthorities.forEach(authoritiesList::add);
        assertTrue(authoritiesList.isEmpty());
        verify(authoritiesRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("findAll should return multiple authorities correctly")
    void findAll_shouldReturnMultipleAuthoritiesCorrectly() {
        Authorities admin = createTestAuthority(UUID.randomUUID(), ADMIN_ROLE);
        Authorities user = createTestAuthority(UUID.randomUUID(), USER_ROLE);
        Authorities moderator = createTestAuthority(UUID.randomUUID(), "MODERATOR");
        Authorities guest = createTestAuthority(UUID.randomUUID(), "GUEST");

        List<Authorities> authorities = List.of(admin, user, moderator, guest);
        when(authoritiesRepository.findAll()).thenReturn(authorities);

        Iterable<Authorities> foundAuthorities = authoritiesService.findAll();

        List<Authorities> authoritiesList = new ArrayList<>();
        foundAuthorities.forEach(authoritiesList::add);
        assertEquals(4, authoritiesList.size());
        assertTrue(authoritiesList.stream().anyMatch(a -> a.getAuthority().equals(ADMIN_ROLE)));
        assertTrue(authoritiesList.stream().anyMatch(a -> a.getAuthority().equals(USER_ROLE)));
        verify(authoritiesRepository, times(1)).findAll();
    }

    // =============== SAVE AUTHORITIES TESTS ===============

    @Test
    @DisplayName("saveAuthorities should persist authority successfully")
    void saveAuthorities_shouldPersistAuthoritySuccessfully() {
        Authorities authorityToSave = createTestAuthority(UUID.randomUUID(), "EDITOR");
        when(authoritiesRepository.save(authorityToSave)).thenReturn(authorityToSave);

        authoritiesService.saveAuthorities(authorityToSave);

        verify(authoritiesRepository, times(1)).save(authorityToSave);
    }

    @Test
    @DisplayName("saveAuthorities should handle multiple save operations")
    void saveAuthorities_shouldHandleMultipleSaveOperations() {
        Authorities authority1 = createTestAuthority(UUID.randomUUID(), "ADMIN");
        Authorities authority2 = createTestAuthority(UUID.randomUUID(), "USER");

        when(authoritiesRepository.save(any(Authorities.class))).thenReturn(authority1).thenReturn(authority2);

        authoritiesService.saveAuthorities(authority1);
        authoritiesService.saveAuthorities(authority2);

        verify(authoritiesRepository, times(2)).save(any(Authorities.class));
        verify(authoritiesRepository, times(1)).save(authority1);
        verify(authoritiesRepository, times(1)).save(authority2);
    }

    @Test
    @DisplayName("saveAuthorities should throw DataAccessException on database failure")
    void saveAuthorities_shouldThrowDataAccessExceptionOnDatabaseFailure() {
        Authorities authorityToSave = createTestAuthority(UUID.randomUUID(), "WRITER");
        when(authoritiesRepository.save(authorityToSave))
                .thenThrow(new org.springframework.dao.DataAccessException("DB Error") {
                });

        assertThrows(DataAccessException.class, () -> authoritiesService.saveAuthorities(authorityToSave));
        verify(authoritiesRepository, times(1)).save(authorityToSave);
    }

    @Test
    @DisplayName("saveAuthorities should preserve authority data during save")
    void saveAuthorities_shouldPreserveAuthorityDataDuringSave() {
        Authorities authorityToSave = createTestAuthority(UUID.randomUUID(), "SPECIAL_ROLE");
        String originalRole = authorityToSave.getAuthority();
        UUID originalId = authorityToSave.getId();

        when(authoritiesRepository.save(authorityToSave)).thenReturn(authorityToSave);

        authoritiesService.saveAuthorities(authorityToSave);

        assertEquals(originalRole, authorityToSave.getAuthority());
        assertEquals(originalId, authorityToSave.getId());
        verify(authoritiesRepository, times(1)).save(authorityToSave);
    }

    // =============== INTEGRATION TESTS ===============

    @Test
    @DisplayName("should handle CRUD operations for authorities")
    void shouldHandleCrudOperationsForAuthorities() {
        Authorities newAuthority = createTestAuthority(UUID.randomUUID(), "CONTRIBUTOR");
        when(authoritiesRepository.findByName("CONTRIBUTOR")).thenReturn(Optional.of(newAuthority));

        authoritiesService.saveAuthorities(newAuthority);
        Authorities foundAuthority = authoritiesService.findByAuthority("CONTRIBUTOR");

        assertNotNull(foundAuthority);
        assertEquals("CONTRIBUTOR", foundAuthority.getAuthority());
        verify(authoritiesRepository, times(1)).save(newAuthority);
        verify(authoritiesRepository, times(1)).findByName("CONTRIBUTOR");
    }

    @Test
    @DisplayName("findByAuthority should be case-sensitive")
    void findByAuthority_shouldBeCaseSensitive() {
        Authorities adminAuthority = createTestAuthority(UUID.randomUUID(), ADMIN_ROLE);
        when(authoritiesRepository.findByName(ADMIN_ROLE)).thenReturn(Optional.of(adminAuthority));
        when(authoritiesRepository.findByName("admin")).thenReturn(Optional.empty());

        Authorities foundAuthority = authoritiesService.findByAuthority(ADMIN_ROLE);
        assertNotNull(foundAuthority);

        assertThrows(ResourceNotFoundException.class, () -> authoritiesService.findByAuthority("admin"));
        verify(authoritiesRepository, times(1)).findByName(ADMIN_ROLE);
        verify(authoritiesRepository, times(1)).findByName("admin");
    }

    // =============== HELPER METHODS ===============

    private Authorities createTestAuthority(UUID id, String authority) {
        Authorities auth = new Authorities();
        auth.setId(id);
        auth.setAuthority(authority);
        return auth;
    }
}
