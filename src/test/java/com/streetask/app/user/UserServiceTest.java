package com.streetask.app.user;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.streetask.app.answer.AnswerRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AnswerRepository answerRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void findUserById_shouldIncludeReputation() {
        UUID userId = UUID.randomUUID();
        User user = new User();
        user.setId(userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(answerRepository.aggregateVotesByUserIds(anyCollection())).thenReturn(Arrays.asList(
            new Object[] { userId, 6L, 0L }));

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
            new Object[] { firstId, 3L, 1L },
            new Object[] { secondId, 0L, 2L }));

        Iterable<User> result = userService.findAll();

        User[] resultArray = ((List<User>) result).toArray(new User[0]);
        assertEquals(5, resultArray[0].getReputation());
        assertEquals(-2, resultArray[1].getReputation());
        verify(answerRepository).aggregateVotesByUserIds(anyCollection());
    }
}
