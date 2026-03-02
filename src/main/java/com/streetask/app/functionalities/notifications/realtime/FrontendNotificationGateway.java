package com.streetask.app.functionalities.notifications.realtime;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class FrontendNotificationGateway {

    private final SimpMessagingTemplate messagingTemplate;

    @Value("${streetask.websocket.topic.zone-prefix:/topic/zones}")
    private String zoneTopicPrefix;

    @Value("${streetask.websocket.topic.zone-suffix:/notifications}")
    private String zoneTopicSuffix;

    @Value("${streetask.websocket.topic.user-queue:/queue/notifications}")
    private String userQueueDestination;

    public void sendToZone(String zoneKey, FrontendNotificationMessage message) {
        if (zoneKey == null || zoneKey.isBlank()) {
            return;
        }
        String destination = zoneTopicPrefix + "/" + zoneKey + zoneTopicSuffix;
        messagingTemplate.convertAndSend(destination, message);
        log.debug("Sent notification to zone destination={}", destination);
    }

    public void sendToUser(String username, FrontendNotificationMessage message) {
        if (username == null || username.isBlank()) {
            return;
        }
        messagingTemplate.convertAndSendToUser(username, userQueueDestination, message);
        log.debug("Sent notification to user username={} destination={}", username, userQueueDestination);
    }
}
