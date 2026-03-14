package com.streetask.app.functionalities.notifications.observers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.streetask.app.answer.AnswerRepository;
import com.streetask.app.functionalities.notifications.events.AnswerCreatedEvent;
import com.streetask.app.functionalities.notifications.push.dto.PushMessage;
import com.streetask.app.functionalities.notifications.push.service.PushNotificationService;
import com.streetask.app.functionalities.notifications.realtime.FrontendNotificationGateway;
import com.streetask.app.functionalities.notifications.realtime.FrontendNotificationMessage;
import com.streetask.app.model.Answer;
import com.streetask.app.model.Question;
import com.streetask.app.question.QuestionRepository;
import com.streetask.app.user.RegularUser;

@ExtendWith(MockitoExtension.class)
class AnswerActivityNotificationObserverTest {

    @Mock
    private AnswerRepository answerRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private FrontendNotificationGateway frontendNotificationGateway;

    @Mock
    private PushNotificationService pushNotificationService;

    private AnswerActivityNotificationObserver observer;

    @BeforeEach
    void setUp() {
        observer = new AnswerActivityNotificationObserver(
                answerRepository,
                questionRepository,
                frontendNotificationGateway,
                pushNotificationService);
    }

    @Test
    void notifiesQuestionCreatorEvenWhenCreatorIsMissingInAnswerQuestionReference() {
        UUID questionId = UUID.randomUUID();
        UUID answerId = UUID.randomUUID();

        RegularUser actor = new RegularUser();
        actor.setEmail("participant@streetask.com");
        actor.setUserName("participant");

        Question answerReferenceQuestion = new Question();
        answerReferenceQuestion.setId(questionId);

        Answer createdAnswer = new Answer();
        createdAnswer.setId(answerId);
        createdAnswer.setQuestion(answerReferenceQuestion);
        createdAnswer.setUser(actor);
        createdAnswer.setContent("Here is an answer");

        RegularUser creator = new RegularUser();
        creator.setEmail("creator@streetask.com");

        Question persistedQuestion = new Question();
        persistedQuestion.setId(questionId);
        persistedQuestion.setCreator(creator);

        when(answerRepository.findById(answerId)).thenReturn(Optional.of(createdAnswer));
        when(questionRepository.findById(questionId)).thenReturn(Optional.of(persistedQuestion));
        when(answerRepository.findByQuestionId(questionId)).thenReturn(List.of(createdAnswer));

        observer.onAnswerCreated(new AnswerCreatedEvent(answerId));

        ArgumentCaptor<String> recipientCaptor = ArgumentCaptor.forClass(String.class);
        verify(frontendNotificationGateway, times(1)).sendToUser(recipientCaptor.capture(),
                any(FrontendNotificationMessage.class));
        verify(pushNotificationService, times(1)).sendToUser(recipientCaptor.capture(), any(PushMessage.class));

        List<String> recipients = recipientCaptor.getAllValues();
        // First call is websocket recipient, second call is push recipient.
        org.junit.jupiter.api.Assertions.assertEquals("creator@streetask.com", recipients.get(0));
        org.junit.jupiter.api.Assertions.assertEquals("creator@streetask.com", recipients.get(1));
        verify(pushNotificationService, never()).sendToUser(eq("participant@streetask.com"), any(PushMessage.class));
    }
}