package com.streetask.app.functionalities.notifications.observers;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.streetask.app.answer.AnswerRepository;
import com.streetask.app.functionalities.notifications.events.AnswerCreatedEvent;
import com.streetask.app.functionalities.notifications.realtime.FrontendNotificationGateway;
import com.streetask.app.functionalities.notifications.realtime.FrontendNotificationMessage;
import com.streetask.app.model.Answer;
import com.streetask.app.model.Question;
import com.streetask.app.user.RegularUser;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AnswerActivityNotificationObserver {

    private final AnswerRepository answerRepository;
    private final FrontendNotificationGateway frontendNotificationGateway;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onAnswerCreated(AnswerCreatedEvent event) {
        Answer answer = answerRepository.findById(event.answerId()).orElse(null);
        if (answer == null || answer.getQuestion() == null) {
            return;
        }

        Question question = answer.getQuestion();
        RegularUser actor = answer.getUser();
        String actorEmail = actor != null ? actor.getEmail() : null;
        String actorName = actor != null && actor.getUserName() != null ? actor.getUserName() : "Someone";

        Set<String> recipientEmails = new LinkedHashSet<>();
        if (question.getCreator() != null && question.getCreator().getEmail() != null) {
            recipientEmails.add(question.getCreator().getEmail());
        }

        Iterable<Answer> questionAnswers = answerRepository.findByQuestionId(question.getId());
        for (Answer existingAnswer : questionAnswers) {
            if (existingAnswer.getUser() != null && existingAnswer.getUser().getEmail() != null) {
                recipientEmails.add(existingAnswer.getUser().getEmail());
            }
        }

        if (actorEmail != null) {
            recipientEmails.remove(actorEmail);
        }

        if (recipientEmails.isEmpty()) {
            return;
        }

        FrontendNotificationMessage payload = FrontendNotificationMessage.builder()
                .type("ANSWER_TO_QUESTION")
                .title("New activity on a followed question")
                .message(actorName + " answered: " + question.getTitle())
                .referenceId(question.getId())
                .referenceType("QUESTION")
                .timestamp(LocalDateTime.now())
                .build();

        for (String recipientEmail : recipientEmails) {
            frontendNotificationGateway.sendToUser(recipientEmail, payload);
        }
    }
}
