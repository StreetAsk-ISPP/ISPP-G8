package com.streetask.app.functionalities.notifications.observers;

import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.streetask.app.functionalities.notifications.events.QuestionCreatedEvent;
import com.streetask.app.functionalities.notifications.realtime.FrontendNotificationGateway;
import com.streetask.app.functionalities.notifications.realtime.FrontendNotificationMessage;
import com.streetask.app.functionalities.notifications.realtime.ZoneResolver;
import com.streetask.app.model.Question;
import com.streetask.app.question.QuestionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class NearbyQuestionNotificationObserver {

    private final QuestionRepository questionRepository;
    private final ZoneResolver zoneResolver;
    private final FrontendNotificationGateway frontendNotificationGateway;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onQuestionCreated(QuestionCreatedEvent event) {
        Question question = questionRepository.findById(event.questionId()).orElse(null);
        if (question == null || question.getLocation() == null) {
            log.info("Skipping NEARBY_QUESTION notification: question or location is null. questionId={}", event.questionId());
            return;
        }

        Double latitude = question.getLocation().getLatitude();
        Double longitude = question.getLocation().getLongitude();
        Double radiusKm = question.getRadiusKm() != null ? question.getRadiusKm().doubleValue() : 0d;

        Set<String> zoneKeys = zoneResolver.resolveZoneKeysWithinRadius(
                latitude,
                longitude,
                radiusKm);
        if (zoneKeys.isEmpty()) {
            log.info("Skipping NEARBY_QUESTION notification: no zones resolved. questionId={}", question.getId());
            return;
        }

        String primaryZoneKey = zoneResolver.resolveZoneKey(
                question.getLocation().getLatitude(),
                question.getLocation().getLongitude());

        FrontendNotificationMessage payload = FrontendNotificationMessage.builder()
                .type("NEARBY_QUESTION")
                .title("New question in your area")
                .message(question.getTitle())
                .referenceId(question.getId())
                .referenceType("QUESTION")
                .zoneKey(primaryZoneKey)
                .timestamp(LocalDateTime.now())
                .build();

        for (String zoneKey : zoneKeys) {
            frontendNotificationGateway.sendToZone(zoneKey, payload);
        }

        log.info("Published NEARBY_QUESTION notification for questionId={} to zones={}", question.getId(), zoneKeys);
    }
}
